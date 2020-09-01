const db = require("../DB");
let updateProject = require("./updateProject");

function createTask(req, res) {
  db.getSession()
    .run(
      `
        MATCH (b) 
        WHERE ID(b) = ${req.body.changedInfo.ct_pid} 
        CREATE(a:Task {
          name: "${req.body.changedInfo.ct_Name}", 
          startDate: datetime("${req.body.changedInfo.ct_startDate}"), 
          endDate: datetime("${req.body.changedInfo.ct_endDate}"),
          description: "${req.body.changedInfo.ct_description}", 
          projId: ${req.body.changedInfo.ct_pid}, 
          type: "Incomplete",
          progress: 0
        })-[n:PART_OF]->(b) 
        RETURN a
      `
    )
    .then((result) => {
      let startDate = result.records[0]._fields[0].properties.startDate;
      let smonth = startDate.month.low < 10 ? `0${startDate.month.low}` : startDate.month.low ;
      let sday = startDate.day.low < 10 ? `0${startDate.day.low}` : startDate.day.low ;
      let shour = startDate.hour.low < 10 ? `0${startDate.hour.low}` : startDate.hour.low ;
      let smin = startDate.minute.low < 10 ? `0${startDate.minute.low}` : startDate.minute.low ;
      let endDate = result.records[0]._fields[0].properties.endDate;
      let emonth = endDate.month.low < 10 ? `0${endDate.month.low}` : endDate.month.low ;
      let eday = endDate.day.low < 10 ? `0${endDate.day.low}` : endDate.day.low ;
      let ehour = endDate.hour.low < 10 ? `0${endDate.hour.low}` : endDate.hour.low ;
      let emin = endDate.minute.low < 10 ? `0${endDate.minute.low}` : endDate.minute.low ;
      let task = {
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        startDate: `${startDate.year.low}-${smonth}-${sday}T${shour}:${smin}`,
        endDate: `${endDate.year.low}-${emonth}-${eday}T${ehour}:${emin}`,
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
      for (var x = 0; x < req.body.nodes.length; x++) {
        if (req.body.nodes[x].id == req.body.changedInfo.id) {
          if (x == 0) {
            req.body.nodes.shift();
          } else {
            req.body.nodes.splice(x, x);
          }
        }
      }

      for (var x = 0; x < req.body.rels.length; x++) {
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

      let queriesArray = [];
      for (var x = 0; x < successors.length; x++) {
        await updateProject.updateProject(
          successors[x].id,
          req.body.nodes,
          req.body.rels,
          queriesArray
        );
      }

      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: null,
      });
      updateProject.excecuteQueries(queriesArray);
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

async function updateTask(req, res) {
  //update a task with a certain ID with specified fields
  result = await db
    .getSession()
    .run(
      `
        MATCH (a) 
        WHERE ID(a) = ${req.body.changedInfo.ut_id}
        SET a += {
          name:"${req.body.changedInfo.ut_name}",
          startDate: datetime("${req.body.changedInfo.ut_startDate}"),
          endDate: datetime("${req.body.changedInfo.ut_endDate}"),
          description: "${req.body.changedInfo.ut_description}"
        }
        RETURN a
      `
    )
    .then(async (result) => {
      let startDate = result.records[0]._fields[0].properties.startDate;
      let smonth = startDate.month.low < 10 ? `0${startDate.month.low}` : startDate.month.low ;
      let sday = startDate.day.low < 10 ? `0${startDate.day.low}` : startDate.day.low ;
      let shour = startDate.hour.low < 10 ? `0${startDate.hour.low}` : startDate.hour.low ;
      let smin = startDate.minute.low < 10 ? `0${startDate.minute.low}` : startDate.minute.low ;
      let endDate = result.records[0]._fields[0].properties.endDate;
      let emonth = endDate.month.low < 10 ? `0${endDate.month.low}` : endDate.month.low ;
      let eday = endDate.day.low < 10 ? `0${endDate.day.low}` : endDate.day.low ;
      let ehour = endDate.hour.low < 10 ? `0${endDate.hour.low}` : endDate.hour.low ;
      let emin = endDate.minute.low < 10 ? `0${endDate.minute.low}` : endDate.minute.low ;
      let changedTask = {
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        startDate: `${startDate.year.low}-${smonth}-${sday}T${shour}:${smin}`,
        endDate: `${endDate.year.low}-${emonth}-${eday}T${ehour}:${emin}`,
      };
      for (var x = 0; x < req.body.nodes.length; x++) {
        if (req.body.nodes[x].id == changedTask.id) {
          req.body.nodes[x] = changedTask;
        }
      }

      let upDep = false;
      if (
        result.records[0]._fields[0].properties.startDate !=
          req.body.changedInfo.ut_startDate ||
        result.records[0]._fields[0].properties.duration !=
          req.body.changedInfo.ut_duration
      )
        upDep = true;

      let queriesArray = [];
      if (upDep == true) {
        await updateProject.updateProject(
          changedTask.id,
          req.body.nodes,
          req.body.rels,
          queriesArray
        );
      }

      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: changedTask.id,
        displayRel: null,
      });
      updateProject.excecuteQueries(queriesArray);
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

async function updateProgress(req, res) {
  db.getSession()
    .run(
      `
        MATCH (n)
        WHERE ID(n) = ${req.body.id}
        SET n += {
          progress:${req.body.progress},
          type: "${req.body.type}"
        }
        RETURN n
      `
    )
    .then((result) => {
      res.status(200);
      res.send({ ret: result });
    });
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  updateProgress,
};
