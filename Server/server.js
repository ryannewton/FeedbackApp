var express = require('express');
var mysql   = require('mysql');
var app = express();

//For authentication
var jwt = require('jsonwebtoken');

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
//app.use(expressJWT({ secret: 'buechelejedi16' }).unless({ path: ['/sendAuthorizationEmail', '/authorizeUser'] }));

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

var from_email = 'admin@collaborativefeedback.com';

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

function getDomain(email) {
	var re = /@\w*\.\w*$|\.\w*\.\w*$/;
	console.log(re.exec(email)[0].slice(1));
	return re.exec(email)[0].slice(1);
}

//Authentication
app.post('/sendAuthorizationEmail', upload.array(), function(req, res) {
	console.log(req.body);
	//Step #1: Generate a code
	let code = generatePassword(4);
	console.log(code);

	//Step #2: Add the email, code, and timestamp to the database
	connection.query("INSERT INTO users (email, passcode) VALUES (?, ?) ON DUPLICATE KEY UPDATE passcode=?, passcode_time=NOW()", [req.body.email, String(code), String(code)], function(err) {
		if (err) throw err;
	});

	//Step #3: Send an email with the code to the user (make sure it shows up in notification)
	sendEmail([req.body.email], from_email, "Collaborative Feedback: Verify Your Email Address", "Enter this passcode: " + String(code));

	res.sendStatus(200);
});

app.post('/authorizeUser', upload.array(), function(req, res) {
	console.log(req.body);

	//Step #1: Query the database for the passcode and passcode_time associated with the email address in req.body
	connection.query("SELECT passcode_time FROM users WHERE email=? AND passcode=?", [req.body.email, req.body.code], function(err, rows, fields) {
		if (err) throw err;
		//Step #2: Check that it matches the passcode submitted by the user, if not send error
		//Step #3: If it checks out then create a JWT token and send to the user
		if (rows.length) {
			var myToken = jwt.sign({ email: req.body.email }, 'buechelejedi16')
			console.log(myToken);
			res.status(200).json(myToken);
		} else {
			res.status(400).send('Incorrect Code');
		}
	});
});

//Add Feedback, Projects, Solutions
app.post('/addFeedback', upload.array(), function(req, res) {

	jwt.verify(req.body.authorization, 'buechelejedi16', function(err, decoded) {

		if (err) {
			res.status(400).send('authorization failed');
		} else {
			var school = getDomain(decoded.email);

			connection.query("INSERT INTO feedback (text, time, email, school) VALUES (?, ?, ?, ?)", [req.body.text, req.body.time, decoded.email, school], function(err) {
				if (err) throw err;
			});

			//Send Email
			var to_emails = ['tyler.hannasch@gmail.com', 'newton1988@gmail.com', 'alicezhy@stanford.edu'];
			sendEmail(to_emails, from_email, "Feedback: " + req.body.text, "Email: " + decoded.email);

			res.sendStatus(200);
		}
	});	
});

app.post('/addProject', upload.array(), function(req, res) {

	var title = (req.body.feedback) ? req.body.feedback.text : "Blank Title";

	connection.query('INSERT INTO projects SET ?', {title, description: 'Blank Description', votes: 0, stage: 'new'}, function(err, result) {
		if (err) throw err;
		if (req.body.feedback) {
			sendEmail(['tyler.hannasch@gmail.com'], from_email, 'A new project has been created for your feedback', 'The next step is to get people to upvote it so it is selected for action by the department heads');
			connection.query('UPDATE feedback SET project_id = ? WHERE id = ?', [result.insertId, req.body.feedback.id], function(err) {
				if (err) throw err;
			});
		}
		res.json({id: result.insertId});
	});
});

app.post('/addSolution', upload.array(), function(req, res) {

	jwt.verify(req.body.authorization, 'buechelejedi16', function(err, decoded) {

		if (err) {
			res.status(400).send('authorization failed');
		} else {
			connection.query('INSERT INTO project_additions SET ?', {description: req.body.description, projectId: req.body.projectId, email: decoded.email, school: getDomain(decoded.email), type: 'solution'}, function(err, result) {
				if (err) throw err;
				res.json({id: result.insertId});
			});
		}
	});

});

app.post('/addSubscriber', upload.array(), function(req, res) {

	console.log("Add Subscriber Body", req.body);

	jwt.verify(req.body.authorization, 'buechelejedi16', function(err, decoded) {

		connection.query('INSERT INTO subscriptions SET ?', {project_id: req.body.project_id, email: decoded.email, type: req.body.type}, function(err, result) {
			if (err) throw err;
			res.sendStatus(200);
		});

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

	connection.query(connection_string, [req.body.start_date, req.body.end_date], function(err, rows, fields) {
		if (err) throw err;
		else {
			res.send(rows);
		}
	});
});

app.post('/pullProjects', upload.array(), function(req, res) {

	jwt.verify(req.body.authorization, 'buechelejedi16', function(err, decoded) {

		if (err) {
			res.status(400).send('authorization failed');
		} else {
			var connection_string = `
				SELECT
					id, title, votes, description, department, stage
				FROM
					projects
				WHERE
					school=?`;

			connection.query(connection_string, [getDomain(decoded.email)], function(err, rows, fields) {
				if (err) throw err;
				else res.send(rows);
			});
		}
	});
});

app.post('/pullProjectAdditions', upload.array(), function(req, res) {

	jwt.verify(req.body.authorization, 'buechelejedi16', function(err, decoded) {

		if (err) {
			res.status(400).send('authorization failed');
		} else {
			var connection_string = `
				SELECT
					id, project_id, description
				FROM
					project_additions
				WHERE
					school=?`;

			connection.query(connection_string, [getDomain(decoded.email)], function(err, rows, fields) {
				if (err) throw err;
				else res.send(rows);
			});
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

//app.listen(3000, function () {
//	console.log('Example app listening on port 3000!');
//});






