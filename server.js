const express = require('express');
var bodyParser = require("body-parser"); 
const path = require('path');
var tq = require('./api/projectApi/taskQueries');
var dq = require('./api/projectApi/dependencyQueries');
var pq = require('./api/projectApi/projectQueries');
var gq = require('./api/projectApi/graphQueries');
var um = require('./api/userManagementApi/userQueries');

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/project/get", pq.getProjects);
app.post("/project/add", pq.createProject);
app.post("/project/delete", pq.deleteProject);
app.post("/project/update", pq.updateProject);
app.post("/project/progress", pq.getProgress);
app.post("/project/projecttasks", pq.getProjectTasks);
app.post('/project/criticalpath', pq.getCriticalPath);
app.post("/task/add", tq.createTask);
app.post("/task/update", tq.updateTask);
app.post("/task/delete", tq.deleteTask);
app.post("/task/progress", tq.updateProgress);
app.post("/dependency/add", dq.createDependency);
app.post("/dependency/update", dq.updateDependency);
app.post("/dependency/delete", dq.deleteDependency);
app.post("/getProject", gq.getProjectTasks);
app.post('/login', um.login);
app.post('/register', um.register);
app.post('/verify', um.verify);
app.post('/user/get', um.getUser);
app.post('/user/edit', um.editUser);
app.post("/mobile", async (req, res) => {
	taskArr = req.body.nodes
	relArr = req.body.links
	direction = req.body.graphDir
	//console.log(direction)
	res.render("GraphMobile", {
		tasks: taskArr,
		rels: relArr,
		graphDirection: direction
	})
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "clientWeb/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "clientWeb/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
