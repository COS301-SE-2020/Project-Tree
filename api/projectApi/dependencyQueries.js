const db = require("../DB");
const updateProject = require("./updateProject");

function createDependency(req, res) {
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  db.getSession()
    .run(
      `
        MATCH (a),(b)
        WHERE ID(a) = ${req.body.changedInfo.fid} AND ID(b) = ${req.body.changedInfo.sid}
        CREATE (a)-[n:DEPENDENCY{
          projId:${req.body.changedInfo.projId},
          relationshipType:'${req.body.changedInfo.relationshipType}',
          sStartDate: datetime("${req.body.changedInfo.sStartDate}"),
          sEndDate: datetime("${req.body.changedInfo.sEndDate}"),
          startDate: datetime("${req.body.changedInfo.startDate}"),
          endDate: datetime("${req.body.changedInfo.endDate}"),
          duration: ${endDate.getTime() - startDate.getTime()}
        }]->(b)
        RETURN n
      `
    )
    .then(async (result) => {
      let rel = {
        id: result.records[0]._fields[0].identity.low,
        sStartDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.sStartDate
        ),
        sEndDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.sEndDate
        ),
        startDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.startDate
        ),
        endDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.endDate
        ),
        duration: result.records[0]._fields[0].properties.duration.low,
        relationshipType:
          result.records[0]._fields[0].properties.relationshipType,
        source: result.records[0]._fields[0].start.low,
        target: result.records[0]._fields[0].end.low,
      };
      let changedRel = rel;
      req.body.rels.push(changedRel);

      await updateProject.updateCurDependency(
        changedRel,
        req.body.nodes,
        req.body.rels
      );
      res.status(200);
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: changedRel.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function updateDependency(req, res) { //update a Dependency between 2 nodes with specified fields
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  db.getSession()
    .run(
      `
        MATCH (a)-[r:DEPENDENCY]->(b) 
        WHERE ID(r) = ${req.body.changedInfo.id}
        SET r += {
          relationshipType: "${req.body.changedInfo.relationshipType}",
          sStartDate: datetime("${req.body.changedInfo.sStartDate}"),
          sEndDate: datetime("${req.body.changedInfo.sEndDate}"),
          startDate: datetime("${req.body.changedInfo.startDate}"),
          endDate: datetime("${req.body.changedInfo.endDate}"),
          duration: ${endDate.getTime() - startDate.getTime()}
        }
        RETURN r
      `
    )
    .then(async (result) => {
      let rel = {
        id: result.records[0]._fields[0].identity.low,
        sStartDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.sStartDate
        ),
        sEndDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.sEndDate
        ),
        startDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.startDate
        ),
        endDate: updateProject.datetimeToString(
          result.records[0]._fields[0].properties.endDate
        ),
        duration: result.records[0]._fields[0].properties.duration.low,
        relationshipType:
          result.records[0]._fields[0].properties.relationshipType,
        source: result.records[0]._fields[0].start.low,
        target: result.records[0]._fields[0].end.low,
      };

      let changedRel = rel;
      for (let x = 0; x < req.body.rels.length; x++) {
        if (req.body.rels[x].id == changedRel.id) {
          req.body.rels[x] = changedRel;
        }
      }
      await updateProject.updateCurDependency(
        changedRel,
        req.body.nodes,
        req.body.rels
      );
      res.status(200);
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: changedRel.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function deleteDependency(req, res) {
  db.getSession()
    .run(
      `
        MATCH (a:Task)-[r:DEPENDENCY]->(b:Task)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        DELETE r
		  `
    )
    .then(async () => {
      let rel = {};

      for (let x = 0; x < req.body.rels.length; x++) {
        if (req.body.rels[x].id == req.body.changedInfo.dd_did) {
          rel = req.body.rels[x];

          if (x == 0) {
            req.body.rels.shift();
          } else {
            req.body.rels.splice(x, x);
          }
        }
      }
      
      let target;
      req.body.nodes.forEach( node => {
        if (node.id == rel.target) target = node;
      });

      await updateProject.updateTask(
        target,
        req.body.nodes,
        req.body.rels
      );
      res.status(200);
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

module.exports = {
  updateDependency,
  deleteDependency,
  createDependency,
};
