const router = require('express').Router();
const jwt = require('jsonwebtoken'); // For authentication
const upload = require('multer')(); // for parsing multipart/form-data
const aws = require('aws-sdk'); // load aws sdk
const Jimp = require('jimp'); // For image processing
const googleTranslate = require('google-translate')(process.env.TRANSLATE_API_KEY);

const { defaultFromEmail } = require('../constants');
const { sendEmail, connection } = require('../helpers');

// Image uploading backend
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

router.post('/uploadPhoto', upload.single('photo'), (req, res) => {
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
      () => res.json(`https://s3-us-west-2.amazonaws.com/feedback-app-user-images/${uploadName}`));
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

// function predictCategory(feedback, callback) {
//   const py = spawn('python3', ['compute_input.py']);
//   let dataString = '';
//   py.stdout.on('data', data => dataString += data.toString());
//   py.stdout.on('end', () => callback(dataString));
//   py.stdin.write(JSON.stringify(feedback));
//   py.stdin.end();
// }

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

function submitFeedbackHelper(rows, res, decoded, feedback) {
  const approved = !rows[0].feedbackRequiresApproval;
  const { groupId, userId } = decoded;
  let { text, imageURL, category } = feedback;
  let connectionString = 'INSERT INTO feedback SET ?';
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
          adminEmail = ['alics@stanford.edu'];
        }
        if (groupId === 3) {
          adminEmail = ['Amy_King@gymboree.com'];
        }
        // Insert text
        insertText(res, result.insertId, 'feedback', text, userId);
        // Send Email to Admins
        const toEmails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', ...adminEmail];
        const subjectLine = 'A new suggestion has been submitted to your group: ' + rows[0].groupName;
          const bodyText = `
 <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>A new suggestion has been submitted to your group ${rows[0].groupName}</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Your Suggestion Box just got a new feedback</span>

          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #fff;">
                  <tr>
                      <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
                <tr>
                  <td valign="top" id="templateHeader" style="background-color: #eee;border-top: 0;border-bottom: 0;padding: 15px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
      <tbody>
            <tr><img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage"></tr>

          <tr>
              <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                      <tbody><tr>

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

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">Hi</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>A new piece of feedback has just been submitted to your Suggestion Box group:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${text}"</p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>You can login to admin console http://suggestionboxapp.com/admin to take actions on the feedback.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box Team</span></p>

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
        sendEmail(toEmails, defaultFromEmail, subjectLine, bodyText);
        res.json({ id: result.insertId });
      }
    }
  );
}

// SUBMIT
router.post('/submitFeedback', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      // Check if the feedback requires approval
      const { groupId } = decoded;
      const connectionString = 'SELECT feedbackRequiresApproval, groupName FROM groups WHERE id=?';
      connection.query(connectionString, [groupId], (err1, rows) => {
        if (err1) res.status(400).send('Sorry, there was a problem with your feedback or the server is experiencing an error - 3112');
        else {
          const { text, imageURL, category } = req.body.feedback;
          submitFeedbackHelper(rows, res, decoded, { text, imageURL, category });
          // if (!category && groupId === 1) {
          //   predictCategory(text, predictedCategory => submitFeedbackHelper(rows, res, decoded, { text, imageURL, category: predictedCategory }));
          // } else {
          //   submitFeedbackHelper(rows, res, decoded, { text, imageURL, category });
          // }
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
router.post('/submitFeedbackVote', upload.array(), (req, res) => {
  jwt.verify(req.body.authorization, process.env.JWT_KEY, (err, decoded) => {
    if (err) res.status(400).send('Authorization failed');
    else {
      const feedbackId = req.body.feedback.id;
      const { upvote, downvote, noOpinion } = req.body;
      const userId = decoded.userId;
      submitFeedbackVoteHelper(feedbackId, upvote, downvote, noOpinion, userId, res);
      res.sendStatus(200);
    }
  });
});

// APPROVE FEEDBACK
router.post('/approveFeedback', upload.array(), (req, res) => {
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

// DELETE VOTE
router.post('/removeFeedbackVote', upload.array(), (req, res) => {
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

router.post('/updateFeedback', upload.array(), (req, res) => {
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

router.post('/sendWelcomeEmail', upload.array(), (req, res) => {
  const { groupName, email } = req.body;
  const connectionString = `
  SELECT groupSignupCode
  FROM groups
  WHERE groupName=?
  `;
  connection.query(connectionString, [groupName], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8283');
    else {
  const subjectLine = 'Welcome to Suggestion Box';
    const bodyText = `
  <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Suggestion Box</title>
   </head>

    <body>
    <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">you successfully created a new Suggestion Box group</span>

        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse: collapse;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #FFFFFF;">
                <tr>
                    <td align="center" valign="top" id="bodyCell" style="height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
              <tr>
                <td valign="top" id="templateHeader" style="background-color: #61b8eb;background-image: url(https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/2b689f9f-bb1e-4724-b1ac-33427391a3d1.jpg);background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 20px;padding-bottom: 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
    <tbody>
          <tr><img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage"></tr>

        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">
<p style="margin: 10px 0;padding: 0;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Thank you for join Suggestion box!</span></span></p>
<p style="margin: 10px 0;padding: 0;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;font-weight: bold"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">You just created a new group: </span><span style="font-size:25px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">${groupName}</span></span></p>
<p style="margin: 10px 0;padding: 0;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 100%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">If you have any questions, or if you want to try more features like Admin Console and Categorization for Feedback, contact tyler@suggestionboxapp.com</span></span></p>

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
      sendEmail([email], defaultFromEmail, subjectLine, bodyText);
      res.sendStatus(200);
    }
  });
});


// REJECT FEEDBACK
// 1. Email rejection message to user
// 2. Mark feedback status as 'rejected'
// req.body = { authorization, message, feedback }
router.post('/rejectFeedback', upload.array(), (req, res) => {
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

// CLARIFY FEEDBACK
// 1. Email clarification message to user
// 2. Flag feedback as status as 'clarify'
// req.body = { authorization, message, feedback }
router.post('/clarifyFeedback', upload.array(), (req, res) => {
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

router.post('/routeFeedback', upload.array(), (req, res) => {
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

router.post('/replyFeedback', upload.array(), (req, res) => {
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

// DELETE - Needs to also delete associated official responses and solutions
router.post('/softDeleteFeedback', upload.array(), (req, res) => {
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

router.post('/deleteFeedback', upload.array(), (req, res) => {
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

// PULL
router.post('/pullFeedbackVotes', upload.array(), (req, res) => {
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

router.post('/pullFeedback', upload.array(), (req, res) => {
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
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Unfortunately, your feedback...</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${feedback.text}"</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>...could <span style="color: #F54B5E;"><strong>not</span></strong> be added to the public board. The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your contact information has been kept confidential. If you would like to follow up, please email the moderator at ${adminEmail}.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box</span></p>

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

  <p style="margin: 10px 10px;padding-top: 10px;color: #000;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">Hi</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your moderator has requested <span style="color: #F8C61C;"><strong>clarification</span></strong> on your recent feedback</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${feedback.text}"</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The feedback is not published at this point. Your contact information has been kept confidential. Please respond to ${adminEmail} to clarify your feedback.</span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box</span></p>

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

  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Hi, ${adminEmail} thought that this feedback would be of interest to you:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${feedback.text}"</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>They included this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
  <p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box</span></p>

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

<p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>A moderator replied to this feedback...</span></p>
<p style="margin: 10px 40px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${feedback.text}"</p>
<p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>They said...</span></p>
<p style="margin: 10px 40px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
<p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your contact information has been kept confidential. If you would like to reply, you can email the moderator at ${adminEmail}.</span></p>
<p style="margin: 10px 10px;padding-top: 20px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Sincerely,</span></p>
<p style="margin: 10px 10px;padding: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 100%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span> Suggestion Box</span></p>

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

function surveyEmail({ feedback }) {
  const subjectLine = `Feedback completed. Tell us what you think!`;
  const bodyText =
    `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Feedback completed. Tell us what you think!</title>
   </head>

    <body>
    <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Your feedback "${feedback.text}" is just marked as comleted by your administrator</span>

        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;border: 0;max-width: 600px !important;">
              <tr>
    <tbody>
              <tr>
                <td valign="top" style="background-color: #012234;padding-top: 15px;padding-bottom: 0px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-collapse: collapse;">
    <tbody>
                                                            <tr><img align="left" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/3acab16f-2e16-4e8d-9ae6-efc183904d8c.png" width="70" style="max-width: 70px;padding-left: 25px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;" /></tr>
        <tr>
                        <td valign="top" style="padding-top: 0;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;word-break: break-word;color: #FFFFFF;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
<p style="margin: 10px 10px;padding: 10px;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Your feedback "${feedback.text}" is marked as completed by your group's administrator.</span></span></p>
<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdKaZ2BWPH6SSnXyIJ3cOugtfDcSq6_a1Nx8-ZA-vg4jCiaWA/viewform?embedded=true" width="760" height="1480" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
<em>Copyright © 2017 <a href="http://www.suggestionboxapp.com" target="_blank" style="color: #FFFFFF;font-weight: normal;text-decoration: underline;">Suggestion Box</a>, All rights reserved.</em><br>
 
                        </td>
                    </tr>
                </tbody></table>
            </td>
              </tr>
            </table>
        </center>
</body>
</html>
    `;
  return { subjectLine, bodyText };
}

module.exports = router;
