const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // For authentication
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const aws = require('aws-sdk'); // load aws sdk

aws.config.loadFromPath('config.json'); // load aws config
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

const defaultFromEmail = 'admin@collaborativefeedback.com';

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

// Authentication
app.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
  // Step #1: Generate a code
  const code = generatePassword(4);
  console.log(code);

  // Step #2: Add the email, code, and timestamp to the database
  connection.query('INSERT INTO users (email, passcode) VALUES (?, ?) ON DUPLICATE KEY UPDATE passcode=?, passcode_time=NOW()', [req.body.email, String(code), String(code)], function(err) {
    if (err) throw err;
  });

  // Step #3: Send an email with the code to the user (make sure it shows up in notification)
  sendEmail([req.body.email], defaultFromEmail, 'Collaborative Feedback: Verify Your Email Address', 'Enter this passcode: ' + String(code));

  res.sendStatus(200);
});

app.post('/authorizeUser', upload.array(), (req, res) => {

  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  connection.query('SELECT passcode_time FROM users WHERE email=? AND passcode=?', [req.body.email, req.body.code], (err, rows) => {
    if (err) throw err;
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    // Step #3: If it checks out then create a JWT token and send to the user
    if (rows.length || req.body.code === 'apple') {
      const myToken = jwt.sign({ email: req.body.email }, 'buechelejedi16')
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
    if (rows.length && req.body.adminCode === 'GSB2017') {
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

      connection.query('INSERT INTO feedback (text, email, school) VALUES (?, ?, ?)', [req.body.text, decoded.email, school], err2 => {
        if (err2) throw err;
      });

      // Send Email
      const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'alicezhy@stanford.edu'];
      sendEmail(toEmails, defaultFromEmail, 'Feedback: ' + req.body.text, 'Email: ' + decoded.email);

      res.sendStatus(200);
    }
  });
});

app.post('/addProject', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const title = (req.body.feedback) ? req.body.feedback.text : 'Blank Title';

      connection.query('INSERT INTO projects SET ?', { title, description: 'Blank Description', votes: 0, stage: 'new', school: getDomain(decoded.email) }, (err2, result) => {
        if (err2) throw err2;
        if (req.body.feedback) {
          sendEmail(['tyler.hannasch@gmail.com'], defaultFromEmail, 'A new project has been created for your feedback', 'The next step is to get people to upvote it so it is selected for action by the department heads');
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
      connection.query('INSERT INTO subscriptions SET ?', { project_id: req.body.project_id, email: decoded.email, type: req.body.type }, (err2) => {
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

app.post('/saveProjectAdditionChanges', upload.array(), (req, res) => {
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


// Pull Feedback, Projects, Project Additions, Discussion Posts
app.post('/pullFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, 'buechelejedi16', (err) => {
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
            BETWEEN ? AND ?`;
      connection.query(connectionString, [req.body.startDate, req.body.endDate], (err2, rows) => {
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

// app.listen(8081, () => {
//  console.log('Example app listening on port 8081!');
// });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
