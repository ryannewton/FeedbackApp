var express = require('express');
var mysql   = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var connection = mysql.createConnection({
  host     : 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
  user     : 'root',
  password : 'buechelejedi16',
  port     : '3306',
  database : 'feedbackappdb'
});

connection.connect();

app.use(express.static('public'));

//Inserts a new Feedback Record in the Database, fields (userID, text, time_submitted)
app.post('/addFeedback', upload.array(), function(req, res) {
	
	//INSERT TIMESEGMENT
	connection.query("INSERT INTO feedback (text, time) VALUES ('" + req.body.text  + "', '" + req.body.time + "');", function(err) {
	  if (err) throw err;	  	 
	});

	res.sendStatus(200);	
});


//Pulls Feedback From Server
app.post('/pullFeedback', upload.array(), function(req, res) {
	console.log(req.body);

	var connection_string = `
		SELECT
			text
		FROM 
			feedback		
		WHERE 
			time
				BETWEEN '` + req.body.start_date + `' AND '` + req.body.end_date + `'`;

	console.log(connection_string);
	connection.query(connection_string, function(err, rows, fields) {

	  if (err) throw err;
	  else {
	  	console.log(rows);
	  	res.send(rows);
	  } 

	});
});

/*
//Inserts a new user into the Database, fields (userID, email_address)
app.get('/addUser', function(req, res) {

	//INSERT TIMESEGMENT
	connection.query("INSERT IGNORE INTO time_segments (url, datetime, userid, timespent) VALUES (" + encrypt(req.query.url, req.query.userid) + ", " + encrypt(req.query.datetime, req.query.userid) + ", " + encrypt(req.query.userid, req.query.userid) + ", " + encrypt(req.query.timespent, req.query.userid) + ");", function(err) {
	  if (err) throw err;	  	 
	});

	res.header('Access-Control-Allow-Origin', '*');
	res.sendStatus(200);
});
*/

app.listen(8081, function () {
  console.log('Example app listening on port 8081!');
});


