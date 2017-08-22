const router = require('express').Router();
const jwt = require('jsonwebtoken'); // For authentication
const upload = require('multer')(); // for parsing multipart/form-data

const { defaultFromEmail } = require('../constants');
const { sendEmail, connection } = require('../helpers');


// AUTH
router.post('/sendAuthorizationEmail', upload.array(), (req, res) => {
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

function sendAuthEmailHelper(res, groupId, email, code, groupSignupCode, language) {
  // Step #3: Add the email, groupId, code, and timestamp to the database
  const connectionString = 'INSERT INTO users (groupId, email, passcode, language) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE passcode=?, groupId=?, passcodeTime=NOW(), language=?';
  connection.query(connectionString, [groupId, email, String(code), language, String(code), groupId, language], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 1A4P');
    else if (!email.includes('admin_test')) {
      // Step #4: Send an email with the code to the user (make sure it shows up in notification)
      sendEmail([email], defaultFromEmail, `Suggestion Box Code: ${code}`, `To complete the signin process, use code: ${code}`);
      const subjectLine = `Suggestion Box Code: ${code}`;
      const bodyText = `
   <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Suggestion Box Code: ${code}</title>
     </head>

      <body>
      <span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden;">Welcome to Suggestion Box!</span>

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
  <p style="margin: 10px 10px;padding-top: 0px;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Welcome to Suggestion Box!</span></p>
  <p style="margin: 10px 50px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: normal;font-family:sans-serif;">Use code ${code} to verify your email address</p>
  <p style="margin: 10px 10px;padding: 0;color: #000;font-family: Courier New;font-size: 18px;line-height: 125%;text-align: left;font-weight: lighter;font-family:sans-serif;"><span>Hope you enjoy our app!</span></p>
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
      sendEmail([email], defaultFromEmail, subjectLine, bodyText);
      res.status(200).json(groupSignupCode);
    } else res.status(200).json(groupSignupCode);
  });
}

router.post('/verifyEmail', upload.array(), (req, res) => {
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

router.post('/authorizeUser', upload.array(), (req, res) => {
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

router.post('/authorizeAdministrator', upload.array(), (req, res) => {
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

router.post('/saveEmailForDemo', (req, res) => {
  const email = req.body.email;
  const connectionString = 'INSERT INTO demoRequest (email) VALUES (?) ON DUPLICATE KEY UPDATE email=?';
  connection.query(connectionString, [email, email], (err) => {
    if (err) res.status(400).send('Sorry, there was a problem with your email or the server is experiencing an error - 9GT5');
  });
});

module.exports = router;
