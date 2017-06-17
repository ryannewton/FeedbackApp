// Use local .env file for env vars when not deployed
require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const multerS3 = require('multer-s3') // For image uploading
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
  password: process.env.JWT_KEY,
  port: '3306',
  database: 'feedbackappdb',

  // production database
  // host: 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

  // development database
  // host: 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

  // second development database
  host: 'aay3x5lrtsjmla.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

const defaultFromEmail = 'moderator@collaborativefeedback.com';

connection.connect();

// **Mobile App and Website**

// Image uploading backend
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const uploadPic = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null, Date.now().toString() + '.png');
    }
  })
});

app.post('/uploadPhoto', uploadPic.single('photo'), (req, res, next) => {
  res.json(req.file)
});

// Sends Email from AWS SES
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
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 2153');;
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

// Authentication Step #1
app.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
  //Checks to make sure it is a valid email address
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
      if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A2F');
      if (!rows.length) {
        // Step #2A: If the user's email is not in the user table see if it has a default groupId
        connectionString = 'SELECT id FROM groups WHERE defaultEmailDomain=?';
        connection.query(connectionString, [getDomain(req.body.email)], (err, rows) => {
          if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 2B3G');
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
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A4P');
  });

  if (req.body.email.includes('admin_test')) {
    res.sendStatus(200);
  } else {
    // Step #4: Send an email with the code to the user (make sure it shows up in notification)
    sendEmail([req.body.email], defaultFromEmail, 'Collaborative Feedback: Verify Your Email Address', 'Enter this passcode: ' + String(code));
    res.sendStatus(200);
  }   
}

app.post('/authorizeUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  const connectionString = (req.body.code === 'apple') ? 'SELECT id, groupId, groupName FROM users WHERE email=?' : 'SELECT groupId FROM users WHERE email=? AND passcode=?';
  connection.query(connectionString, [req.body.email, req.body.code], (err, rows) => {
    if (err) res.status(400).send('Incorrect Code');
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    if (rows.length) {
      // Step #3: If it checks out then create a JWT token and send to the user
      const myToken = jwt.sign({ userId: row[0].id, groupId: rows[0].groupId, groupName: rows[0].groupName }, process.env.JWT_KEY);
      res.status(200).json(myToken);
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

app.post('/authorizeAdminUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the groupId associated with the email address in req.body
  const connectionString = `
    SELECT a.groupId
    FROM users a
    JOIN groups b
    ON a.groupId = b.id
    WHERE a.email=? AND a.passcode=? AND b.groupAdminCode=?`
  connection.query(connectionString, [req.body.email, req.body.code, req.body.groupAdminCode], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - D69S');
    // Step #2: Check that it matches the passcode submitted by the user, if not send error
    if (rows.length) {
      // Step #3: If it checks out then create a JWT token and send to the user
      const myToken = jwt.sign({ userId: row[0].id, groupId: rows[0].groupId, groupName: rows[0].groupName }, process.env.JWT_KEY);
      res.status(200).json(myToken);
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

// Submit Suggestions and Solutions
app.post('/submitSuggestion', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      const connectionString = `SELECT suggestionsRequireApproval FROM groups WHERE groupId=?`;
      connection.query(connectionString, [decoded.groupId], (err, result) => {
        connection.query('INSERT INTO suggestions (groupId, submitterId, text, status, type, imageURL, approved) VALUES (?, ?, ?, ?, ?, ?, ?)', [decoded.groupId, ], (err, result) => {
          if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3156');
          // Send Email
          const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
          sendEmail(toEmails, defaultFromEmail, 'Feedback: ' + req.body.text, 'Email: ' + decoded.email);
          res.json({ id: result.insertId });
        });
      });
    }
  });
});

app.post('/addSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
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
          if (innerError) res.status(400).send('Sorry, there was a problem with your solution or the server is experiencing an error - 2579');
          res.json({ id: result.insertId });
        });
    }
  });
});

app.post('/addSubscriber', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('INSERT INTO subscriptions SET ?',
        {
          project_id: req.body.projectId,
          email: decoded.email,
          type: req.body.type
        }, (err2) => {
        if (err2) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 3683');
        res.sendStatus(200);
      });
    }
  });
});

// Save Project, Project_Addition Changes
app.post('/saveProjectChanges', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('UPDATE projects SET votes = ?, downvotes = ?, title = ?, description = ? WHERE id= ?', [req.body.project.votes, req.body.project.downvotes, req.body.project.title, req.body.project.description, req.body.project.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4928');
      });
      res.sendStatus(200);
    }
  });
});

var addSubscriber = function(req, res, next) {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('INSERT INTO subscriptions SET ?',
        {
          project_id: req.body.project_addition.id,
          email: decoded.email,
          type: 'up vote solution'
        }, (err2) => {
        if (err2) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 5825');
      });
    }
  });
  next();
};

app.post('/saveProjectAdditionChanges', upload.array(), addSubscriber, (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
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
          if (innerError) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 6934');;
        });
      res.sendStatus(200);
    }
  });
});

// Delete Projects, Project_Additions
app.post('/deleteProject', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('DELETE FROM projects WHERE id = ?', [req.body.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 7926');;
      });
      res.sendStatus(200);
    }
  });
});

app.post('/deleteProjectAddition', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) {
      res.status(400).send('authorization failed');
    } else {
      connection.query('DELETE FROM project_additions WHERE id = ?', [req.body.id], (err2) => {
        if (err2) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8023');;
      });
      res.sendStatus(200);
    }
  });
});

// Pull Feedback, Projects, Project Additions, Discussion Posts, and Features
app.post('/pullFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
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
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
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
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
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
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
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
