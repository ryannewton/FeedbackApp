const MailComposer = require('nodemailer/lib/mail-composer');
const aws = require('aws-sdk'); // load aws sdk
const mysql = require('mysql');

const ses = new aws.SES({ apiVersion: '2010-12-01' }); // load AWS SES

const connection = mysql.createConnection({
  user: 'root',
  password: process.env.JWT_KEY,
  port: '3306',
  database: 'feedbackappdb',
  host: process.env.db || 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
});

connection.connect();

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

module.exports = { sendEmail, connection };
