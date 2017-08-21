const router = require('express').Router();
const jwt = require('jsonwebtoken'); // For authentication
const upload = require('multer')(); // for parsing multipart/form-data


const { defaultFromEmail } = require('../constants');
const { sendEmail, connection } = require('../helpers');

router.post('/getGroupTreeData', upload.array(), (req, res) => {
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

// Create a new group
router.post('/createGroup', upload.array(), (req, res) => {
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

router.post('/sendInviteEmails', upload.array(), (req, res) => {
  const { groupName, email, name } = req.body;
  const connectionString = `
  SELECT groupSignupCode
  FROM groups
  WHERE groupName=?
  `;
  connection.query(connectionString, [groupName], (err, rows) => {
    if (err) res.status(400).send('Sorry, there was a problem - the server is experiencing an error - 8283');
    else {
      const subjectLine = `Join me on Suggestbox Box! - GroupName '${rows[0].groupSignupCode}'`;
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
          <tr><img align="center" alt="" src="https://gallery.mailchimp.com/bca1c4105904542810e13ee67/images/46a4a723-d971-42b9-98d1-66382d9998db.png" width="230" style="max-width: 140px;padding-bottom: 10px;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage"></tr>

        <tr>
            <td valign="top" style="padding-top: 9px;">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;" width="100%">
                    <tbody><tr>
                        <td valign="top" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;word-break: break-word;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;">
<p style="margin: 10px 10px;padding: 0;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Your friend ${name} has invited you to</span></span></p>
<p style="margin: 10px 10px;padding: 0;color: #FFFFFF;font-family: Courier New;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif;font-size: 28px;font-weight: bold;">Join '${rows[0].groupSignupCode}' on Suggestion Box</span></span></p>
<p style="margin: 10px 10px;padding-top: 20px;color: #FFFFFF;font-family: Courier New;font-size: 22px;line-height: 125%;text-align: center;"><span style="font-size:18px"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Download the Suggestion Box App for <a href="https://itunes.apple.com/us/app/collaborative-feedback-app/id1183559556?ls=1&mt=8" target="_blank" style="color: #FFFFFF;font-weight: bold;text-decoration: underline;">ios</a> or <a href="https://play.google.com/store/apps/details?id=com.feedbackapp" target="_blank" style="color: #FFFFFF;font-weight: bold;text-decoration: underline;">android</a>. Login with your email address and use Group Name "${groupName}"</span></span></p>

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
      sendEmail([email], defaultFromEmail, subjectLine, bodyText);
      res.sendStatus(200);
    }
  });
});

router.post('/pullGroupInfo', upload.array(), (req, res) => {
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

module.exports = router;
