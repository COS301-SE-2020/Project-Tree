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

module.exports = {
  getProjectTasks,
};
