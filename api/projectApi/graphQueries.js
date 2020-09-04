const db = require("../DB");

function getProjectTasks(req, res) {
  db.getSession()
    .run(
      `
        MATCH (n:Task {
          projId: ${req.body.id}
        }) 
        RETURN n
      `
    )
    .then((result) => {
      let taskArr = [];
      result.records.forEach((record) => {
        taskArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          description: record._fields[0].properties.description,
          startDate: record._fields[0].properties.startDate,
          endDate: record._fields[0].properties.endDate,
          duration: record._fields[0].properties.duration.low,
          type: record._fields[0].properties.type,
          progress: record._fields[0].properties.progress.low,
        });
      });
      db.getSession()
        .run(
          `
            MATCH (n:Task)-[r:DEPENDENCY {
              projId: ${req.body.id}
            }]->(m:Task) 
            RETURN r
          `
        )
        .then((result) => {
          let relArr = [];
          result.records.forEach((record) => {
            relArr.push({
              id: record._fields[0].identity.low,
              duration: record._fields[0].properties.duration.low,
              relationshipType: record._fields[0].properties.relationshipType,
              source: record._fields[0].start.low,
              target: record._fields[0].end.low,
            });
          });
          res.send({ tasks: taskArr, rels: relArr });
        })
        .catch((err) => {
          console.log(err);
          res.status(400);
          res.send({ message: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function getProjectViews(req, res) {
  db.getSession()
    .run(
      `
      MATCH (n:View)-[:VIEW_OF]->(:Task)-[:PART_OF]->(j) WHERE ID(j)=${req.body.id} RETURN n
      `
    )
    .then((result) => {
      let viewsArr = [];
      result.records.forEach((record) => {
        viewsArr.push({
          id: record._fields[0].identity.low,
          dependencyArr: record._fields[0].properties.dependencyArr,
          originalNode: record._fields[0].properties.originalNode.low
        });
      });
      res.send({ views: viewsArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

module.exports = {
  getProjectTasks,
  getProjectViews,
};
