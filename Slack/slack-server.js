require('dotenv').config();

const multer = require('multer');
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const express = require('express');
const mysql = require('mysql');
const WebClient = require('@slack/client').WebClient; // for Slack
const request = require('request'); // Slack

const upload = multer(); // for parsing multipart/form-data
const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

const connection = mysql.createConnection({
  user: 'root',
  password: 'buechelejedi16',
  port: '3306',
  database: 'feedbackappdb',

  // production database
  host: 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

  // development database
  // host: 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

const defaultFromEmail = 'moderator@collaborativefeedback.com';

connection.connect();

// **Slack**

// *Weekly Update*

weeklyUpdate();
// Interval to repush to Slack
const slackInterval = 1000 * 60 * 60 * 6; // Every six hours hour
setInterval(() => weeklyUpdate(), slackInterval);

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
          a.new,
          SUM(CASE WHEN b.voteType = 'agree' THEN 1 ELSE 0 END) AS totalAgrees,
          SUM(CASE WHEN b.voteType = 'disagree' THEN 1 ELSE 0 END) AS totalDisagrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'agree' THEN b.userId END)) AS uniqueAgrees,
          COUNT(DISTINCT (CASE WHEN b.voteType = 'disagree' THEN b.userId END)) AS uniqueDisagrees  
        FROM
          slackSuggestions a
        LEFT JOIN
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
    .filter(suggestion => !suggestion.new)
    .sort((a, b) => (a.totalAgrees - a.totalDisagrees) - (b.totalAgrees - b.totalDisagrees))];

  // Adds the section between old and new feedback
  adjustedSuggestions.push({ text: 'filler' });

  // Adds the newer messages organized by date
  let newSuggestions = suggestions.filter(suggestion => suggestion.new);

  adjustedSuggestions = [...adjustedSuggestions, ...newSuggestions];

  // Sends the messages as a promise chain to slack
  let channelPosts = adjustedSuggestions.reduce((promiseChain, item, index, array) => {
    return promiseChain.then(() => new Promise((resolve) => {
      postsToSuggestions(item, bot, resolve, index, adjustedSuggestions.length, newSuggestions.length, teamInfo);
    }));
  }, Promise.resolve());

  channelPosts.then(() => {
    const connectionString = `UPDATE slackSuggestions SET new=0 WHERE teamId=?`;
    connection.query(connectionString, [teamInfo.teamId], (err) => { if (err) throw err });

    console.log('Published new board for ', teamInfo.teamId);
  });

  // Sends DMs to users in the suggestions channel asking them to vote on suggestions from last 7 days
  if (newSuggestions.length) { //Don't DM if no new suggestions
    getUsers(bot, teamInfo.channel)
    .then(users => {
      // Sends the messages as a promise chain to slack
      newSuggestions = [{text: 'start'}, ...newSuggestions];
      users.forEach(user => {
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
    });  
  }
}

function postsToSuggestions(suggestion, bot, resolve, index, totalCount, newCount, teamInfo) {
  const teamId = teamInfo.teamId;
  const channel = teamInfo.channel;
  
  if (suggestion.text === 'new refresh') {
    const date = new Date(Date.now());
    bot.chat.postMessage(channel, '*Suggestion Box Refresh (' + String(date.getMonth()+1) + '/' + String(date.getDate()) + '/' + String(date.getFullYear()) + ')*',
      {
        "attachments": [
          {
              "fallback": "Suggestion box logo.",
              "color": "#36a64f",
              "image_url": "https://s3-us-west-2.amazonaws.com/feedback-app-images/yb_branner.png",
          },
          {
            "fallback": "Suggestion box refresh header.",
            "color": "#36a64f",
            "text": "Step #1 - Post suggestions using the /idea command from any channel\nStep #2 - Vote for or against suggestions using the emojis below",      
          }
        ],
      }, (err, res) => {
        if (err) return err;
        else resolve(200);
      });
  }
  else if (suggestion.text === 'filler') {
    const date = new Date(Date.now() - slackInterval)
    bot.chat.postMessage(channel, '\n---------------------------------------------------------\n>>>:arrow_up: _All suggestions_ \n\n\n:arrow_down: _Suggestions submitted since ' + String(date.getMonth()+1) + '/' + String(date.getDate()) + '/' + String(date.getFullYear()) + '_', (err, res) => {
      if (err) return err;
      else resolve(200);
    });
  } else {
    const date = new Date(suggestion.date);
    const headerPrefix = suggestion.new ? (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ' : '#' + String(totalCount-index-newCount-1) + ') ';
    const header =  headerPrefix + suggestion.text.slice(0,30) + '...';
    
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
    const date = new Date(Date.now()-slackInterval)
    bot.chat.postMessage(user, '\n******************************************************************\n>>>New Suggestions: Week of ' + String(date.getMonth()+1) + '/' + String(date.getDate()) + '/' + String(date.getFullYear()), (err) => {
      if (err) console.log('Error:', err);
      else resolve(200);
    });
  } else {
    const date = new Date(suggestion.date)
    const headerPrefix = (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ';
    const header = headerPrefix + suggestion.text.slice(0,30) + '...';

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
  else {
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
                      const header = rows[0].headerPrefix + suggestion.text.slice(0,30) + '...';

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
  }
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
      date = new Date();
      const headerPrefix = (String(date.getMonth()+1) + '/' + String(date.getDate())) + ' - ';
      const header =  headerPrefix + text.slice(0,30) + '...';
      
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
                const header = headerPrefix + suggestion.text.slice(0,30) + '...';

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
      res.send('Error encountered: \n' + JSON.stringify(teamInfo)).status(200).end();
    } else {
      const admin = new WebClient(teamInfo.access_token);
      admin.channels.create('#suggestions', (err, response) => {
        if (err) { console.log('Error in channel creation', err) }
        let connectionString = `
          INSERT INTO slackTeams (teamId, botToken, channel, botUserId)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE teamId=?, botToken=?, channel=?, botUserId=?`;
        const params = [teamInfo.team_id, teamInfo.bot.bot_access_token, response.channel.id, teamInfo.bot.bot_user_id];
        connection.query(connectionString, [...params, ...params], (errVote) => {
          if (errVote) throw errVote;
          res.send('Success!');
        });
      });      
    }
  });
});

app.listen(8081, () => {
 console.log('Example app listening on port 8081!');
});
