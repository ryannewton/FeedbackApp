require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // For authentication
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const aws = require('aws-sdk'); // load aws sdk

aws.config.loadFromPath('config.json'); // load aws config
const WebClient = require('@slack/client').WebClient; // for Slack

const request = require('request'); // Slack

const app = express();
const upload = multer(); // for parsing multipart/form-data
const ses = new aws.SES({ apiVersion: '2010-12-01' }); // load AWS SES

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

const connection = mysql.createConnection({
  user: 'root',
  password: 'buechelejedi16',
  port: '3306',
  database: 'feedbackappdb',

  // production database
  // host: 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

  // development database
  host: 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

const defaultFromEmail = 'moderator@collaborativefeedback.com';

connection.connect();

// **Slack**

// *Weekly Update*

// TO DO - Implement Weekly Timer
// weeklyUpdate();
// Interval to repush to Slack
//const slackInterval = 1000 * 60; // Each Minute
//setInterval(() => weeklyUpdate(), slackInterval);

// Called by Timer Each Thursday at 1am PT
// Gets team info and calls updateBoard for each team
function weeklyUpdate() {
  const connectionString = `DELETE FROM slackCurrentTable WHERE id > 0`;
  connection.query(connectionString, (err) => {
    if (err) reject(err)
    getTeamInfo()
    .then(teamInfo => {
      teamInfo.forEach((info) => updateBoard(info));
    })
  });
}

// Gets the list of teamId, botToken pairs from the database
function getTeamInfo() {
  return new Promise(
    function (resolve, reject) {
      const connectionString = `SELECT * FROM slackTeams`;
      connection.query(connectionString, (err, teams) => {
        if (err) reject(err);
        else resolve(teams);
      });
    }
  );
}

// Refreshes suggestion box channel and sends DMs for each team
function updateBoard(teamInfo) {
  const bot = new WebClient(teamInfo.botToken);

  getSuggestions(teamInfo.teamId) // Get list of suggestions associated with that teamId
  .then(suggestions => postSuggestionsAndDMs(suggestions, bot, teamInfo)) // Post suggestions which are older than 7 days, from least to most votes
  .catch(error => {
    console.log('ERROR in updateBoard: ', error);
  })
}

// Pulls the suggestion information from the database for a specific team
function getSuggestions(teamId) {
  return new Promise(
    function (resolve, reject) {
      const connectionString = `
        SELECT
          a.id,
          a.text,
          a.date,
          SUM(CASE WHEN b.voteType = 'agree' THEN 1 ELSE 0 END) AS totalAgrees,
          SUM(CASE WHEN b.voteType = 'disagree' THEN 1 ELSE 0 END) AS totalDisagrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'agree' THEN b.userId END)) AS uniqueAgrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'disagree' THEN b.userId END)) AS uniqueDisagrees  
        FROM
          slackSuggestions a
        JOIN
          slackVotes b
        ON
          a.id = b.suggestionId
        WHERE
          a.teamId=?
        GROUP BY
          a.id`;
      connection.query(connectionString, [teamId], (err, suggestions) => {
        if (err) reject(err);
        else resolve(suggestions);
      });
  });
}

function postSuggestionsAndDMs(suggestions, bot, teamInfo) { 
  // Input indicates the beginning of a board refresh
  let adjustedSuggestions = [{ text: 'new refresh'}];

  // Loads all messages posted over a week ago (which have already been DM'd out) organized by net number of votes
  adjustedSuggestions = [...adjustedSuggestions, ...suggestions
    .filter(suggestion => {
      const tempDate = new Date(suggestion.date);
      return tempDate.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7;
    })
    .sort((a, b) => (a.totalAgrees - a.totalDisagrees) - (b.totalAgrees - b.totalDisagrees))];

  // Adds the section between old and new feedback
  adjustedSuggestions.push({ text: 'filler' });

  // Adds the newer messages organized by date
  let newSuggestions = suggestions
    .filter(suggestion => {
      const tempDate = new Date(suggestion.date);
      return tempDate.getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 7;
    });

  adjustedSuggestions = [...adjustedSuggestions, ...newSuggestions];

  // Sends the messages as a promise chain to slack
  let channelPosts = adjustedSuggestions.reduce((promiseChain, item, index, array) => {
    return promiseChain.then(() => new Promise((resolve) => {
      postsToSuggestions(item, bot, resolve, index, array.length, newSuggestions.length, teamInfo);
    }));
  }, Promise.resolve());

  channelPosts.then(() => console.log('Published new board for ', teamInfo.teamId));

  // Sends DMs to users in the suggestions channel asking them to vote on suggestions from last 7 days
  getUsers(bot, teamInfo.channel)
  .then(users => {
    // Sends the messages as a promise chain to slack
    newSuggestions = [{text: 'start'}, ...newSuggestions];
    users.forEach(user => {
      console.log(newSuggestions);
      let dmPosts = newSuggestions.reduce((promiseChain, suggestion, index, array) => {
        return promiseChain.then(() => new Promise((resolve) => {
          sendDM(suggestion, user, bot, resolve);
        }));
      }, Promise.resolve());

      dmPosts.then(() => console.log('Sent DMs for ', user));
    });
  })
  .catch(error => {
    console.log('ERROR in Get Users: ', error);
  })  
}

function postsToSuggestions(suggestion, bot, resolve, index, totalCount, newCount, teamInfo) {
  const teamId = teamInfo.teamId;
  const channel = teamInfo.channel;
  const date = new Date(Date.now());

  if (suggestion.text === 'new refresh') {
    bot.chat.postMessage(channel, '\n******************************************************************\n>>>Suggestion Box Refresh ' + String(date.getDate()) + '/' + String(date.getMonth()+1) + '/' + String(date.getFullYear()), (err, res) => {
      if (err) return err;
      else resolve(200);
    });
  }
  else if (suggestion.text === 'filler') {
    bot.chat.postMessage(channel, '\n---------------------------------------------------------\n>>>:arrow_up: _All suggestions_ \n\n\n:arrow_down: _Suggestions submitted since 6/3_', (err, res) => {
      if (err) return err;
      else resolve(200);
    });
  } else {
    const date = new Date(suggestion.date);
    const headerPrefix = (index > totalCount - newCount - 1) ? (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ' : '#' + String(totalCount-index-newCount-1) + ') ';
    const header =  headerPrefix + suggestion.text.slice(0,30);
    
    bot.chat.postMessage(channel,
      '\n---------------------------------------------------------\n*' + header + '*\n```' + suggestion.text + '```\n\n' + suggestion.totalAgrees +' :+1: | ' + suggestion.totalDisagrees + ' :-1:   from   ' + suggestion.uniqueAgrees + ' :smiley: | ' + suggestion.uniqueDisagrees + ' :neutral_face:\n', (err, res) => {
      if (err) return err;
      else {        
        connection.query(`
          INSERT INTO slackCurrentTable (teamId, channelId, ts, suggestionId, headerPrefix)
          VALUES (?, ?, ?, ?, ?)`, [teamId, res.channel, res.ts, suggestion.id, headerPrefix], (err, res2) => { if (err) throw err });

        bot.reactions.add('thumbsup', { channel: res.channel, timestamp: res.ts }, (errReaction, resReaction) => {
          if (errReaction) return errReaction;
          else {
            bot.reactions.add('thumbsdown', { channel: res.channel, timestamp: res.ts }, (errReaction2, resReaction2) => {
              if (errReaction2) return errReaction2;
              else resolve(200);
            });
          }
        });
      };
    });
  }
}

// Gets a list of all the users to send a DM to (for upvoting)
function getUsers(bot, channel) {
  return new Promise(
    function (resolve, reject) {
      bot.channels.info(channel, (err, users) => {
        if (err) console.log('ERROR: getUsers ', err);
        bot.im.list((err, imHolder) => {
          if (err) throw err;
          let dmIds = [];
          imHolder.ims.forEach(im => {
            users.channel.members.forEach(user => {
              if (im.user === user) { dmIds.push(im.id) }
            });             
          });
          resolve(dmIds);
        });
      });
    }
  );
}

// Sends each user the text of the suggestion and an upvote button
function sendDM(suggestion, user, bot, resolve) {
  if (suggestion.text === 'start') {
    bot.chat.postMessage(user, '\n******************************************************************\n>>>New Suggestions: Week of 6/11/2017', (err) => {
      if (err) console.log('Error:', err);
      else resolve(200);
    });
  } else {
    const date = new Date(suggestion.date)
    const headerPrefix = (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ';
    const header = headerPrefix + suggestion.text.slice(0,30);

    bot.chat.postMessage(user, '\n---------------------------------------------------------\n*' + header + '*\n```' + suggestion.text + '```\n\n', {
      attachments: [
        {
          text: 'Do you agree with this suggestion?',
          fallback: 'Woops... sorry something went wrong...',
          callback_id: String(suggestion.id),
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'agree',
              text: 'I agree (upvote)',
              type: 'button',
              value: 'agree',
            },
            {
              name: 'skip',
              text: 'Meh... (skip)',
              type: 'button',
              value: 'skip',
            },
            {
              name: 'disagree',
              text: 'I disagree (downvote)',
              type: 'button',
              value: 'disagree',
            },
          ],
        },
      ],
    }, (err) => {
      if (err) console.log('Error:', err);
      else resolve(200);
    });
  }
}

// *Reaction Added / Removed*
app.post('/slack/events', upload.array(), (req, res) => {
  if (req.body.type === 'url_verification') {
    res.json({ challenge: req.body.challenge });
  }

  // Get info from Slack's JSON
  const teamId = req.body.team_id;
  const { type, user, reaction } = req.body.event;
  const { channel, ts } = req.body.event.item;
  let voteType;
  if (reaction === '+1') { voteType = "agree" }
  if (reaction === '-1') { voteType = "disagree" } 

  
  // Need to check for bot user id
  getTeamInfo()
  .then(teamInfo => { 
    const matchesBot = teamInfo.filter(info => info.botUserId === user);
  
    if (voteType && !matchesBot.length) {
      // Look for a match in our database (teamId, channel, ts)...
      connection.query(`
        SELECT suggestionId, headerPrefix FROM slackCurrentTable
        WHERE teamId = ? AND channelId = ? AND ts = ?`, [teamId, channel, ts], (err, rows) => {
          if (err) throw err
          if (rows.length) {
            // If there is a match pull the suggestion id...
            const suggestionId = rows[0].suggestionId;
            // Insert a vote
            let connectionString = (type === 'reaction_added') ? `
                INSERT INTO slackVotes (suggestionId, userId, voteType)
                VALUES (?, ?, ?)` : `
                DELETE FROM slackVotes
                WHERE suggestionId = ? AND userId = ? AND voteType = ?
                LIMIT 1`;

            connection.query(connectionString, [suggestionId, user, voteType], (errVote) => {
              if (errVote) throw errVote;
              // Pull the updated vote information
              getSuggestion(suggestionId, teamId)
              .then(suggestion => {
                connection.query(`
                  SELECT botToken FROM slackTeams
                  WHERE teamId = ?`, [teamId], (err, resToken) => {
                    if (err) throw err;
                    const bot = new WebClient(resToken[0].botToken);
                    // Update the post                      
                    const header = rows[0].headerPrefix + suggestion.text.slice(0,30);

                    const text = '\n---------------------------------------------------------\n*' + header + '*\n```' + suggestion.text + '```\n\n' + suggestion.totalAgrees +' :+1: | ' + suggestion.totalDisagrees + ' :-1:   from   ' + suggestion.uniqueAgrees + ' :smiley: | ' + suggestion.uniqueDisagrees + ' :neutral_face:\n';
                    bot.chat.update(ts, channel, text, { as_user: true }, (err, res) => { if (err) throw err });
                  }
                );
              });
            });
          }
      });
    }
  });
  
  res.sendStatus(200);
});

function getSuggestion(suggestionId, teamId) {
  return new Promise(
    function (resolve, reject) {
      const connectionString = `
        SELECT
          a.id,
          a.text,
          a.date,
          SUM(CASE WHEN b.voteType = 'agree' THEN 1 ELSE 0 END) AS totalAgrees,
          SUM(CASE WHEN b.voteType = 'disagree' THEN 1 ELSE 0 END) AS totalDisagrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'agree' THEN b.userId END)) AS uniqueAgrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'disagree' THEN b.userId END)) AS uniqueDisagrees  
        FROM
          slackSuggestions a
        JOIN
          slackVotes b
        ON
          a.id = b.suggestionId
        WHERE
          a.teamId=? AND a.id=?
        GROUP BY
          a.id`;
      connection.query(connectionString, [teamId, suggestionId], (err, suggestion) => {
        if (err) reject(err);
        else resolve(suggestion[0]);
      });
  });
}

// *Suggestion Submitted*
app.post('/slack/suggestion', upload.array(), (req, res) => {
  // Adds the suggestion to the suggestion table
  // Adds a vote for the suggestion
  // Posts the suggestion to the suggestions channel  
  const text = req.body.text;
  const userId = req.body.user_id;
  const teamId = req.body.team_id;
  
  connection.query(`
    INSERT INTO
      slackSuggestions (text, userId, teamId)
    VALUES
      (?, ?, ?)`, [text, userId, teamId], (err, res2) => {
    if (err) throw err;
    const suggestionId = res2.insertId;
    connection.query(`
      INSERT INTO slackVotes (suggestionId, userId, voteType)
      VALUES (?, ?, 'agree')`, [suggestionId, userId], (err) => {
      
      if (err) throw err;
      const date = new Date();
      const headerPrefix = (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ';
      const header =  headerPrefix + text.slice(0,30);
      
      connection.query(`
        SELECT botToken, channel FROM slackTeams
        WHERE teamId = ?`, [teamId], (err, teamInfo) => {
        
        if (err) throw err;
        const bot = new WebClient(teamInfo[0].botToken);

        bot.chat.postMessage(teamInfo[0].channel,
          '\n---------------------------------------------------------\n*' + header + '*\n```' + text + '```\n\n' + String(1) +' :+1: | ' + String(0) + ' :-1:   from   ' + String(1) + ' :smiley: | ' + String(0) + ' :neutral_face:\n', (err, res) => {
          if (err) return err;
          else {        
            connection.query(`
              INSERT INTO slackCurrentTable (teamId, channelId, ts, suggestionId, headerPrefix)
              VALUES (?, ?, ?, ?, ?)`, [teamId, res.channel, res.ts, suggestionId, headerPrefix], (err, res2) => { if (err) throw err });

            bot.reactions.add('thumbsup', { channel: res.channel, timestamp: res.ts }, (errReaction, resReaction) => {
              if (errReaction) return errReaction;
              else {
                bot.reactions.add('thumbsdown', { channel: res.channel, timestamp: res.ts }, (errReaction2, resReaction2) => {
                  if (errReaction2) return errReaction2;
                });
              }
            });
          };
        });
      });
    });   
  });

  res.json({
    text: 'Your idea ‘' + req.body.text + '’ has been posted!',
  });
});

// *Vote Received From DM Button Click*
app.post('/slack/vote', upload.array(), (req, res) => {
  console.log(JSON.parse(req.body.payload));
  const payload = JSON.parse(req.body.payload);
  const voteType = payload.actions[0].value;
  const userId = payload.user.id;
  const teamId = payload.team.id;
  const suggestionId = payload.callback_id;

  if (voteType === 'skip') {
    res.json({
      response_type: 'ephemeral',
      replace_original: true,
      text: 'Suggestion skipped: No vote recorded',
    });
  } else {
    // Insert a vote
    let connectionString = `
        INSERT INTO slackVotes (suggestionId, userId, voteType)
        VALUES (?, ?, ?)`;

    connection.query(connectionString, [suggestionId, userId, voteType], (errVote) => {
      if (errVote) throw errVote;

      connection.query(`
        SELECT teamId, channelId, ts, headerPrefix FROM slackCurrentTable
        WHERE suggestionId = ?`, [suggestionId], (err, rows) => {
        if (err) throw err
        if (rows.length) {
          // Pull the updated vote information
          getSuggestion(suggestionId, teamId)
          .then(suggestion => {
            connection.query(`
              SELECT botToken FROM slackTeams
              WHERE teamId = ?`, [teamId], (err, resToken) => {
                if (err) throw err;
                const bot = new WebClient(resToken[0].botToken);
                // Update the post
                const headerPrefix = rows[0].headerPrefix;                
                const header = headerPrefix + suggestion.text.slice(0,30);

                const text = '\n---------------------------------------------------------\n*' + header + '*\n```' + suggestion.text + '```\n\n' + suggestion.totalAgrees +' :+1: | ' + suggestion.totalDisagrees + ' :-1:   from   ' + suggestion.uniqueAgrees + ' :smiley: | ' + suggestion.uniqueDisagrees + ' :neutral_face:\n';
                bot.chat.update(rows[0].ts, rows[0].channelId, text, { as_user: true }, (err, res) => { if (err) throw err });
              }
            );
          });
        }
      });
    });

    if (voteType === 'agree') {
      res.json({
        response_type: 'ephemeral',
        replace_original: true,
        text: '# of Agree Votes increased by 1!',
      });
    } else {
      res.json({
        response_type: 'ephemeral',
        replace_original: true,
        text: '# of Disagree Votes increased by 1!',
      });
    }
  }  
});

// *New Account Set Up*
// TO DO -- route the user to the success screen
// TO DO -- post welcome messages to the suggestions channel
app.get('/slack/auth', (req, res) => {
  const options = {
    uri: 'https://slack.com/api/oauth.access?code='
        + req.query.code +
        '&client_id=' + process.env.CLIENT_ID +
        '&client_secret=' + process.env.CLIENT_SECRET,
    method: 'GET',
  };
  request(options, (error, response, body) => {
    const teamInfo = JSON.parse(body);
    if (!teamInfo.ok) {
      console.log(teamInfo);
      res.send('Error encountered: \n' + JSON.stringify(teamInfo)).status(200).end();
    } else {
      console.log(teamInfo);
      let connectionString = `
        INSERT INTO slackTeams (teamId, botToken, channel, botUserId)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE teamId=?, botToken=?, channel=?, botUserId=?`;
      connection.query(connectionString, [teamInfo.team_id, teamInfo.bot.bot_access_token, teamInfo.incoming_webhook.channel_id, teamInfo.bot.bot_user_id, teamInfo.team_id, teamInfo.bot.bot_access_token, teamInfo.incoming_webhook.channel_id, teamInfo.bot.bot_user_id], (errVote) => {
        if (errVote) throw errVote;
        res.send('Success!');
      });
    }
  });
});

// **Mobile App and Website**
function sendEmail(toEmail, fromEmail, subjectLine, bodyText) {
  ses.sendEmail({
    Source: fromEmail,
    Destination: { ToAddresses: toEmail },
    Message: {
      Subject: {
        Data: subjectLine,
      },
      Body: {
        Text: {
          Data: bodyText,
        },
      },
    },
  }
  , (err) => {
    if (err) console.log(err, err.stack);
  });
}

function generatePassword(len) {
  let password = '';
  let num;
  // Add random characters to password
  for (let i = 0; i < len; i++) {
    // Generate an integer between 33 & 125 (valid ascii chars)
    num = Math.random() * 10;
    num = Math.floor(num);
    password += String(num);
  }
  return password;
}

function getDomain(email) {
  const re = /@\w*\.\w*$|\.\w*\.\w*$/;
  return re.exec(email)[0].slice(1);
}

// Authentication
app.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(req.body.email)) {
    res.status(400).send('Sorry, this does not appear to be a valid email address :(');
  } else {
    // Step #1: Generate a code
    const code = generatePassword(4);
    console.log(code);

    // Step #2: Check to see if the user is already in the database
    let groupId;
    let connectionString = 'SELECT groupId FROM users WHERE email=?';
    connection.query(connectionString, [req.body.email], (err, rows) => {
      if (err) throw err;
      if (!rows.length) {
        // Step #2A: If not in database see if it has a default groupId
        connectionString = 'SELECT id FROM features WHERE school=?';
        connection.query(connectionString, [getDomain(req.body.email)], (err, rows) => {
          if (err) throw res.status(400).send('Sorry, this email does not appear to be set up in our system :(');
          if (!rows.length) {
            res.status(400).send('Sorry, this email does not appear to be set up in our system :(');
          } else {
            sendAuthEmailHelper(req, res, code, rows[0].id);
          }
        });
      } else {
        sendAuthEmailHelper(req, res, code, rows[0].groupId);
      }
    });
  }
});

function sendAuthEmailHelper(req, res, code, groupId) {
  // Step #3: Add the email, groupId, code, and timestamp to the database
  connection.query('INSERT INTO users (email, groupId, passcode) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE passcode=?, groupId=?, passcode_time=NOW()', [req.body.email, groupId, String(code), String(code), groupId], function(err) {
    if (err) throw err;
  });

  if (req.body.email.includes('admin_test')) {
    res.sendStatus(200);
  } else {
    console.log('email sent');
    // Step #3: Send an email with the code to the user (make sure it shows up in notification)
    sendEmail([req.body.email], defaultFromEmail, 'Collaborative Feedback: Verify Your Email Address', 'Enter this passcode: ' + String(code));
    res.sendStatus(200);
  }   
}

app.post('/authorizeUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  const connectionString = (req.body.code === 'apple') ? 'SELECT groupId FROM users WHERE email=?' : 'SELECT groupId FROM users WHERE email=? AND passcode=?';
  connection.query(connectionString, [req.body.email, req.body.code], (err, rows) => {
    if (err) throw res.status(400).send('Incorrect Code');
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    // Step #3: If it checks out then create a JWT token and send to the user
    if (rows.length) {
      const myToken = jwt.sign({ email: req.body.email, groupId: rows[0].groupId }, 'buechelejedi16');
      res.status(200).json(myToken);
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

app.post('/authorizeAdminUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  connection.query('SELECT groupId FROM users WHERE email=? AND passcode=?', [req.body.email, req.body.code], (err, rows) => {
    if (err) throw err;
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    // Step #3: If it checks out then create a JWT token and send to the user
    if ((rows.length || req.body.code === 'apple') && (req.body.adminCode === 'GSB2017' || req.body.adminCode === 'HBS2017' || req.body.adminCode === 'GYM2017')) {
      const myToken = jwt.sign({ email: req.body.email, groupId: rows[0].groupId }, 'buechelejedi16');
      res.status(200).json(myToken);
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

// Add Feedback, Projects, Solutions
app.post('/addFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const school = getDomain(decoded.email);

      // Send Email
      const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
      sendEmail(toEmails, defaultFromEmail, 'Feedback: ' + req.body.text, 'Email: ' + decoded.email);

      connection.query('INSERT INTO feedback (text, email, groupId, school, type) VALUES (?, ?, ?, ?, ?)', [req.body.text, decoded.email, decoded.groupId, school, req.body.type], (err2, result) => {
        if (err2) throw err2;
        res.json({ id: result.insertId });
      });
    }
  });
});

app.post('/addProject', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const title = (req.body.feedback.text) ? req.body.feedback.text : 'Blank Title';
      const school = (req.body.feedback.school) ? req.body.feedback.school : getDomain(decoded.email);
      const groupId = (req.body.feedback.groupId) ? req.body.feedback.groupId : decoded.groupId;

      connection.query('INSERT INTO projects SET ?', { title, groupId, description: 'Blank Description', votes: 0, downvotes: 0, stage: 'new', school, type: req.body.feedback.type }, (err2, result) => {
        if (err2) throw err2;
        if (req.body.feedback) {
          //sendEmail(['tyler.hannasch@gmail.com'], defaultFromEmail, 'A new project has been created for your feedback', 'The next step is to get people to upvote it so it is selected for action by the department heads');
          connection.query('UPDATE feedback SET project_id = ? WHERE id = ?', [result.insertId, req.body.feedback.id], (err3) => {
            if (err3) throw err3;
          });
        }
        res.json({ id: result.insertId });
      });
    }
  });
});

app.post('/addSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('INSERT INTO project_additions SET ?',
        {
          type: 'solution',
          votes: 0,
          downvotes: 0,
          title: req.body.title || 'Title Here',
          description: req.body.description || 'Description Here',
          project_id: req.body.project_id,
          school: getDomain(decoded.email),
          groupId: decoded.groupId,
          email: decoded.email,
          approved: !req.body.moderatorApprovalSolutions,
        }, (innerError, result) => {
          if (innerError) throw innerError;
          res.json({ id: result.insertId });
        });
    }
  });
});

app.post('/addSubscriber', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('INSERT INTO subscriptions SET ?',
        {
          project_id: req.body.projectId,
          email: decoded.email,
          type: req.body.type
        }, (err2) => {
        if (err2) throw err2;
        res.sendStatus(200);
      });
    }
  });
});

// Save Project, Project_Addition Changes
app.post('/saveProjectChanges', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('UPDATE projects SET votes = ?, downvotes = ?, title = ?, description = ? WHERE id= ?', [req.body.project.votes, req.body.project.downvotes, req.body.project.title, req.body.project.description, req.body.project.id], (err) => {
        if (err) throw err;
      });
      res.sendStatus(200);
    }
  });
});

var addSubscriber = function(req, res, next) {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('INSERT INTO subscriptions SET ?',
        {
          project_id: req.body.project_addition.id,
          email: decoded.email,
          type: 'up vote solution'
        }, (err2) => {
        if (err2) throw err2;
      });
    }
  });
  next();
};

app.post('/saveProjectAdditionChanges', upload.array(), addSubscriber, (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('UPDATE project_additions SET votes = ?, downvotes = ?, title = ?, description = ?, approved = ? WHERE id= ?',
        [
          req.body.project_addition.votes,
          req.body.project_addition.downvotes,
          req.body.project_addition.title,
          req.body.project_addition.description,
          req.body.project_addition.approved,
          req.body.project_addition.id,
        ], (innerError) => {
          if (innerError) throw innerError;
        });
      res.sendStatus(200);
    }
  });
});

// Delete Projects, Project_Additions
app.post('/deleteProject', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('DELETE FROM projects WHERE id = ?', [req.body.id], (err) => {
        if (err) throw err;
      });
      res.sendStatus(200);
    }
  });
});

app.post('/deleteProjectAddition', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('DELETE FROM project_additions WHERE id = ?', [req.body.id], (err2) => {
        if (err2) throw err2;
      });
      res.sendStatus(200);
    }
  });
});

// Pull Feedback, Projects, Project Additions, Discussion Posts, and Features
app.post('/pullFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `
        SELECT
          *
        FROM
          feedback
        WHERE
          time
            BETWEEN ? AND ?
        AND
          groupId = ?`;
      connection.query(connectionString, [req.body.startDate, req.body.endDate, decoded.groupId], (err2, rows) => {
        if (err2) res.status(400).send('Invalid Token');
        else {
          res.json(rows);
        }
      });
    }
  });
});

app.post('/pullProjects', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `
        SELECT
          id, title, votes, downvotes, description, department, stage, type
        FROM
          projects
        WHERE
          groupId=?`;
      connection.query(connectionString, [decoded.groupId], (err2, rows) => {
        if (err2 || !decoded.groupId) res.status(400).send('Invalid Token');
        else res.send(rows);
      });
    }
  });
});

app.post('/pullProjectAdditions', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `
        SELECT
          id, type, votes, downvotes, title, description, project_id, approved
        FROM
          project_additions
        WHERE
          groupId=?`;
      connection.query(connectionString, [decoded.groupId], (err2, rows) => {
        if (err2) res.status(400).send('Invalid Token');
        else res.send(rows);
      });
    }
  });
});

app.post('/pullFeatures', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `
        SELECT
          moderator_approval AS moderatorApproval,
          moderator_approval_solutions AS moderatorApprovalSolutions,
          show_status AS showStatus,
          enable_new_feedback AS enableNewFeedback,
          positive_feedback_box AS positiveFeedbackBox,
          ? AS domain,
          ? AS email
        FROM
          features
        WHERE
          id=?`;
      connection.query(connectionString, [getDomain(decoded.email), decoded.email, decoded.groupId], (err2, rows) => {
        if (err2) res.status(400).send('Invalid Token');
        else res.send(rows);
      });
    }
  });
});

app.listen(8081, () => {
 console.log('Example app listening on port 8081!');
});

// app.listen(3000, () => {
//   console.log('Example app listening on port 3000!');
// });
