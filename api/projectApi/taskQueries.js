const db = require("../DB");
let updateProject = require("./updateProject");

function createTask(req, res) {
  let startDate = new Date(req.body.changedInfo.ct_startDate);
  let endDate = new Date(req.body.changedInfo.ct_endDate);
  db.getSession()
    .run(
      `
        MATCH (b) 
        WHERE ID(b) = ${req.body.changedInfo.ct_pid} 
        CREATE(a:Task {
          name: "${req.body.changedInfo.ct_Name}", 
          startDate: datetime("${req.body.changedInfo.ct_startDate}"), 
          endDate: datetime("${req.body.changedInfo.ct_endDate}"),
          duration: ${endDate.getTime() - startDate.getTime()},
          description: "${req.body.changedInfo.ct_description}", 
          projId: ${req.body.changedInfo.ct_pid}, 
          type: "Incomplete",
          progress: 0
        })-[n:PART_OF]->(b) 
        RETURN a
      `
    )
    .then((result) => {
      let task = {
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        startDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.startDate
        ),
        endDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.endDate
        ),
        duration: result.records[0]._fields[0].properties.duration.low,
        type: result.records[0]._fields[0].properties.type,
        progress: result.records[0]._fields[0].properties.progress.low,
      };
      req.body.nodes.push(task);
      res.status(200);
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: task.id,
        displayRel: null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function deleteTask(req, res) {
  let successors = updateProject.getSuccessors(
    req.body.changedInfo.id,
    req.body.nodes,
    req.body.rels
  );

  db.getSession()
    .run(
      `
        MATCH (n)
        WHERE ID(n)=${req.body.changedInfo.id}
        DETACH DELETE (n)
      `
    )
    .then(async () => {
      for (let x = 0; x < req.body.nodes.length; x++) {
        if (req.body.nodes[x].id == req.body.changedInfo.id) {
          if (x == 0) {
            req.body.nodes.shift();
          } else {
            req.body.nodes.splice(x, x);
          }
        }
      }

      for (let x = 0; x < req.body.rels.length; x++) {
        if (
          req.body.rels[x].target == req.body.changedInfo.id ||
          req.body.rels[x].source == req.body.changedInfo.id
        ) {
          if (x == 0) {
            req.body.rels.shift();
          } else {
            req.body.rels.splice(x, x);
          }
        }
      }

      await successors.forEach(async succ => {
        await updateProject.updateTask(
          succ,
          req.body.nodes,
          req.body.rels
        );
      });
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function updateTask(req, res) { //update a task with a certain ID with specified fields
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  db.getSession()
    .run(
      `
        MATCH (a) 
        WHERE ID(a) = ${req.body.changedInfo.id}
        SET a += {
          name:"${req.body.changedInfo.name}",
          startDate: datetime("${req.body.changedInfo.startDate}"),
          endDate: datetime("${req.body.changedInfo.endDate}"),
          duration: ${endDate.getTime() - startDate.getTime()},
          description: "${req.body.changedInfo.description}",
          progress:${req.body.changedInfo.progress},
          type: "${req.body.changedInfo.type}"
        }
        RETURN a
      `
    )
    .then(async (result) => {
      let changedTask = {
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        type: result.records[0]._fields[0].properties.type,
        progress: result.records[0]._fields[0].properties.progress.low,
        startDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.startDate
        ),
        endDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.endDate
        ),
        duration: result.records[0]._fields[0].properties.duration.low,
      };
      for (var x = 0; x < req.body.nodes.length; x++) {
        if (req.body.nodes[x].id == changedTask.id) {
          req.body.nodes[x] = changedTask;
        }
      }

      await updateProject.updateTask(
        changedTask,
        req.body.nodes,
        req.body.rels,
      );

      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: changedTask.id,
        displayRel: null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
};
