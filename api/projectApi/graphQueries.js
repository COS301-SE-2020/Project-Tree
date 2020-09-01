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
        let startDate = record._fields[0].properties.startDate;
        let smonth = startDate.month.low < 10 ? `0${startDate.month.low}` : startDate.month.low ;
        let sday = startDate.day.low < 10 ? `0${startDate.day.low}` : startDate.day.low ;
        let shour = startDate.hour.low < 10 ? `0${startDate.hour.low}` : startDate.hour.low ;
        let smin = startDate.minute.low < 10 ? `0${startDate.minute.low}` : startDate.minute.low ;
        let endDate = record._fields[0].properties.endDate;
        let emonth = endDate.month.low < 10 ? `0${endDate.month.low}` : endDate.month.low ;
        let eday = endDate.day.low < 10 ? `0${endDate.day.low}` : endDate.day.low ;
        let ehour = endDate.hour.low < 10 ? `0${endDate.hour.low}` : endDate.hour.low ;
        let emin = endDate.minute.low < 10 ? `0${endDate.minute.low}` : endDate.minute.low ;
        taskArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          description: record._fields[0].properties.description,
          startDate: `${startDate.year.low}-${smonth}-${sday}T${shour}:${smin}`,
          type: record._fields[0].properties.type,
          progress: record._fields[0].properties.progress.low,
          endDate: `${endDate.year.low}-${emonth}-${eday}T${ehour}:${emin}`,
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
