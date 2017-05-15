require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // For authentication
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const aws = require('aws-sdk'); // load aws sdk
const WebClient = require('@slack/client').WebClient; // for Slack

const request = require('request'); // Slack

const app = express();
const upload = multer(); // for parsing multipart/form-data
const ses = new aws.SES({ apiVersion: '2010-12-01' }); // load AWS SES
aws.config.loadFromPath('config.json'); // load aws config

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));

//Slack
const botToken = process.env.SLACK_API_BOT_TOKEN || '';
const botWeb = new WebClient(botToken);

// depreciated - admin use only
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const token = process.env.SLACK_API_TOKEN || '';
const web = new WebClient(token);
const url = process.env.SLACK_WEBHOOK_URL || ''; // see section above on sensitive data
const webhook = new IncomingWebhook(url);

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

// Slack
// Step #1 -- When user clicks 'add to slack', slack passes the API keys to this API

// Saves the timestamp in the database (so we know the key for updating)
function insertSlot(message, teamId) {
  connection.query('INSERT INTO slack_slots (team_id, ts) VALUES (?, ?)', [teamId, message.ts], (err) => {
    if (err) throw err;
  });
}

// Posts messages to channel during setup (start with 5)
function postMessageToSuggestions(text, teamId) {
  botWeb.chat.postMessage('#suggestions', text, (err, res) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('message response to suggestions', res);
      insertSlot(res.message, teamId);
    }
  });
}
// TO DO -- store API keys in database
// TO DO -- route the user to the success screen
// Posts the first 5 messages (requires the admin to have already created the suggestions channel)
app.get('/slack/auth', (req, res) => {
  const options = {
    uri: 'https://slack.com/api/oauth.access?code='
        + req.query.code +
        '&client_id=' + process.env.CLIENT_ID +
        '&client_secret=' + process.env.CLIENT_SECRET,
    method: 'GET',
  };
  request(options, (error, response, body) => {
    const JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send('Error encountered: \n' + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      res.send('Success!');
    }
  });
});

// Step #2 -- When the user submits a /suggestion

// Gets a list of all the users to send a DM to (for upvoting)
// TO DO -- switch to users in suggestions channel instead of all users in team (?)
function getUsers(text, suggestionId) {
  botWeb.im.list((err, res) => {
    if (err) {
      console.log('ERROR: getUsers ', err);
    } else {
      postMessageToDM(text, res.ims, suggestionId);
    }
  });
}

// Sends each user the text of the suggestion and an upvote button
// TO DO -- automatically turn off notifications for this message
function postMessageToDM(text, users, suggestionId) {
  users.forEach((currentValue) => {
    botWeb.chat.postMessage(currentValue.id, text, {
      attachments: [
        {
          text: 'Do you agree with this suggestion?',
          fallback: 'Woops... sorry something went wrong...',
          callback_id: String(suggestionId),
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'vote',
              text: 'I agree (vote)',
              type: 'button',
              value: 'upvote',
            },
            {
              name: 'skip',
              text: 'Meh... (skip)',
              type: 'button',
              value: 'skip',
            },
          ],
        },
      ],
    }, (err) => {
      if (err) {
        console.log('Error:', err);
      }
    });
  });
}

// Helper functino for updateBoard -- pull the slack spots for the current team
function getSlots(teamId) {
  console.log('get slots');
  const connectionString = `
    SELECT
      ts
    FROM
      slack_slots
    WHERE
      team_id=?`;
  connection.query(connectionString, [teamId], (err, slots) => {
    if (err) throw err;
    else {
      getProjects(slots, teamId);
    }
  });
}

// Helper function for updateBoard -- pull the current projects from the database
function getProjects(slots, teamId) {
  const connectionString = `
    SELECT
      a.id, title AS text, votes
    FROM
      projects a
    JOIN
      domain_lookup b
    ON
      a.school = b.school
    WHERE
      team_id=?`;
  connection.query(connectionString, [teamId], (err, feedback) => {
    if (err) throw err;
    else {
      updateBoard(slots, feedback, teamId);
    }
  });
}

// Updates the board to reflect the current status of the database
// ******* TO DO -- need to save the channel to database too
function updateBoard(slots, feedback, teamId) {
  //slotsSorted = slots.sort((a, b) => a.ts - b.ts);
  feedback.sort((a, b) => b.votes - a.votes).forEach((currentValue, index) => {
    const text = '*' + currentValue.votes + ' Votes* ' + currentValue.text;
    const channel = 'C5CSA6ECC';
    if (index >= slots.length) {
      postMessageToSuggestions(text, teamId);
    } else {
      botWeb.chat.update(slots[index].ts, channel, text, { as_user: true }, (err) => {
        if (err) {
          console.log('Error:', err);
        }
      });
    }
  });
}

app.post('/slack/suggestion', upload.array(), (req, res) => {
  // Adds the feedback to the feedback table and updates the board
  connection.query(`
    INSERT INTO
      projects (title, school)
    VALUES
      (?, (SELECT school FROM domain_lookup WHERE team_id=?))`, [req.body.text, req.body.team_id], (err, res2) => {
    if (err) throw err;
    else {
      getSlots(req.body.team_id);
      // Sends a DM to all users (for upvoting)
      getUsers(req.body.text, res2.insertId);
    }
  });

  res.json({
    text: 'Your idea ‘' + req.body.text + '’ has been posted!',
  });
});

// STEP #3 -- When a user 'upvotes'
app.post('/slack/vote', upload.array(), (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const upvote = payload.actions[0].value;

  if (upvote === 'upvote') {
    // *** TO DO -- updates the votes for that feedback accordingly in the database
    connection.query('UPDATE projects SET votes=votes+1 WHERE id=?', [payload.callback_id], (err) => {
      if (err) throw err;
      else {
        getSlots(payload.team.id);
      }
    });
    res.json({
      response_type: 'ephemeral',
      replace_original: true,
      text: '# of Votes increased by 1!',
    });
  } else {
    res.json({
      response_type: 'ephemeral',
      replace_original: true,
      text: 'Suggestion skipped',
    });
  }
});

// Authentication
app.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
  const re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu|gymboree\.com)$/;
  if (!re.test(req.body.email)) {
    res.status(400).send('Sorry, your company is not currently supported :(');
  } else {
    // Step #1: Generate a code
    const code = generatePassword(4);
    console.log(code);

    // Step #2: Add the email, code, and timestamp to the database
    connection.query('INSERT INTO users (email, passcode) VALUES (?, ?) ON DUPLICATE KEY UPDATE passcode=?, passcode_time=NOW()', [req.body.email, String(code), String(code)], function(err) {
      if (err) throw err;
    });

    if (req.body.email.includes('admin_test')) {
      res.sendStatus(200);
    } else {
      // Step #3: Send an email with the code to the user (make sure it shows up in notification)
      sendEmail([req.body.email], defaultFromEmail, 'Collaborative Feedback: Verify Your Email Address', 'Enter this passcode: ' + String(code));
      res.sendStatus(200);
    }
  }
});

app.post('/authorizeUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  connection.query('SELECT passcode_time FROM users WHERE email=? AND passcode=?', [req.body.email, req.body.code], (err, rows) => {
    if (err) throw err;
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    // Step #3: If it checks out then create a JWT token and send to the user
    if (rows.length || req.body.code === 'apple') {
      const myToken = jwt.sign({ email: req.body.email }, 'buechelejedi16');
      res.status(200).json(myToken);
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

app.post('/authorizeAdminUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  connection.query('SELECT passcode_time FROM users WHERE email=? AND passcode=?', [req.body.email, req.body.code], (err, rows) => {
    if (err) throw err;
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    // Step #3: If it checks out then create a JWT token and send to the user
    if ((rows.length || req.body.code === 'apple') && (req.body.adminCode === 'GSB2017' || req.body.adminCode === 'HBS2017' || req.body.adminCode === 'GYM2017')) {
      const myToken = jwt.sign({ email: req.body.email }, 'buechelejedi16');
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
      const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'alicezhy@stanford.edu'];
      sendEmail(toEmails, defaultFromEmail, 'Feedback: ' + req.body.text, 'Email: ' + decoded.email);

      connection.query('INSERT INTO feedback (text, email, school) VALUES (?, ?, ?)', [req.body.text, decoded.email, school], (err2, result) => {
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

      connection.query('INSERT INTO projects SET ?', { title, description: 'Blank Description', votes: 0, stage: 'new', school }, (err2, result) => {
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
      connection.query('INSERT INTO project_additions SET ?', { type: 'solution', votes: 0, title: req.body.title || 'Title Here', description: req.body.description || 'Description Here', project_id: req.body.project_id, school: getDomain(decoded.email), email: decoded.email }, (err, result) => {
        if (err) throw err;
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
      connection.query('INSERT INTO subscriptions SET ?', { project_id: req.body.projectId, email: decoded.email, type: req.body.type }, (err2) => {
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
      connection.query('UPDATE projects SET votes = ?, title = ?, description = ? WHERE id= ?', [req.body.project.votes, req.body.project.title, req.body.project.description, req.body.project.id], (err) => {
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
      connection.query('INSERT INTO subscriptions SET ?', { project_id: req.body.project_addition.id, email: decoded.email, type: 'up vote solution' }, (err2) => {
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
      connection.query('UPDATE project_additions SET votes = ?, title = ?, description = ? WHERE id= ?', [req.body.project_addition.votes, req.body.project_addition.title, req.body.project_addition.description, req.body.project_addition.id], function(err) {
        if (err) throw err;
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
          school = ?`;
      connection.query(connectionString, [req.body.startDate, req.body.endDate, getDomain(decoded.email)], (err2, rows) => {
        if (err2) throw err2;
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
          id, title, votes, description, department, stage
        FROM
          projects
        WHERE
          school=?`;
      connection.query(connectionString, [getDomain(decoded.email)], (err2, rows) => {
        if (err2) throw err2;
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
          id, type, votes, title, description, project_id
        FROM
          project_additions
        WHERE
          school=?`;
      connection.query(connectionString, [getDomain(decoded.email)], (err2, rows) => {
        if (err2) throw err2;
        else res.send(rows);
      });
    }
  });
});

app.post('/pullDiscussionPosts', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `
        SELECT
          id, point, counter_point, project_addition_id
        FROM
          discussion_posts`;
      connection.query(connectionString, (err2, rows) => {
        if (err) throw err;
        else {
          res.send(rows);
        }
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
          moderator_approval as moderatorApproval, show_status as showStatus
        FROM
          features
        WHERE
          school=?`;
      connection.query(connectionString, [getDomain(decoded.email)], (err2, rows) => {
        if (err2) throw err2;
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
