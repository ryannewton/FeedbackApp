var express = require('express');
var mysql   = require('mysql');
var app = express();

//For uploading longer/complicated texts
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

//For email sending
var aws = require('aws-sdk'); // load aws sdk
aws.config.loadFromPath('config.json'); // load aws config
var ses = new aws.SES({apiVersion: '2010-12-01'}); // load AWS SES

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var connection = mysql.createConnection({
	//production database
	host     : 'aa1q5328xs707wa.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',

	//development database
	//host     : 'aa6pcegqv7f2um.c4qm3ggfpzph.us-west-2.rds.amazonaws.com',
	user     : 'root',
	password : 'buechelejedi16',
	port     : '3306',
	database : 'feedbackappdb'
});

connection.connect();

app.use(express.static('public'));

function sendEmail(to, from, subject_line, body_text) {
	ses.sendEmail( {
		Source: from,
		Destination: { ToAddresses: to },
		Message: {
			Subject: {
				Data: subject_line
			},
			Body: {
				Text: {
					Data: body_text
				}
			}
		}
	}
	, function(err, data) {
		if (err) console.log(err, err.stack);
		else     console.log(data);
	 });
}

//Add Feedback, Projects, Solutions
app.post('/addFeedback', upload.array(), function(req, res) {

	connection.query("INSERT INTO feedback (text, time, email) VALUES (?, ?, ?)", [req.body.text, req.body.time, req.body.email], function(err) {
		if (err) throw err;
	});

	//Send Email
	var to_emails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com'];
	var from_email = 'jeeves@collaborativefeedback.com';
	sendEmail(to_emails, from_email, "Feedback: " + req.body.text, "Email: " + req.body.email);

	res.sendStatus(200);
});

app.post('/addProject', upload.array(), function(req, res) {

	var title = (req.body.feedback) ? req.body.feedback.text : "Blank Title";

	connection.query('INSERT INTO projects SET ?', {title, description: 'Blank Description', votes: 0, stage: 'new'}, function(err, result) {
		if (err) throw err;
		if (req.body.feedback) {
			sendEmail(['tyler.hannasch@gmail.com'], 'jeeves@collaborativefeedback.com', 'A new project has been created for your feedback', 'The next step is to get people to upvote it so it is selected for action by the department heads');
			connection.query('UPDATE feedback SET project_id = ? WHERE id = ?', [result.insertId, req.body.feedback.id], function(err) {
				if (err) throw err;
			});
		}
		res.json({id: result.insertId});
	});
});

app.post('/addSolution', upload.array(), function(req, res) {

	connection.query('INSERT INTO project_additions SET ?', {type: 'solution', votes_for: 0, votes_against: 0, title: 'Title Here', description: 'Description Here', project_id: req.body.project_id}, function(err, result) {
		if (err) throw err;
		res.json({id: result.insertId});
	});
});


//Save Project, Project_Addition Changes
app.post('/saveProjectChanges', upload.array(), function(req, res) {

	connection.query("UPDATE projects SET votes = ?, title = ?, description = ? WHERE id= ?", [req.body.project.votes, req.body.project.title, req.body.project.description, req.body.project.id], function(err) {
		if (err) throw err;
	});

	res.sendStatus(200);
});

app.post('/saveProjectAdditionChanges', upload.array(), function(req, res) {
	connection.query("UPDATE project_additions SET votes_for = ?, votes_against = ?, title = ?, description = ? WHERE id= ?", [req.body.project_addition.votes_for, req.body.project_addition.votes_against, req.body.project_addition.title, req.body.project_addition.description, req.body.project_addition.id], function(err) {
		if (err) throw err;
	});

	res.sendStatus(200);
});


//Delete Projects, Project_Additions
app.post('/deleteProject', upload.array(), function(req, res) {

	connection.query('DELETE FROM projects WHERE id = ?', [req.body.id], function(err, result) {
		if (err) throw err;
	});

	res.sendStatus(200);
});

app.post('/deleteProjectAddition', upload.array(), function(req, res) {

	connection.query('DELETE FROM project_additions WHERE id = ?', [req.body.id], function(err, result) {
		if (err) throw err;
	});

	res.sendStatus(200);
});

//Pull Feedback, Projects, Project Additions, Discussion Posts
app.post('/pullFeedback', upload.array(), function(req, res) {

	var connection_string = `
		SELECT
			*
		FROM
			feedback
		WHERE
			time
				BETWEEN ? AND ?`;
	console.log(connection_string);

	connection.query(connection_string, [req.body.start_date, req.body.end_date], function(err, rows, fields) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.post('/pullProjects', upload.array(), function(req, res) {

	var connection_string = `
		SELECT
			id, title, votes, description, department, stage
		FROM
			projects`;
	console.log(connection_string);

	connection.query(connection_string, function(err, rows, fields) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.post('/pullProjectAdditions', upload.array(), function(req, res) {

	var connection_string = `
		SELECT
			id, type, votes_for, votes_against, title, description, project_id
		FROM
			project_additions`;
	console.log(connection_string);

	connection.query(connection_string, function(err, rows, fields) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.post('/pullDiscussionPosts', upload.array(), function(req, res) {

	var connection_string = `
		SELECT
			id, point, counter_point, project_addition_id
		FROM
			discussion_posts`;
	console.log(connection_string);

	connection.query(connection_string, function(err, rows, fields) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.listen(8081, function () {
	console.log('Example app listening on port 8081!');
});






