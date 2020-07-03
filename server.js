const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
var neo4j = require('neo4j-driver');
var tq = require('./api/taskQueries')
var dq = require('./api/dependencyQueries')
var pq = require('./api/projectQueries')
var gq = require('./api/graphQueries')

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/projectInfo', pq.getProjects);
app.post('/project/add', pq.createProject);
app.post('/project/delete', pq.deleteProject);
app.post('/project/update', pq.updateProject);
app.post('/task/add', tq.createTask);
app.post('/task/update', tq.updateTask);
app.post('/task/delete', tq.deleteTask);
app.post('/task/progress', tq.updateProgress);
app.post('/dependency/add', dq.createDependency);
app.post('/dependency/update', dq.updateDependency);
app.post('/dependency/delete', dq.deleteDependency);
app.post('/getProject', gq.getProjectTasks)

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	  
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
	  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
  }

app.listen(port, () => console.log(`Listening on port ${port}`));