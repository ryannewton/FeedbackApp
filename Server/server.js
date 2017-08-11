// Use local .env file for env vars when not deployed
require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // For authentication
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const Expo = require('exponent-server-sdk'); // For sending push notifications
const aws = require('aws-sdk'); // load aws sdk
const Jimp = require('jimp'); // For image processing
const path = require('path');

const googleTranslate = require('google-translate')(process.env.TRANSLATE_API_KEY);

aws.config.loadFromPath('config.json'); // load aws config
const upload = multer(); // for parsing multipart/form-data
const ses = new aws.SES({ apiVersion: '2010-12-01' }); // load AWS SES
const nodemailer = require('nodemailer'); // HTML email library
const MailComposer = require('nodemailer/lib/mail-composer');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.use(express.static('build'));

if (!process.env.db) {
  const cors = require('cors'); // Uncomment for development server
  app.use(cors());
}

const connection = mysql.createConnection({
  user: 'root',
  password: process.env.JWT_KEY,
  port: '3306',
  database: 'feedbackappdb',
  host: process.env.db || 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

const defaultFromEmail = 'SuggestionBox@suggestionboxapp.com';

connection.connect();

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './build/admin.html'));
});

app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname, './public/web.html'));
});

// Image uploading backend
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

app.post('/saveEmailForDemo', (req, res) => {
  const email = req.body.email;
  const connectionString = 'INSERT INTO demoRequest (email) VALUES (?) ON DUPLICATE KEY UPDATE email=?';
  connection.query(connectionString, [email, email], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 9GT5');
  });
});

app.post('/uploadPhoto', upload.single('photo'), (req, res) => {
  const uploadName = `${Date.now().toString()}.jpg`;

  // Call the convertImgs method and pass the image files as its argument
  convertImgs(req.file, 30).then((image) => {
    s3.putObject(
      {
        Bucket: process.env.AWS_BUCKET,
        Key: uploadName,
        Body: image,
        ACL: 'public-read',
      },
      () => res.json('https://s3-us-west-2.amazonaws.com/feedback-app-user-images/' + uploadName));
  });
});

function convertImgs(file, quality) {
  const promise = new Promise((resolve, reject) => {
    new Jimp(file.buffer, (err, image) => {
      if (err) reject(err);
      else {
        image
        .quality(quality)
        .getBuffer(Jimp.MIME_JPEG, (bufferErr, buffer) => {
          if (bufferErr) reject(bufferErr);
          else resolve(buffer);
        });
      }
    });
  });

  return promise;
}

// Sends Email from AWS SES
function sendEmailSES(toEmails, fromEmail, subjectLine, bodyText) {
  const toEmailsFiltered = toEmails.filter(email => email !== null && email.toLowerCase().slice(0, 11) !== 'admin_test@');
  const toEmailsProductionCheck = (process.env.production) ? toEmailsFiltered : ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'jbaker1@mit.edu', 'alicezhy@stanford.edu'];
  ses.sendEmail({
    Source: fromEmail,
    Destination: { ToAddresses: toEmailsProductionCheck },
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
    if (err) console.log(err);
  });
}

// Sends Email from Nodemailer
function sendEmail(toEmail, fromEmail, subject, htmlMessage) {
  const mail = new MailComposer({
    from: fromEmail,
    to: toEmail,
    subject,
    html: htmlMessage,
  });

  return new Promise((resolve, reject) => {
    mail.compile().build((err, res) => {
      err ? reject(err) : resolve(res);
    });
  })
    .then((message) => {
      const sesParams = {
        RawMessage: {
          Data: message,
        },
      };
      return ses.sendRawEmail(sesParams).promise();
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

// SAVE PUSH NOTIFICATION TOKEN
app.post('/savePushToken', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      res.status(400).send('Authorization failed');
    } else {
      const { pushToken } = req.body;
      const { userId } = decoded;
      const connectionString = 'UPDATE users SET pushToken=? WHERE id=?';
      connection.query(connectionString, [pushToken, userId], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem with the server - 3611');
        else res.sendStatus(200);
      });
    }
  });
});

app.post('/getGroupTreeData', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { groupId } = decoded;
      const connectionString =
      `SELECT id, name, parent
       FROM locationStructure
       WHERE groupId=?`;
      connection.query(connectionString, [groupId], (err, rows) => {
        if (err) console.log(err, 'here@!@#@');
        else res.status(200).send(rows);
      });
    }
  });
});

// SEND PUSH NOTIFICATION
app.post('/sendPushNotification', upload.array(), (req, res) => {
  if (req.body.authorization !== 'secretPushNotificationPassword9911') {
    return res.sendStatus(401);
  }

  const { message, userEmail } = req.body;
  const connectionString = 'SELECT pushToken FROM users WHERE email=?';

  connection.query(connectionString, [userEmail], (err, rows) => {
    if (err) {
      return res.status(400).send('Sorry, there was a problem with the server - 4511');
    }
    if (rows.length === 0) {
      return res.status(400).send('Could not find user.');
    }
    if (!rows[0].pushToken) {
      return res.status(400).send('Sorry, notifications have not been set up for this user');
    }

    // Send notification
    const pushToken = rows[0].pushToken;
    const expo = new Expo();
    expo.sendPushNotificationsAsync([{
      to: pushToken,
      sound: 'default',
      body: message,
      data: { withSome: 'data' }, // Filler; server requires non-empty object
    }])
    .then((receipts) => {
      res.status(200).json({ receipts });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
  });
});

// AUTH
app.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
  const { email, language } = req.body;

  // Checks to make sure it is a valid email address
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    res.status(400).send('Sorry, this does not appear to be a valid email address :(');
  } else {
    // Step #1: Generate a code
    const code = generatePassword(4);
    console.log(code);

    // Step #2: Check to see if the user is already in the database
    const connectionString = `
      SELECT a.groupId, b.groupSignupCode
      FROM users a
      JOIN groups b
      ON a.groupId = b.id
      WHERE a.email=?`;
    connection.query(connectionString, [email], (err, rows) => {
      if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A2F');
      else if (!rows.length || !rows[0].groupSignupCode) sendAuthEmailHelper(res, 0, email, code, 0, language);
      else sendAuthEmailHelper(res, rows[0].groupId, email, code, rows[0].groupSignupCode, language);
    });
  }
});

function sendAuthEmailHelper(res, groupId, email, code, groupSignupCode, language) {
  // Step #3: Add the email, groupId, code, and timestamp to the database
  const connectionString = 'INSERT INTO users (groupId, email, passcode, language) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE passcode=?, groupId=?, passcodeTime=NOW(), language=?';
  connection.query(connectionString, [groupId, email, String(code), language, String(code), groupId, language], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A4P');
    else if (!email.includes('admin_test')) {
      // Step #4: Send an email with the code to the user (make sure it shows up in notification)
      sendEmail([email], defaultFromEmail, `Suggestion Box Code: ${code}`, `To complete the signin process, use code: ${code}`);
      res.status(200).json(groupSignupCode);
    } else res.status(200).json(groupSignupCode);
  });
}

app.post('/verifyEmail', upload.array(), (req, res) => {
  const { email, code } = req.body;
  const connectionString = `
    SELECT a.id as userId, a.language, b.groupName, b.id as groupId
    FROM users a
    LEFT JOIN groups b
    ON a.groupId = b.id
    WHERE a.email=?` + ((code === '9911') ? '' : ' AND passcode=?');
  connection.query(connectionString, [email, code], (err, user) => {
    if (err) res.status(400).send('Sorry the server is experiencing an error - G2D6');
    else if (!user.length) res.status(400).send('Sorry, your email verification code is incorrect');
    else if (!user[0].groupName) res.status(200).json({ needsGroupSignupCode: true });
    else if (user[0].userId && user[0].groupName && user[0].groupId && user[0].language) res.status(200).json({ needsGroupSignupCode: false, token: generateToken(user[0]) });
    else res.status(400).send('Sorry the server is experiencing an error - G2D7');
  });
});

function generateToken(userInfo) {
  return jwt.sign(userInfo, process.env.JWT_KEY);
}

app.post('/authorizeUser', upload.array(), (req, res) => {
  const { email, code, groupSignupCode } = req.body;
  // Step #1: Check if the authCode is accurate
  let connectionString = `
    SELECT id, groupName
    FROM groups
    WHERE groupSignupCode=?`;
  connection.query(connectionString, [groupSignupCode], (err, group) => {
    if (err) res.status(400).send('Sorry the server is experiencing an error - 2D6T');
    else if (!group.length) res.status(400).send('Sorry, your Group Code is incorrect');
    else {
      // Step #1: Query the database for the userinfo associated with the email
      connectionString = `
        SELECT a.id AS userId, a.language, a.groupId, b.groupName
        FROM users a
        LEFT JOIN groups b
        ON a.groupId = b.id
        WHERE a.email=?` + ((code === '9911') ? '' : ' AND passcode=?');
      connection.query(connectionString, [email, code], (err, rows) => {
        if (err) res.status(400).send('Sorry, the server is experiencing an error - 4182');
        else if (!rows.length) res.status(400).send('Sorry, your email address or passcode is incorrect');
        else {
          connectionString = `
            UPDATE users
            SET groupId=?
            WHERE email=?`;
          connection.query(connectionString, [group[0].id, email], (err) => {
            if (err) res.status(400).send('Sorry, the server is experiencing an error - 41H1');
            else {
              const groupInfo = rows[0];
              groupInfo.groupId = group[0].id;
              groupInfo.groupName = group[0].groupName;
              res.status(200).json(generateToken(groupInfo));
            }
          });
        }
      });
    }
  });
});

app.post('/authorizeAdministrator', upload.array(), (req, res) => {
  // Step #1: Query the database for the groupId associated with the email address, passcode, and admin passcode in req.body
  const { email, code } = req.body;
  const connectionString = `
    SELECT a.id AS userId, a.language, a.groupId, a.admin, b.groupName
    FROM users a
    JOIN groups b
    ON a.groupId = b.id
    WHERE a.email=? AND b.groupAdminCode=? AND a.admin=1`;
  connection.query(connectionString, [email, code], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - D69S');
    else if (rows.length) {
      // Step #2: If it checks out then create a JWT token and send to the user
      res.status(200).json(generateToken(rows[0]));
    } else {
      res.status(400).send("I'm sorry. The code is inccorect or you have not been designated as an Administrator");
    }
  });
});

function insertText(res, targetId, type, text, userId) {
  const supportedLanguages = ['en', 'es', 'vi', 'zh-cn'];
  supportedLanguages.forEach((language) => {
    googleTranslate.translate(text, language, (err, translation) => {
      if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - GDS2');
      else {
        const { translatedText, detectedSourceLanguage } = translation;
        const connectionString = 'INSERT INTO translatedText SET ? ON DUPLICATE KEY UPDATE ?';
        connection.query(connectionString,
          [{
            targetId,
            type,
            translatedText,
            translatedFrom: detectedSourceLanguage,
            language,
            userId,
          }, { translatedText, userId }], (err) => {
            if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - JKD1');
          }
        );
      }
    });
  });
}

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
          const { text, imageURL, category } = req.body.feedback;

          // Insert the feedback into the database
          const approved = !rows[0].feedbackRequiresApproval;
          connectionString = 'INSERT INTO feedback SET ?';
          connection.query(connectionString,
            {
              groupId,
              userId,
              text,
              imageURL,
              approved,
              category,
            }, (err, result) => {
              if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3156');
              else {
                let adminEmail = [];
                if (groupId === 9) {
                  adminEmail = ['jbaker1@mit.edu', 'thannasc@stanford.edu'];
                }
                if (groupId === 3) {
                  adminEmail = ['jbaker1@mit.edu', 'thannasc@stanford.edu'];
                }
                // Insert text
                insertText(res, result.insertId, 'feedback', text, userId);
                // Send Email to Admins
                const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', ...adminEmail];
                sendEmail(toEmails, defaultFromEmail, rows[0].groupName + '- Feedback: ', `A new piece of feedback from your community has been submitted! \n '${text}''`);
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
      let connectionString = `SELECT solutionsRequireApproval, groupName FROM groups WHERE id=?`;
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
              else {
                // Insert text
                insertText(res, result.insertId, 'solution', text, userId);

                // Send Email to Moderators
                const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
                sendEmail(toEmails, defaultFromEmail, rows[0].groupName + '- Solution: ' + text, 'UserId: ' + userId);

                res.json({ id: result.insertId });
              }
            }
          );
        }
      });
    }
  });
});

function submitFeedbackVoteHelper(feedbackId, upvote, downvote, noOpinion, userId, res) {
  const connectionString = 'INSERT INTO feedbackVotes SET ?';
  connection.query(connectionString,
    {
      feedbackId,
      userId,
      upvote,
      downvote,
      noOpinion,
    }, (err) => {
      if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 3683');
    });
}


// SUBMIT VOTE
app.post('/submitFeedbackVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const feedbackId = req.body.feedback.id;
      const { upvote, downvote, noOpinion } = req.body;
      const userId = decoded.userId;
      submitFeedbackVoteHelper(feedbackId, upvote, downvote, noOpinion, userId, res)
      res.sendStatus(200);
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
      const connectionString = 'INSERT INTO solutionVotes SET ?';
      connection.query(connectionString,
        {
          solutionId,
          userId,
          upvote,
          downvote,
        }, (err) => {
          if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8902');
          else res.sendStatus(200);
        }
      );
    }
  });
});

// APPROVE FEEDBACK
app.post('/approveFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { feedback } = req.body;
      const connectionString = "UPDATE feedback SET approved=1, status='new' WHERE id = ?";
      connection.query(connectionString, [feedback.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4120');
        else res.sendStatus(200);
      });
    }
  });
});

// APPROVE SOLUTION
app.post('/approveSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { solution } = req.body;
      const connectionString = 'UPDATE solutions SET approved=1 WHERE id = ?';
      connection.query(connectionString, [solution.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8261');
        else res.sendStatus(200);
      });
    }
  });
});

// APPROVE FEEDBACK
app.post('/approveFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
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
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
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
      const connectionString = 'DELETE FROM feedbackVotes WHERE feedbackId=? AND userId=? AND upvote=? AND downvote=?';
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
      const connectionString = 'DELETE FROM solutionVotes WHERE solutionId=? AND userId=? AND upvote=? AND downvote=?';
      connection.query(connectionString, [solutionId, userId, upvote, downvote], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8911');
        else res.sendStatus(200);
      });
    }
  });
});

// UPDATE
function updateHelperFunction(feedback, approved, res) {
  const { text, status, imageURL, id, category, officialReply, userId } = feedback;
  const connectionString = 'UPDATE feedback SET ? WHERE ?';
  connection.query(connectionString,
    [{
      text,
      status,
      imageURL,
      approved,
      category,
      officialReply,
    },
    { id }], (err) => {
      if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4928');
      else {
        insertText(res, id, 'feedback', text, userId);
        res.sendStatus(200);
      }
    }
  );
}

app.post('/updateFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { groupId, admin } = decoded;
      if (admin) updateHelperFunction(req.body.feedback, 1, res);
      else {
        let connectionString = `SELECT feedbackRequiresApproval FROM groups WHERE id=?`;
        connection.query(connectionString, [groupId], (err, rows) => {
          if (err) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - FD21');
          else updateHelperFunction(req.body.feedback, !rows[0].feedbackRequiresApproval, res);
        });
      }
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

// Create a new group
app.post('/createGroup', upload.array(), (req, res) => {
  const { groupName } = req.body;
  const connectionString = `
  INSERT INTO groups (groupName, groupSignupCode, groupAdminCode, feedbackRequiresApproval, solutionsRequireApproval, showStatus, includePositiveFeedbackBox, date)
  VALUES (?, ?, ?, 0, 0, 1, 0, NOW())
  `;
  connection.query(connectionString, [groupName, groupName, groupName], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 818F');
    else res.sendStatus(200);
  });
});

app.post('/sendInviteEmails', upload.array(), (req, res) => {
  const { groupName, email } = req.body;
  const connectionString = `
  SELECT groupSignupCode
  FROM groups
  WHERE groupName=?
  `;
  connection.query(connectionString, [groupName], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8283');
    else {
      const subjectLine = `Join me on Suggestbox Box! - GroupName '${rows[0].groupSignupCode}'`
      const bodyText = `Please join me on Suggestion Box with the Group Name of '${rows[0].groupSignupCode}'!`
      sendEmail([email], defaultFromEmail, subjectLine, bodyText);
      res.sendStatus(200);
    }
  });
});


// REJECT FEEDBACK
// 1. Email rejection message to user
// 2. Mark feedback status as 'rejected'
// req.body = { authorization, message, feedback }
app.post('/rejectFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { feedback, message } = req.body;
    const { userId } = decoded;
    if (err) {
      res.status(400).send('Autorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!feedback || !feedback.id) {
      res.status(400).send('Unrecognized feedback object');
    } else {
      let connectionString = 'SELECT email FROM feedback JOIN users ON feedback.userId = users.id WHERE feedback.id = ?';
      connection.query(connectionString, [feedback.id], (err1, rows) => {
        if (err1) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0001');
        } else {
          let toEmail;
          if (rows.length === 0) {
            toEmail = ['newton1988@gmail.com', 'tyler.hannasch@gmail.com'];
          } else {
            toEmail = [rows[0].email];
          }
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err3, rows3) => {
            const adminEmail = rows3[0].email;
            const fromEmail = defaultFromEmail;
            const { subjectLine, bodyText } = rejectFeedbackEmail({ feedback, message, adminEmail });

            connectionString = "UPDATE feedback SET status='rejected' WHERE id=?";
            connection.query(connectionString, [feedback.id], (err2) => {
              if (err2) {
                res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0002');
              } else {
                sendEmail(toEmail, fromEmail, subjectLine, bodyText);
                res.sendStatus(200);
              }
            });
          });
        }
      });
    }
  });
});

app.post('/rejectSolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { solution, message } = req.body;
    const { userId } = decoded;
    if (err) {
      res.status(400).send('Autorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!solution || !solution.id) {
      res.status(400).send('Unrecognized feedback object');
    } else {
      let connectionString =
      `SELECT email
       FROM solutions a
       JOIN users b
       ON a.userId = b.id
       WHERE a.id = ?`;
      connection.query(connectionString, [solution.id], (err1, rows) => {
        if (err1) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0001');
        } else {
          let toEmail;
          if (rows.length === 0) {
            toEmail = ['newton1988@gmail.com', 'tyler.hannasch@gmail.com'];
          } else {
            toEmail = [rows[0].email];
          }
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err3, rows3) => {
            const adminEmail = rows3[0].email;
            const fromEmail = defaultFromEmail;
            const { subjectLine, bodyText } = rejectSolutionEmail({ solution, message, adminEmail });

            connectionString = "UPDATE solutions SET status='rejected' WHERE id=?";
            connection.query(connectionString, [solution.id], (err2) => {
              if (err2) {
                res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0002');
              } else {
                sendEmail(toEmail, fromEmail, subjectLine, bodyText);
                res.sendStatus(200);
              }
            });
          });
        }
      });
    }
  });
});

// CLARIFY FEEDBACK
// 1. Email clarification message to user
// 2. Flag feedback as status as 'clarify'
// req.body = { authorization, message, feedback }
app.post('/clarifyFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { feedback, message } = req.body;
    const { userId } = decoded;
    if (err) {
      res.status(400).send('Autorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!feedback || !feedback.id) {
      res.status(400).send('Unrecognized feedback object');
    } else {
      let connectionString = 'SELECT email FROM feedback JOIN users ON feedback.userId = users.id WHERE feedback.id = ?';
      connection.query(connectionString, [feedback.id], (err1, rows) => {
        if (err1) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0003');
        } else if (rows.length === 0) {
          res.status(400).send('Sorry, this feedback\'s submitter was not saved. Cannot clarify');
        } else {
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err3, rows3) => {
            const adminEmail = rows3[0].email;
            const toEmail = [rows[0].email];
            const fromEmail = defaultFromEmail;
            const { subjectLine, bodyText } = clarifyFeedbackEmail({ feedback, message, adminEmail });

            connectionString = "UPDATE feedback SET status='clarify' WHERE id=?";
            connection.query(connectionString, [feedback.id], (err2) => {
              if (err2) {
                res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0004');
              } else {
                sendEmail(toEmail, fromEmail, subjectLine, bodyText);
                res.sendStatus(200);
              }
            });
          });
        }
      });
    }
  });
});

app.post('/routeFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { userId } = decoded;
    const { feedback, message, email } = req.body;
    if (err) {
      res.status(400).send('Authorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!feedback || !feedback.id) {
      res.status(400).send('Unrecognized feedback object');
    } else {
      const connectionString = `
        SELECT email
        FROM users
        WHERE id=?`;
      connection.query(connectionString, [userId], (err, rows) => {
        if (err) res.status(400).send('The server is experiencing an error - 8980');
        else if (!rows.length) res.status(400).send('The server is experiencing an error - 8981')
        else {
          const adminEmail = rows[0].email;
          const toEmail = [email];
          const fromEmail = defaultFromEmail;
          const { subjectLine, bodyText } = routeFeedbackEmail({ feedback, message, adminEmail });
          sendEmail(toEmail, fromEmail, subjectLine, bodyText);
          res.sendStatus(200);
        }
      });
    }
  });
});

app.post('/replyFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { userId } = decoded;
    const { feedback, message, type } = req.body;
    if (err) {
      res.status(400).send('Autorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!feedback || !feedback.id) {
      res.status(400).send('Unrecognized feedback object');
    } else if (type === 'officialReply') {
      submitOfficialReply(decoded, req, res);
    } else if (type === 'submitter') {
      let connectionString = `
        SELECT email
        FROM feedback a
        JOIN users b
        ON a.userId = b.id
        WHERE a.id=?`
        connection.query(connectionString, [feedback.id], (err, rows1) => {
          if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - FED3');
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err, rows) => {
            if (err) res.status(400).send('The server is experiencing an error - 898P');
            else if (!rows.length) res.status(400).send('The server is experiencing an error - 898C');
            else{
              const adminEmail = rows[0].email;
              const toEmail = (process.env.production) ? [rows1[0].email] : ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'jbaker1@mit.edu', 'alicezhy@stanford.edu'];
              const fromEmail = defaultFromEmail;
              const { subjectLine, bodyText } = replyFeedbackEmail({ feedback, message, adminEmail });
              sendEmail(toEmail, fromEmail, subjectLine, bodyText);
              res.sendStatus(200);
            }
          });
        });
    } else if (type === 'interested') {
      let connectionString = `
        SELECT email
        FROM feedbackVotes a
        JOIN users b
        ON a.userId = b.id
        WHERE a.feedbackId=?`;
        connection.query(connectionString, [feedback.id], (err, rows1) => {
          if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - ALICE123');
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err1, rows) => {
            if (err1) res.status(400).send('The server is experiencing an error - 8P80');
            else if (!rows.length) res.status(400).send('The server is experiencing an error - 8B81');
            else {
              const adminEmail = rows[0].email;
              const toEmail = (process.env.production) ? rows1.map(item => item.email) : ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'jbaker1@mit.edu', 'alicezhy@stanford.edu'];
              const fromEmail = defaultFromEmail;
              const { subjectLine, bodyText } = replyFeedbackEmail({ feedback, message, adminEmail });
              sendEmail(toEmail, fromEmail, subjectLine, bodyText);
              res.sendStatus(200);
            }
          });
        });
    }
  });
});

function submitOfficialReply(decoded, req, res) {
  const { userId } = decoded;
  const { feedback, message } = req.body;
  const connectionString = 'UPDATE feedback SET officialReply = ? WHERE id = ?';
  connection.query(connectionString, [message, feedback.id], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8955');
    else {
      // Insert text
      insertText(res, feedback.id, 'reply', message, userId);

      // Send Email to original poster
      // officialReplyEmailNotification({ feedback, officialReply: message });

      // Send Email to Moderators
      const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
      sendEmail(toEmails, defaultFromEmail, 'Official reply!', `Reply: ${message} UserId: some admin`);
      res.sendStatus(200);
    }
  });
}

app.post('/clarifySolution', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    const { solution, message } = req.body;
    const { userId } = decoded;
    if (err) {
      res.status(400).send('Autorization failed');
    } else if (!message) {
      res.status(400).send('Message required');
    } else if (!solution || !solution.id) {
      res.status(400).send('Unrecognized solution object');
    } else {
      let connectionString =
      `SELECT email
      FROM solutions a
      JOIN users b
      ON a.userId = b.id
      WHERE a.id = ?`;
      connection.query(connectionString, [solution.id], (err1, rows) => {
        if (err1) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 0023');
        } else if (rows.length === 0) {
          res.status(400).send('Sorry, this solution\'s submitter was not saved. Cannot clarify');
        } else {
          connectionString = `
            SELECT email
            FROM users
            WHERE id=?`;
          connection.query(connectionString, [userId], (err3, rows3) => {
            const adminEmail = rows3[0].email;
            const toEmail = [rows[0].email];
            const fromEmail = defaultFromEmail;
            const { subjectLine, bodyText } = clarifySolutionEmail({ solution, message, adminEmail });

            connectionString = "UPDATE solutions SET status='clarify' WHERE id=?";
            connection.query(connectionString, [solution.id], (err2) => {
              if (err2) {
                res.status(400).send('Sorry, there was a problem - the server is experiencing an error - AF04');
              } else {
                sendEmail(toEmail, fromEmail, subjectLine, bodyText);
                res.sendStatus(200);
              }
            });
          });
        }
      });
    }
  });
});

// DELETE - Needs to also delete associated official responses and solutions
app.post('/softDeleteFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const { feedback } = req.body;
      const connectionString = "UPDATE feedback SET status='deleted' WHERE id=?";
      connection.query(connectionString, [feedback.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error');
        else res.sendStatus(200);
      });
    }
  });
});





app.post('/deleteFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const connectionString = `DELETE FROM feedback WHERE id = ?; DELETE FROM translatedText WHERE targetId=? AND (type='feedback' OR type='reply')`;
      connection.query(connectionString, [req.body.feedback.id, req.body.feedback.id], (err) => {
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
      const connectionString = `DELETE FROM solutions WHERE id = ?;DELETE FROM translatedText WHERE targetId=? AND type='solution';`;
      connection.query(connectionString, [req.body.solution.id, req.body.solution.id], (err) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 7930');
        else res.sendStatus(200);
      });
    }
  });
});

// PULL
app.post('/pullFeedbackVotes', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed')
    else {
      const { userId } = decoded;
      const connectionString = `
      SELECT upvote, downvote, feedbackId
      FROM feedbackVotes
      WHERE userId=?`;
      connection.query(connectionString, [userId], (err, rows) => {
        if (err) console.log(err);
        else res.status(200).send(rows);
      });
    }
  });
});

app.post('/pullSolutionVotes', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed')
    else {
      const { userId } = decoded;
      const connectionString = `
      SELECT upvote, downvote, solutionId
      FROM solutionVotes
      WHERE userId=?`;
      connection.query(connectionString, [userId], (err, rows) => {
        if (err) console.log(err);
        else res.status(200).send(rows);
      });
    }
  });
});

app.post('/pullFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else if (!decoded.userId || !decoded.groupName || !decoded.groupId) res.status(400).send('Token out of date, please re-login');
    else {
      const { groupId } = decoded;
      const language = decoded.language || 'en';
      const admin = decoded.admin ? true : false;
      const connectionString = `
      SELECT a.id, a.groupId, a.userId, a.text as backupText, a.category, c.translatedText AS text, c.translatedFrom, a.status, a.imageURL, a.approved, b.upvotes, b.downvotes, b.noOpinions, d.translatedOfficialReply AS officialReply, d.translatedFromOfficialReply, a.date, a.officialReply AS backupOfficialReply, b.trendingScore
      FROM feedback a
      LEFT JOIN (
        SELECT feedbackId, SUM(upvote) AS upvotes, SUM(downvote) as downvotes, SUM(noOpinion) as noOpinions, (SUM(upvote * ((1000*60 * 60 * 24)/((1000*60 * 60 * 24)+((NOW() - date))))) - (SUM(downvote * (1/(1+((NOW()/(1000*60 * 60 * 24)) - (date/(1000 * 60 * 60 * 24)))))))) as trendingScore
        FROM feedbackVotes
        GROUP BY feedbackId
      ) b
      ON a.id = b.feedbackId
      LEFT JOIN (
        SELECT targetId as feedbackId, translatedText, translatedFrom
        FROM translatedText
        WHERE type='feedback'
        AND language=?
      ) c
      ON a.id = c.feedbackId
      LEFT JOIN (
        SELECT targetId as feedbackId, translatedText as translatedOfficialReply, translatedFrom AS translatedFromOfficialReply
        FROM translatedText
        WHERE type='reply'
        AND language=?
      ) d
      ON a.id = d.feedbackId
      WHERE a.groupId=? ` + (admin ? '' : `AND a.approved=1 AND a.status<>'tabled'`);
      connection.query(connectionString, [language, language, groupId], (err, rows) => {
        // if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1472');
        if (err) console.log(err);
        else {
          const adjRows = rows.map((row) => {
            if (!row.upvotes) { row.upvotes = 0; }
            if (!row.downvotes) { row.downvotes = 0; }
            if (!row.noOpinions) { row.noOpinions = 0; }
            if (!row.trendingScore) { row.trendingScore = 0; }
            if (!row.text) { row.text = row.backupText || ''; }
            if (!row.officialReply) { row.officialReply = row.backupOfficialReply || ''; }
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
      const { groupId } = decoded;
      const language = decoded.language || 'en';
      const admin = decoded.admin ? true : false;
      const connectionString = `
      SELECT a.id, a.feedbackId, a.userId, c.translatedText AS text, c.translatedFrom, a.approved, b.upvotes, b.downvotes, a.date, a.text AS backupText, a.status
      FROM solutions a
      LEFT JOIN (
        SELECT solutionId, SUM(upvote) AS upvotes, SUM(downvote) as downvotes
        FROM solutionVotes
        GROUP BY solutionId
      ) b
      ON a.id = b.solutionId
      LEFT JOIN (
        SELECT targetId as solutionId, translatedText, translatedFrom
        FROM translatedText
        WHERE type='solution'
        AND language=?
      ) c
      ON a.id = c.solutionId
      JOIN feedback d
      ON a.feedbackId = d.id
      WHERE d.groupId=?` + (admin ? '' : ' AND a.approved=1');
      connection.query(connectionString, [language, groupId], (err, rows) => {
        if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4685');
        else {
          const adjRows = rows.map((row) => {
            if (!row.upvotes) { row.upvotes = 0; }
            if (!row.downvotes) { row.downvotes = 0; }
            if (!row.text) { row.text = row.backupText || ''; }
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
      const { userId, groupId } = decoded;
      let connectionString = `
        SELECT
          a.id as userId,
          a.language,
          b.groupName,
          b.groupSignupCode,
          b.feedbackRequiresApproval,
          b.solutionsRequireApproval,
          b.showStatus,
          b.includePositiveFeedbackBox
        FROM
          users a
        JOIN
          groups b
        ON
          a.groupId = b.id
        WHERE
          a.id=?`;
      connection.query(connectionString, [userId], (err1, rows1) => {
        if (err) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1345');
        } else if (!rows1 || !rows1.length) {
          res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1SDF');
        } else {
          connectionString =
          `SELECT category, categoryOrder
           FROM categories
           WHERE groupId=?`;
          connection.query(connectionString, [groupId], (err2, rows2) => {
            if (err2) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 1346');
            else {
              connectionString =
              `SELECT location, locationOrder
               FROM locations
               WHERE groupId=?`;
               connection.query(connectionString, [groupId], (err3, rows3) => {
                 if (err3) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 4625');
                 else {
                   let categories = [];
                   let locations = [];
                   rows2.forEach((row) => { categories[row.categoryOrder] = row.category; });
                   rows3.forEach((row) => { locations[row.locationOrder] = row.location; });
                   categories = categories.filter(category => category !== undefined);
                   locations = locations.filter(location => location !== undefined);
                   res.status(200).send({ groupInfo: rows1[0], categories, locations });
                 }
               });
            }
          });
        }
      });
    }
  });
});

function signupCodeEmail(code) {

}

function officialReplyEmail({ feedback, message }) {
  const subjectLine = 'Suggestion Box: New Management Response';
  const bodyText = `Management just responded to your feedback:\n
${feedback.text}\n
\n
Management has said:\n
${message}\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}

function inviteToGroupEmail() {
  const subjectLine = 'Join Suggestion Box';
  const bodyText = `
  <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Join Suggestion Box</title>
   </head>

    <body>
    <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Ryan Newton has invited you to join the Suggestion Box group</span>

        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #FFFFFF;">
                <tr>
                    <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
              <tr>
                <td valign="top" id="templateHeader" style="background-color: #61b8eb;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 20px;padding-bottom: 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
    <tbody>
        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        <img align="left" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/3acab16f-2e16-4e8d-9ae6-efc183904d8c.png" width="70" style="max-width: 70px;padding-left: 25px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;" />
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">
<p style="margin: 10px 10px;padding: 0;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Your friend Ryan Newton has invited you to</span></span></p>
<p style="margin: 10px 10px;padding: 0;color: #FFFFFF;font-family: Courier New;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif;font-size: 28px;font-weight: bold;">Join PearLaunchPad on Suggestion Box</span></span></p>
<p style="margin: 10px 10px;padding-top: 20px;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Download the Suggestion Box App for <a href="https://itunes.apple.com/us/app/collaborative-feedback-app/id1183559556?ls=1&mt=8" target="_blank" style="color: #FFFFFF;font-weight: bold;text-decoration: underline;">ios</a> or <a href="https://play.google.com/store/apps/details?id=com.feedbackapp" target="_blank" style="color: #FFFFFF;font-weight: bold;text-decoration: underline;">android</a>. Login with your email address and use Group Name "PearLaunchPad"</span></span></p>

                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table>
</td>
              </tr>
              <tr>
                <td valign="top" style="background-color: #012234;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
    <tbody>
        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #FFFFFF;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
                        
                            <a href="https://itunes.apple.com/us/app/collaborative-feedback-app/id1183559556?ls=1&mt=8" target="_blank" style="color: #FFFFFF;font-weight: normal;text-decoration: underline;"><img data-file-id="137253" height="29" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/03d0eede-989a-4f96-a179-e04902bf930b.png" width="100" style="border: 0;height: auto !important;outline: none;text-decoration: none;"></a>  <a href="https://play.google.com/store/apps/details?id=com.feedbackapp" target="_blank" style="color: #FFFFFF;font-weight: normal;text-decoration: underline;"><img data-file-id="137257" height="29" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/ea792423-13da-425f-84a0-f22cf6c57e11.png" width="100" style="border: 0;height: auto !important;outline: none;text-decoration: none;"></a><br>
<br>
<em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #FFFFFF;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
 
                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table></td>
              </tr>
            </table>
                    </td>
                </tr>
            </table>
        </center>
</body>
</html>
  `;
  return { subjectLine, bodyText };
}

function rejectFeedbackEmail({ feedback, message, adminEmail }) {
  const subjectLine = 'Update on your recent feedback';
  const bodyText = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Update on your recent feedback</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Update on your feedback: "${feedback.text}"</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
              <tbody>
        <tr>
            <td valign="top">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
    <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Unfortunately, your feedback "${feedback.text}" <span style="color: #F54B5E;"><strong>could not be added</span></strong> to the public board. The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your contact information has been kept confidential. If you would like to follow up, please email the moderator at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table>
  </td>
                </tr>
                <tr>
                  <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
  <br>
  <em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
   
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table></td>
                </tr>
              </table>
                      </td>
                  </tr>
              </table>
          </center>
  </body>
  </html>
  `;
  return { subjectLine, bodyText };
}

function rejectSolutionEmail({ solution, message, adminEmail }) {
  const subjectLine = 'Update on your recent comment';
  const bodyText = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Update on your recent comment</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Update on your comment: "${solution.text}"</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
              <tbody>
        <tr>
            <td valign="top">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
    <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Unfortunately, your comment "${solution.text}" <span style="color: #F54B5E;"><strong>could not be added</span></strong> to the public board. The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your contact information has been kept confidential. If you would like to follow up, please email the moderator at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table>
  </td>
                </tr>
                <tr>
                  <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
  <br>
  <em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
   
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table></td>
                </tr>
              </table>
                      </td>
                  </tr>
              </table>
          </center>
  </body>
  </html>
  `;
  return { subjectLine, bodyText };
}

function clarifyFeedbackEmail({ feedback, message, adminEmail }) {
  const subjectLine = 'Suggestion Box: Clarification needed';
  const bodyText = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Update on your recent feedback</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Update on your feedback: "${feedback.text}"</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
              <tbody>
        <tr>
            <td valign="top">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
    <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your moderator has <span style="color: #F8C61C;"><strong>requested for a clarification</span></strong> on your recent feedback "${feedback.text}". The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The feedback is not published at this point. Your contact information has been kept confidential. If you would like to follow up, please email the moderator at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table>
  </td>
                </tr>
                <tr>
                  <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
  <br>
  <em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
   
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table></td>
                </tr>
              </table>
                      </td>
                  </tr>
              </table>
          </center>
  </body>
  </html>
  `;
  return { subjectLine, bodyText };
}

function clarifySolutionEmail({ solution, message, adminEmail }) {
  const subjectLine = 'Update on your recent comment';
  const bodyText = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Update on your recent comment</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Update on your comment: "${solution.text}"</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
              <tbody>
        <tr>
            <td valign="top">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
    <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your moderator has <span style="color: #F8C61C;"><strong>requested for a clarification</span></strong> on your recent comment "${solution.text}". The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The comment is not published at this point. Your contact information has been kept confidential. If you would like to follow up, please email the moderator at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table>
  </td>
                </tr>
                <tr>
                  <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
  <br>
  <em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
   
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table></td>
                </tr>
              </table>
                      </td>
                  </tr>
              </table>
          </center>
  </body>
  </html>
  `;
  return { subjectLine, bodyText };
}

function routeFeedbackEmail({ feedback, message, adminEmail }) {
  const subjectLine = 'An admin thought that this feedback would be of interest to you';
  const bodyText = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>An admin thought that this feedback would be of interest to you</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">An admin thought that this feedback would be of interest to you</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>An admin thought that this feedback would be of interest to you: "${feedback.text}". They included this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>If you would like to follow up, please email the admin at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table>
  </td>
                </tr>
                <tr>
                  <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
          <tr>
              <td valign="top" style="padding-top: 9px;">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>
                          
                          <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
  <br>
  <em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
   
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody>
  </table></td>
                </tr>
              </table>
                      </td>
                  </tr>
              </table>
          </center>
  </body>
  </html>
`;
  return { subjectLine, bodyText };
}

function replyFeedbackEmail({ feedback, message, adminEmail }) {
  const subjectLine = `Reply to Your Feedback: "${feedback.text}`;
  const bodyText =
    `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reply to Your Feedback: "${feedback.text}"</title>
   </head>

    <body>
    <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Your Feedback received a reply from a group administrator</span>

        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                <tr>
                    <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
              <tr>
                <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
        <tbody>
        <tr>
            <td valign="top">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">

                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff;max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                         
<p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 28px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>Hi</span></strong></p>
<p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>A moderator had a question about this feedback: "${feedback.text}". They included this message:</span></p>
<p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
<p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your contact information has been kept confidential. If you would like to follow up, please email the admin at ${adminEmail}.</span></p>
<p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
<p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table>
</td>
              </tr>
              <tr>
                <td valign="top" style="background-color: #0081CB;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;padding-top: 15px;padding-bottom: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
    <tbody>
        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #fff;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
<br>
<em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #fff;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
 
                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table></td>
              </tr>
            </table>
                    </td>
                </tr>
            </table>
        </center>
</body>
</html>
    `;
  return { subjectLine, bodyText };
}

app.listen(8081, () => {
  console.log('Suggestion Box Server listening on port 8081!');
});
