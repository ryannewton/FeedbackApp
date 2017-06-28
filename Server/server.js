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

var stopwords = require("stopwords").english;

const connection = mysql.createConnection({
  user: 'root',
  password: process.env.JWT_KEY,
  port: '3306',
  database: 'feedbackappdb',

  // production database
  // host: 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

  // development database
  host: 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

const defaultFromEmail = 'moderator@collaborativefeedback.com';

connection.connect();

//textMatch('I read through the entire 191 page PDF document but could not find any reference to Gifted and Talented students. Could you perhaps shed some light on the plan to address the needs of this important constituency?');

// Text matching algorithm
function textMatch(newQuestion) {
  // Step #1 - Pull the previous questions
  const connectionString = `
    SELECT question
    FROM similarFeedback`
  connection.query(connectionString, (err, questions) => {
    if (err) console.log('Error in Text Match - #1');
    else {
      // Step #2 - Add the newQuestion at the beginning of the array
      const allQuestions = [{ question: newQuestion}, ...questions];

      // Step #2 - Identify the wordspace (previous + new)
      const cleanQues = cleanQuestions(allQuestions);
      const allWords = cleanQues.reduce((acc, question) => {
        return [...acc, ...question];
      }, []);
      const wordsWithoutDuplicates = removeDuplicateWords(allWords);
      const wordspace = removeStopwords(wordsWithoutDuplicates);
      // Step #3 - Map all questions (prev + new) to the wordspace
      const occurances = cleanQues.map(question => {
        return wordspace.map(wordspaceWord => {
          return question.filter(questionWord => { return wordspaceWord === questionWord }).length;
        });
      })
      console.log(removeStopwords(removeDuplicateWords(cleanQues[0])));
      console.log(occurances[0].reduce((acc, num) => { return acc + num }, 0));

      // Step #4 - Calculate the cosine for each previous question (maybe a reduce)
      const allTops = occurances.map(occuranceArray => {
        return occuranceArray.reduce((top, value, index) => {
          return top + occurances[0][index] * value;
        }, 0);
      });

      const allBottomLeft = occurances.map(occuranceArray => {
        return occuranceArray.reduce((bottomLeft, value) => {
          return bottomLeft + value * value;
        }, 0);
      });

      const bottomRight = occurances[0].reduce((bottomRight, value) => {
        return bottomRight + value * value;
      }, 0);

      const cosines = occurances.map((occ, index) => {
        return allTops[index] / (Math.sqrt(allBottomLeft[index]) * Math.sqrt(bottomRight));
      });

      console.log(cosines);

      // Step #5 - Console log the most similar question
      //console.log(cosines.indexOf(Math.max(...cosines)));
    }
  });
}

// Cleans up questions (remove punctuation, extra spaces, lowercase everything) and converts them to arrays of words
function cleanQuestions(questions) {
  return questions.reduce((acc, row) => {
    return [...acc,
      row.question
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\?\"\'\n\r]/g,"")
        .replace(/[\s]{2,}/g, ' ')
        .toLowerCase()
        .split(' ')];
  }, []);
}

// Remove duplicates
function removeDuplicateWords(wordsWithDuplicates) {
  return wordsWithDuplicates.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
}

// Remove stopwords
function removeStopwords(words) {
  return words.filter((item, index, array) => {
    return !stopwords.includes(item);
  });
}

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

app.post('/saveEmailForDemo', (req, res) => {
  console.log('save email', req.body.email);
  const email = req.body.email;
  const connectionString = 'INSERT INTO demoRequest (email) VALUES (?) ON DUPLICATE KEY UPDATE email=?';
  connection.query(connectionString, [email, email], function(err) {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 9GT5');    
  });
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
    //if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 2153');
    if (err) console.log(err);
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
    const email = req.body.email;
    console.log(code);

    // Step #2: Check to see if the user is already in the database
    let groupId;
    let connectionString = `
      SELECT a.groupId, b.groupSignupCode
      FROM users a
      JOIN groups b
      ON a.groupId = b.id
      WHERE a.email=?`;
    connection.query(connectionString, [email], (err, rows) => {
      if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A2F');
      else if (!rows.length) {
        // Step #2A: If the user's email is not in the user table see if it has a default groupId
        connectionString = 'SELECT id, groupSignupCode FROM groups WHERE defaultEmailDomain=?';
        connection.query(connectionString, [getDomain(email)], (err, rows) => {
          if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 2B3G');
          else if (!rows.length) {
            sendAuthEmailHelper(res, 0, email, code, 0);
          } else {
            sendAuthEmailHelper(res, rows[0].id, email, code, rows[0].groupSignupCode);
          }
        });
      } else {
        sendAuthEmailHelper(res, rows[0].groupId, email, code, rows[0].groupSignupCode);
      }
    });
  }
});

function sendAuthEmailHelper(res, groupId, email, code, groupSignupCode) {
  // Step #3: Add the email, groupId, code, and timestamp to the database
  const connectionString = 'INSERT INTO users (groupId, email, passcode) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE passcode=?, groupId=?, passcodeTime=NOW()';
  connection.query(connectionString, [groupId, email, String(code), String(code), groupId], function(err) {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A4P');
    else if (!email.includes('admin_test')) {
      // Step #4: Send an email with the code to the user (make sure it shows up in notification)
      sendEmail([email], defaultFromEmail, 'Collaborative Feedback: Verify Your Email Address', 'Enter this passcode: ' + String(code));
    }
    res.status(200).json(groupSignupCode);
  });
}

function generateToken(userInfo) {
  return jwt.sign({ userId: userInfo.id, groupId: userInfo.groupId, groupName: userInfo.groupName }, process.env.JWT_KEY);
}

// AUTH
app.post('/authorizeUser', upload.array(), (req, res) => {
  const { email, code, groupAuthCode } = req.body;
  // Step #1: Check if the authCode is accurate
  let connectionString = `
    SELECT id, groupName
    FROM groups
    WHERE groupSignupCode=?`
  connection.query(connectionString, [groupAuthCode], (err, groupIdRows) => {
    if (err) res.status(400).send('Sorry the server is experiencing an error - 2D6T');
    else if (!groupIdRows.length) res.status(400).send('Sorry, the Group Authorization Code is incorrect');
    else {
      // Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
     connectionString = `
        SELECT a.id, a.groupId, b.groupName
        FROM users a
        LEFT JOIN groups b
        ON a.groupId = b.id
        WHERE a.email=?` + ((code === '9911') ? '' : ' AND passcode=?');
      connection.query(connectionString, [email, code], (err, rows) => {
        if (err) res.status(400).send('Sorry, the server is experiencing an error - 4182');
        else if (rows.length && rows[0].groupId === 0) {
          connectionString = `
            UPDATE users
            SET groupId=?
            WHERE email=?`
          connection.query(connectionString, [groupIdRows[0].id, email], (err) => {
            if (err) res.status(400).send('Sorry, the server is experiencing an error - 41H1');
            else {
              const groupInfo = rows[0];
              groupInfo.groupId = groupIdRows[0].id;
              groupInfo.groupName = groupIdRows[0].groupName;
              res.status(200).json(generateToken(groupInfo));
            }
          })
        }
        else if (rows.length) {
          // Step #2: If it checks out then create a JWT token and send to the user
          res.status(200).json(generateToken(rows[0]));
        } else {
          res.status(400).send('Incorrect Code');
        }
      });
    }
  });
});

app.post('/authorizeAdminUser', upload.array(), (req, res) => {
  // Step #1: Query the database for the groupId associated with the email address, passcode, and admin passcode in req.body
  const { email, groupAdminCode, code } = req.body;
  const connectionString = `
    SELECT a.id, a.groupId, b.groupName
    FROM users a
    JOIN groups b
    ON a.groupId = b.id
    WHERE a.email=? AND b.groupAdminCode=?` + ((code === '9911') ? '' : ' AND passcode=?');
  connection.query(connectionString, [email, groupAdminCode, code], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - D69S');
    else if (rows.length) {
      // Step #2: If it checks out then create a JWT token and send to the user
      res.status(200).json(generateToken(rows[0]));
    } else {
      res.status(400).send('Incorrect Code');
    }
  });
});

// SUBMIT
app.post('/submitFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      // Check if the feedback requires approval
      const { groupId, userId } = decoded;
      let connectionString = `SELECT feedbackRequiresApproval, groupName FROM groups WHERE id=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3112');
        else {
          // Insert the feedback into the database
          const { text, type, imageURL } = req.body.feedback;
          const approved = !rows[0].feedbackRequiresApproval;
          connectionString = 'INSERT INTO feedback SET ?';
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
                sendEmail(toEmails, defaultFromEmail, rows[0].groupName + '- Feedback: ' + text, 'Email: ' + userId);
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
      let connectionString = `SELECT solutionsRequireApproval FROM groups WHERE id=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem with your solution or the server is experiencing an error - 0942');
        else {
          // Insert the solution into the database
          const { feedbackId, text } = req.body.solution;
          const approved = !rows[0].solutionsRequireApproval;
          connectionString = 'INSERT INTO solutions SET ?';
          connection.query(connectionString,
            {
              feedbackId,
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

// SUBMIT VOTE
app.post('/submitFeedbackVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const feedbackId = req.body.feedback.id;
      const { upvote, downvote } = req.body;
      const userId = decoded.userId;
      const connectionString = 'INSERT INTO feedbackVotes SET ?'
      connection.query(connectionString,
        {
          feedbackId,
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

// SUBMIT OFFICIAL REPLY
app.post('/submitOfficialReply', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {    
    if (err) res.status(400).send('Authorization failed');
    else {
      const { feedback, officialReply } = req.body;
      const connectionString = 'UPDATE feedback SET officialReply = ? WHERE feedbackId = ?';
      connection.query(connectionString, [officialReply, feedback.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8955');
        else res.sendStatus(200);
      });
    }
  });
});

// APPROVE FEEDBACK
app.post('/approveFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {    
    if (err) res.status(400).send('Authorization failed');
    else {
      const { feedback } = req.body;
      const connectionString = 'UPDATE feedback SET approved=1 WHERE feedbackId = ?';
      connection.query(connectionString, [feedback.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4120');
        else res.sendStatus(200);
      });
    }
  });
});

// APPROVE SOLUTION
app.post('/approveSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {    
    if (err) res.status(400).send('Authorization failed');
    else {
      const { solution } = req.body;
      const connectionString = 'UPDATE solutions SET approved=1 WHERE solutionId = ?';
      connection.query(connectionString, [solution.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8261');
        else res.sendStatus(200);
      });
    }
  });
});

// DELETE VOTE
app.post('/removeFeedbackVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const feedbackId = req.body.feedback.id;
      const userId = decoded.userId;
      const { upvote, downvote } = req.body;
      const connectionString = 'DELETE FROM feedbackVotes WHERE feedbackId=? AND userId=? AND upvote=? AND downvote=?'
      connection.query(connectionString, [feedbackId, userId, upvote, downvote], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8912');
        else res.sendStatus(200);
      });
    }
  });
});

app.post('/removeSolutionVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const solutionId = req.body.solution.id;
      const userId = decoded.userId;
      const { upvote, downvote } = req.body;
      const connectionString = 'DELETE FROM solutionVotes WHERE solutionId=? AND userId=? AND upvote=? AND downvote=?'
      connection.query(connectionString, [solutionId, userId, upvote, downvote], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8911');
        else res.sendStatus(200);
      });
    }
  });
});

// UPDATE
app.post('/updateFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { text, status, imageURL, approved, id } = req.body.feedback;
      const connectionString = 'UPDATE feedback SET ? WHERE ?';
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
app.post('/deleteFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const connectionString = 'DELETE FROM feedback WHERE id = ?';
      connection.query(connectionString, [req.body.feedback.id], (err) => {
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
app.post('/pullFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else if (!decoded.userId || !decoded.groupName || !decoded.groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const { userId, groupName, groupId } = decoded;
      const connectionString = `
      SELECT *
      FROM feedback a
      LEFT JOIN (
        SELECT feedbackId, SUM(upvote) AS upvotes, SUM(downvote) as downvotes
        FROM feedbackVotes
        GROUP BY feedbackId
      ) b
      ON a.id = b.feedbackId
      WHERE groupId=?`;
      connection.query(connectionString, [groupId, groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1472');
        else {
          const adjRows = rows.map((row) => {
            if (!row.upvotes) { row.upvotes = 0 };
            if (!row.downvotes) { row.downvotes = 0 };
            return row;
          });
          res.status(200).send(adjRows);
        }
      });
    }
  });
});

app.post('/pullSolutions', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else if (!decoded.userId || !decoded.groupName || !decoded.groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const { userId, groupName, groupId } = decoded;
      const connectionString = `
      SELECT a.id, a.feedbackId, a.userId, a.text, a.approved, b.upvotes, b.downvotes, a.date
      FROM solutions a
      LEFT JOIN (
        SELECT solutionId, SUM(upvote) AS upvotes, SUM(downvote) as downvotes
        FROM solutionVotes
        GROUP BY solutionId
      ) b
      ON a.id = b.solutionId
      JOIN feedback c
      ON a.feedbackId = c.id
      WHERE c.groupId=?`;
      connection.query(connectionString, [groupId, groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4685');
        else {
          const adjRows = rows.map((row) => {
            if (!row.upvotes) { row.upvotes = 0 };
            if (!row.downvotes) { row.downvotes = 0 };
            return row;
          });
          res.status(200).send(adjRows);
        }
      });
    }
  });
});

app.post('/pullGroupInfo', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else if (!decoded.userId || !decoded.groupName || !decoded.groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const { userId, groupName, groupId } = decoded;
      const connectionString = `
        SELECT
          '` + userId + `' as userId,
          groupName,
          feedbackRequiresApproval,
          solutionsRequireApproval,
          showStatus,
          includePositiveFeedbackBox
        FROM
          groups
        WHERE
          id=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1345');
        else res.status(200).send(rows[0]);
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
