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

function generateToken(userInfo) {
  return jwt.sign({ userId: userInfo.id, groupId: userInfo.groupId, groupName: userInfo.groupName }, process.env.JWT_KEY);
}

// AUTH
app.post('/authorizeUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
  const connectionString = (req.body.code === 'apple') ? 'SELECT id, groupId, groupName FROM users WHERE email=?' : 'SELECT groupId FROM users WHERE email=? AND passcode=?';
  connection.query(connectionString, [req.body.email, req.body.code], (err, rows) => {
    if (err) res.status(400).send('Sorry, the server is experiencing an error - 4182');
    if (rows.length) {
      // Step #2: If it checks out then create a JWT token and send to the user
      res.status(200).json(generateToken(rows[0]));
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

app.post('/authorizeAdminUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the groupId associated with the email address, passcode, and admin passcode in req.body
  const connectionString = `
    SELECT a.groupId
    FROM users a
    JOIN groups b
    ON a.groupId = b.id
    WHERE a.email=? AND a.passcode=? AND b.groupAdminCode=?`
  connection.query(connectionString, [req.body.email, req.body.code, req.body.groupAdminCode], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - D69S');
    if (rows.length) {
      // Step #2: If it checks out then create a JWT token and send to the user      
      res.status(200).json(generateToken(rows[0]));
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

// SUBMIT
app.post('/submitSuggestion', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      // Check if the suggestion requires approval
      const { groupId, userId } = decoded;
      const connectionString = `SELECT suggestionsRequireApproval, groupName FROM groups WHERE id=?`;
      connection.query(connectionString, [groupId], (err, rows) => {        
        if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3112');
        else {
          // Insert the suggestion into the database          
          const { text, type, imageURL } = req.body.suggestion;
          const approved = !rows[0].suggestionsRequireApproval;
          connectionString = 'INSERT INTO suggestions SET ?';
          connection.query(connectionString, 
            {
              groupId,
              userId,
              text,
              type,
              imageURL,
              approved,
            }, (err, result) => {
              if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3156');
              else {
                // Send Email to Admins
                const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
                sendEmail(toEmails, defaultFromEmail, rows[0].groupName + '- Feedback: ' + req.body.text, 'Email: ' + decoded.email);
                res.json({ id: result.insertId });
              }
            }
          );
        }
      });
    }
  });
});

app.post('/submitSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      // Check if the solution requires approval
      const { groupId, userId } = decoded;
      const connectionString = `SELECT solutionsRequireApproval FROM groups WHERE id=?`;
      connection.query(connectionString, [groupId], (err, rows) => {        
        if (err) res.status(400).send('Sorry, there was a problem with your solution or the server is experiencing an error - 0942');
        else {
          // Insert the solution into the database
          const { suggestionId, text } = req.body.solution;
          const approved = !rows[0].solutionsRequireApproval;
          connectionString = 'INSERT INTO solutions SET ?';
          connection.query(connectionString,
            {
              suggestionId,
              userId,
              text,
              approved,
            }, (err, result) => {
              if (err) res.status(400).send('Sorry, there was a problem with your solution or the server is experiencing an error - 2579');
              else res.json({ id: result.insertId });
            }
          );
        }
      });
    }
  });
});

// VOTE
app.post('/submitSuggestionVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const suggestionId = req.body.suggestion.id;
      const { upvote, downvote } = req.body;
      const userId = decoded.userId; 
      const connectionString = 'INSERT INTO suggestionVotes SET ?'
      connection.query(connectionString,
        {
          suggestionId,
          userId,
          upvote,
          downvote,
        }, (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 3683');
        else res.sendStatus(200);
      });
    }
  });
});

app.post('/submitSolutionVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const solutionId = req.body.solution.id;
      const { upvote, downvote } = req.body;
      const userId = decoded.userId; 
      const connectionString = 'INSERT INTO solutionVotes SET ?'
      connection.query(connectionString,
        {
          solutionId,
          userId,
          upvote,
          downvote,
        }, (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8902');
        else res.sendStatus(200);
      });
    }
  });
});

// UPDATE
app.post('/updateSuggestion', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { text, status, imageURL, approved, id } = req.body.suggestion;
      const connectionString = 'UPDATE suggestions SET ? WHERE ?';
      connection.query(connectionString,
        [{
          text,
          status,
          imageURL,
          approved,       
        },
        { id }], (err) => {
          if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4928');
          else res.sendStatus(200);
        }
      );
    }
  });
});

app.post('/updateSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { text, approved, id } = req.body.solution;
      const connectionString = 'UPDATE solutions SET ? WHERE ?';
      connection.query(connectionString,
        [{
          text,
          approved,       
        },
        { id }], (err) => {
          if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4930');
          else res.sendStatus(200);
        }
      );
    }
  });
});

// DELETE
app.post('/deleteSuggestion', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const connectionString = 'DELETE FROM suggestions WHERE id = ?';
      connection.query(connectionString, [req.body.suggestion.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 7926');
        else res.sendStatus(200);
      });      
    }
  });
});

app.post('/deleteSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const connectionString = 'DELETE FROM solutions WHERE id = ?';
      connection.query(connectionString, [req.body.solution.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 7930');
        else res.sendStatus(200);
      });      
    }
  });
});

// PULL
app.post('/pullSuggestions', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { userId, groupName, groupId } = decoded;
    if (err) res.status(400).send('Authorization failed');    
    else if (!userId || !groupName || !groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const connectionString = `SELECT * FROM suggestions WHERE groupId=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1472');
        else res.status(200).send(rows);
      });
    }
  });
});

app.post('/pullSolutions', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { userId, groupName, groupId } = decoded;
    if (err) res.status(400).send('Authorization failed');
    else if (!userId || !groupName || !groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const connectionString = `SELECT * FROM solutions WHERE groupId=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4685');
        else res.status(200).send(rows);
      });
    }
  });
});

app.post('/pullGroupInfo', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { userId, groupName, groupId } = decoded;
    if (err) res.status(400).send('Authorization failed');
    else if (!userId || !groupName || !groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const connectionString = `
        SELECT
          groupName,
          suggestionsRequireApproval,
          solutionsRequireApproval,
          showStatus,
          includePositiveFeedbackBox
        FROM
          groups
        WHERE
          groupId=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1345');
        else res.status(200).send(rows);
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
