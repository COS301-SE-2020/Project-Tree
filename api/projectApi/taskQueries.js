const db = require("../DB");
let updateProject = require("./updateProject");

function createTask(req, res) {
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  db.getSession()
    .run(
      `
        MATCH (b) 
        WHERE ID(b) = ${req.body.changedInfo.project.id} 
        CREATE(a:Task {
          name: "${req.body.changedInfo.name}", 
          startDate: datetime("${req.body.changedInfo.startDate}"), 
          endDate: datetime("${req.body.changedInfo.endDate}"),
          duration: "${endDate.getTime() - startDate.getTime()}",
          description: "${req.body.changedInfo.description}", 
          projId: ${req.body.changedInfo.project.id}, 
          type: "Incomplete",
          progress: 0,
          positionX: ${req.body.changedInfo.positionX},
          positionY: ${req.body.changedInfo.positionY}
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
        duration: parseInt(result.records[0]._fields[0].properties.duration),
        type: result.records[0]._fields[0].properties.type,
        progress: result.records[0]._fields[0].properties.progress.low,
        positionX: result.records[0]._fields[0].properties.positionX.low,
        positionY: result.records[0]._fields[0].properties.positionY.low,
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
        OPTIONAL MATCH (n)<-[r:VIEW_OF]-(m:View)
        DETACH DELETE n,r,m
      `
    )
    .then(async () => {
      req.body.nodes = req.body.nodes.filter((node) => {
        return node.id != req.body.changedInfo.id;
      });

      req.body.rels = req.body.rels.filter((rel) => {
        return (
          rel.target != req.body.changedInfo.id &&
          rel.source != req.body.changedInfo.id
        );
      });

      let queries = [];
      await successors.forEach(async (succ) => {
        await updateProject.updateTask(succ, req.body.nodes, req.body.rels, queries);
      });
      updateProject.runQueries(queries)

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

async function updateTask(req, res) {
  //update a task with a certain ID with specified fields
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  let changedTask = {
    id: req.body.changedInfo.id,
    name: req.body.changedInfo.name,
    description: req.body.changedInfo.description,
    type: req.body.changedInfo.type,
    progress: req.body.changedInfo.progress.low,
    startDate: req.body.changedInfo.startDate,
    endDate: req.body.changedInfo.endDate,
    duration: endDate.getTime() - startDate.getTime()
  };
  for (var x = 0; x < req.body.nodes.length; x++) {
    if (req.body.nodes[x].id == changedTask.id) {
      req.body.nodes[x] = changedTask;
    }
  }

  let queries = [];
  await updateProject.updateCurTask(
    changedTask,
    req.body.nodes,
    req.body.rels,
    queries
  );
  if (await updateProject.CheckEndDate(queries, req.body.project) == false){
    res.status(400);
    res.send({message: "After Project End Date"});
    return;
  }else{
    let timeCompleteString;
    if (
      req.body.changedInfo.timeComplete === null ||
      req.body.changedInfo.timeComplete === undefined
    ) {
      timeCompleteString = `timeComplete: ${null}`;
    } else {
      timeCompleteString = `timeComplete: datetime("${req.body.changedInfo.timeComplete}")`;
    }

    db.getSession()
      .run(
        `
          MATCH (a) 
          WHERE ID(a) = ${req.body.changedInfo.id}
          SET a += {
            name:"${req.body.changedInfo.name}",
            startDate: datetime("${req.body.changedInfo.startDate}"),
            endDate: datetime("${req.body.changedInfo.endDate}"),
            duration: "${endDate.getTime() - startDate.getTime()}",
            description: "${req.body.changedInfo.description}",
            progress:${req.body.changedInfo.progress},
            type: "${req.body.changedInfo.type}",
            ${timeCompleteString}
          }
          RETURN a
        `
      )
      .then(async (result) => {
        changedTask = {
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
          duration: parseInt(result.records[0]._fields[0].properties.duration),
          positionX: result.records[0]._fields[0].properties.positionX.low,
          positionY: result.records[0]._fields[0].properties.positionY.low,
        };
        for (var x = 0; x < req.body.nodes.length; x++) {
          if (req.body.nodes[x].id == changedTask.id) {
            req.body.nodes[x] = changedTask;
          }
        }
        updateProject.runQueries(queries)

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
}

async function createClone(req, res) {
  db.getSession()
    .run(
      `
      MATCH (b) 
      WHERE ID(b) = ${req.body.id}
      CREATE(a:View {
        inDepArr:[],
        outDepArr:[],
        originalNode: ${req.body.id},
        positionX:0,
        positionY:0
      })-[n:VIEW_OF]->(b)
     `
    )
    .then((result) => {
      res.status(200);
      res.send({ ret: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

async function deleteClone(req, res) {
  console.log(req.body);
  db.getSession()
    .run(
      `
        MATCH (n)
        WHERE ID(n)=${req.body.changedInfo.viewId}
        DETACH DELETE (n)
      `
    )
    .then((result) => {
      res.status(200);
      res.send({ ret: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

async function savePositions(req,res){
  for(let x = 0; x < req.body.changedNodes.length; x++){
    await db
      .getSession()
      .run(
        `
        MATCH (a)
        WHERE ID(a) = ${req.body.changedNodes[x].id}
        SET a += {
          positionX: ${req.body.changedNodes[x].changedX},
          positionY: ${req.body.changedNodes[x].changedY}
        }
      `
      )
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send({ message: err });
      });
  }
  res.status(200);
  res.send({ message: "ok" });
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  createClone,
  deleteClone,
  savePositions
};
