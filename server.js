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

var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

app.get('/getAll', async function(req, res){
	var taskArr = [];
	await session
			.run('MATCH (n) RETURN n LIMIT 25')
			.then(function(result){
				result.records.forEach(function(record){
					taskArr.push({
						id: record._fields[0].identity.low,
						name: record._fields[0].properties.name,
					});

				});
			})
			.catch(function(err){
				console.log(err);
			});
	res.send({nodes: taskArr});
});

app.post('/api/world', async function(req, res){
	var taskArr = [];
	await session
			.run('MATCH (n) RETURN n LIMIT 25')
			.then(function(result){
				result.records.forEach(function(record){
					console.log(record._fields[0].properties.name)
					taskArr.push({
						id: record._fields[0].identity.low,
						name: record._fields[0].properties.name,
					});

				});
			})
			.catch(function(err){
				console.log(err);
			});
		console.log(taskArr[0])
	res.send({taskArr});
});

app.get('/projectInfo', pq.getProjects);
app.post('/project/add', pq.createProject);
app.post('/project/delete', pq.deleteProject);
app.post('/project/update', pq.updateProject);
app.post('/task/add', tq.createTask);
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