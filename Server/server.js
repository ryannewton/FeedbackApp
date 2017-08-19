// Use local .env file for env vars when not deployed
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser'); // For uploading longer/complicated texts
const aws = require('aws-sdk'); // load aws sdk
const path = require('path');
const cors = require('cors');

aws.config.loadFromPath('config.json'); // load aws config

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.use(express.static('build'));

if (!process.env.db) {
  app.use(cors());
}

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './build/admin.html'));
});

app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname, './public/web.html'));
});

app.use(require('./routes'));

// Start the server
const server = app.listen(process.env.PORT || 8081, () => {
  console.log(`Suggestion Box Server listening on port ${server.address().port}`);
});
