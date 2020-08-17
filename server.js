const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
var tq = require("./api/projectApi/taskQueries");
var dq = require("./api/projectApi/dependencyQueries");
var pq = require("./api/projectApi/projectQueries");
var gq = require("./api/projectApi/graphQueries");
var um = require("./api/userManagementApi/userQueries");
var personQueries = require("./api/projectApi/personQueries");
var nh = require("./api/notificationApi/notificationHandler");

const db = require("./api/DB");

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
app.post("/project/criticalpath", pq.getCriticalPath);
app.post("/task/add", tq.createTask);
app.post("/task/update", tq.updateTask);
app.post("/task/delete", tq.deleteTask);
app.post("/task/progress", tq.updateProgress);
app.post("/dependency/add", dq.createDependency);
app.post("/dependency/update", dq.updateDependency);
app.post("/dependency/delete", dq.deleteDependency);
app.post("/getProject", gq.getProjectTasks);
app.post("/login", um.login);
app.post("/register", um.register);
app.post("/verify", um.verify);
app.post("/user/get", um.getUser);
app.post("/user/edit", um.editUser);
app.post("/user/checkpermission", um.checkPermission);
app.post("/mobile", async (req, res) => {
  taskArr = req.body.nodes;
  relArr = req.body.links;
  direction = req.body.graphDir;

  let criticalPath = null;
  if (req.body.criticalPath === "true") {
    criticalPath = await db
      .getSession()
      .run(
        `
			MATCH (a:Task {projId: ${parseInt(
        req.body.projId
      )}})-[:DEPENDENCY *..]->(b:Task {projId: ${parseInt(req.body.projId)}})
			WITH MAX(duration.inDays(a.startDate, b.endDate)) as dur
			MATCH p = (c:Task {projId: ${parseInt(
        req.body.projId
      )}})-[:DEPENDENCY *..]->(d:Task {projId: ${parseInt(req.body.projId)}})
			WHERE duration.inDays(c.startDate, d.endDate) = dur
			RETURN p
		`
      )
      .then((result) => {
        res.status(200);
        if (result.records[0] != null)
          return { path: result.records[0]._fields[0] };
        else return { path: null };
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send(err);
      });
  }

  res.render("GraphMobile", {
    tasks: taskArr,
    rels: relArr,
    graphDirection: direction,
    criticalPath: JSON.stringify(criticalPath),
  });
});
app.post("/people/getAllUsers", personQueries.getAllUsers);
app.post("/people/assignPeople", personQueries.assignPeople);
app.post("/people/updateAssignedPeople", personQueries.updateAssignedPeople);
app.post("/people/projectUsers", personQueries.getProjectUsers);
app.post("/sendNotification", nh.sendNotification);
app.post("/retrieveNotifications", nh.retrieveNotifications);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "clientWeb/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "clientWeb/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
