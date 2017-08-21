const router = require('express').Router();
const jwt = require('jsonwebtoken'); // For authentication
const upload = require('multer')(); // for parsing multipart/form-data

const { defaultFromEmail } = require('../constants');
const { sendEmail, connection } = require('../helpers');


router.post('/submitSolution', upload.array(), (req, res) => {
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

router.post('/submitSolutionVote', upload.array(), (req, res) => {
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

// APPROVE SOLUTION
router.post('/approveSolution', upload.array(), (req, res) => {
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

router.post('/removeSolutionVote', upload.array(), (req, res) => {
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

router.post('/updateSolution', upload.array(), (req, res) => {
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

router.post('/rejectSolution', upload.array(), (req, res) => {
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

router.post('/clarifySolution', upload.array(), (req, res) => {
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

router.post('/deleteSolution', upload.array(), (req, res) => {
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

router.post('/pullSolutionVotes', upload.array(), (req, res) => {
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

router.post('/pullSolutions', upload.array(), (req, res) => {
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

  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Unfortunately, your comment...</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${solution.text}"</p>
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

  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Your moderator has requested <span style="color: #F8C61C;"><strong>clarification</span></strong> on your recent comment:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">"${solution.text}"</p>
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The moderator responded with this message:</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span style="color: #00A2FF;"><strong>"${message}"</strong></span></p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>The comment is not published at this point. Your contact information has been kept confidential. Please respond to ${adminEmail} to clarify your feedback.</span></p>
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

module.exports = router;
