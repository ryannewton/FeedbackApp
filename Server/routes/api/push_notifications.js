const router = require('express').Router();
const jwt = require('jsonwebtoken'); // For authentication
const upload = require('multer')(); // for parsing multipart/form-data
const Expo = require('exponent-server-sdk'); // For sending push notifications

const { connection } = require('../helpers');

// SAVE PUSH NOTIFICATION TOKEN
router.post('/savePushToken', upload.array(), (req, res) => {
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

// SEND PUSH NOTIFICATION
router.post('/sendPushNotification', upload.array(), (req, res) => {
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

module.exports = router;
