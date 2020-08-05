const express = require('express');
var bodyParser = require("body-parser"); 
const path = require('path');
var tq = require('./api/projectApi/taskQueries');
var dq = require('./api/projectApi/dependencyQueries');
var pq = require('./api/projectApi/projectQueries');
var gq = require('./api/projectApi/graphQueries');

const db = require('./api/DB')

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/project/get', pq.getProjects);
app.post('/project/add', pq.createProject);
app.post('/project/delete', pq.deleteProject);
app.post('/project/update', pq.updateProject);
app.post('/project/progress', pq.getProgress);
app.post('/task/add', tq.createTask);
app.post('/task/update', tq.updateTask);
app.post('/task/delete', tq.deleteTask);
app.post('/task/progress', tq.updateProgress);
app.post('/dependency/add', dq.createDependency);
app.post('/dependency/update', dq.updateDependency);
app.post('/dependency/delete', dq.deleteDependency);
app.post('/getProject', gq.getProjectTasks);
// app.get('/mobile', function(req,res){
// 	// res.sendFile(__dirname + '/GraphMobile.html')
// 	res.render(__dirname +'/GraphMobile',{info:"hello"})
// });
app.get("/mobile", async (req, res) => {
    var session = db.getSession();
	// var projID = parseInt(req.body.id);
	var projID = 22;
	var taskArr = [];
	var relArr = [];
	await session
			.run('MATCH (n {projId:'+projID+'}) RETURN n')
			.then(function(result){
				result.records.forEach(function(record){
					taskArr.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name,
						description: record._fields[0].properties.description,
						startDate: record._fields[0].properties.startDate,
						endDate: record._fields[0].properties.endDate,
						duration: record._fields[0].properties.duration.low,
						progress: record._fields[0].properties.progress,
                    });
				});
			})
			.catch(function(err){
				console.log(err);
			});
	await session
			.run('MATCH (n)-[r {projId: '+projID+'}]->(m) RETURN r')
			.then(function(result){
				result.records.forEach(function(record){
					relArr.push({
						id: record._fields[0].identity.low,
						duration: record._fields[0].properties.duration.low,
						relationshipType: record._fields[0].properties.relationshipType,
						source: record._fields[0].start.low,
						target: record._fields[0].end.low
                    });
				});
				
			})
			.catch(function(err){
				console.log(err);
            });
	//res.send({tasks: taskArr, rels: relArr});
	taskArr = JSON.stringify(taskArr)
	relArr = JSON.stringify(relArr)
	res.render("GraphMobile", {
		tasks: taskArr,
		rels: relArr
	})
});

if(process.env.NODE_ENV === 'production'){
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'clientWeb/build')));
	  
	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'clientWeb/build', 'index.html'));
	});
  }

app.listen(port, () => console.log(`Listening on port ${port}`));