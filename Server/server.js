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

app.post('/addFeedback', upload.array(), function(req, res) {

	connection.query("INSERT INTO feedback (text, time, email) VALUES (?, ?, ?)", [req.body.text, req.body.time, req.body.email], function(err) {
	  if (err) throw err;	  	 
	});

	res.sendStatus(200);	
});

app.post('/saveProjectChanges', upload.array(), function(req, res) {
	
	connection.query("UPDATE projects SET votes = ?, title = ?, description = ? WHERE id= ?", [req.body.project.votes, req.body.project.title, req.body.project.description, req.body.project.id], function(err) {
	  if (err) throw err;	  	 
	});

	res.sendStatus(200);	
});

app.post('/addProject', upload.array(), function(req, res) {

	connection.query('INSERT INTO projects SET ?', {title: 'Blank Title', description: 'Blank Description', votes: 0, stage: 'new'}, function(err, result) {
	  if (err) throw err;
	  res.json({id: result.insertId});
	});
});

app.post('/addSolution', upload.array(), function(req, res) {

	connection.query('INSERT INTO project_additions SET ?', {type: 'solution', votes_for: 0, votes_against: 0, title: 'Title Here', description: 'Description Here', project_id: req.body.project_id}, function(err, result) {
	  if (err) throw err;
	  res.json({id: result.insertId});
	});
});

app.post('/deleteProject', upload.array(), function(req, res) {
	
	connection.query('DELETE FROM projects WHERE id = ?', [req.body.id], function(err, result) {
	  if (err) throw err;
	});

	res.sendStatus(200);
});

app.post('/pullFeedback', upload.array(), function(req, res) {
	
	var connection_string = `
		SELECT
			text
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


