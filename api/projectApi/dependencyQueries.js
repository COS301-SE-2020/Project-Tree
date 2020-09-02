const db = require("../DB");
const updateProject = require("./updateProject");

function createDependency(req, res) {
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
          endDate: datetime("${req.body.changedInfo.endDate}")
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
        relationshipType:
          result.records[0]._fields[0].properties.relationshipType,
        source: result.records[0]._fields[0].start.low,
        target: result.records[0]._fields[0].end.low,
      };
      let changedRel = rel;
      let queriesArray = [];
      req.body.rels.push(changedRel);

      await updateProject.updateProject(
        changedRel.target,
        req.body.nodes,
        req.body.rels,
        queriesArray
      );
      res.status(200);
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: changedRel.id,
      });
      updateProject.excecuteQueries(queriesArray);
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function updateDependency(req, res) {
  //update a Dependency between 2 nodes with specified fields
  db.getSession()
    .run(
      `
        MATCH (a)-[r]->(b) 
        WHERE ID(r) = ${req.body.changedInfo.ud_did}
        SET r += { 
          duration:${req.body.changedInfo.ud_duration}, 
          relationshipType: "${req.body.changedInfo.ud_relationshipType}" 
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

      let queriesArray = [];

      /* await updateProject.updateProject(
        changedRel.target,
        req.body.nodes,
        req.body.rels,
        queriesArray
      ); */
      res.status(200);
      res.send({
        nodes: req.body.nodes,
        rels: req.body.rels,
        displayNode: null,
        displayRel: changedRel.id,
      });
      //updateProject.excecuteQueries(queriesArray);
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
        RETURN *
		  `
    )
    .then(async () => {
      let queriesArray = [];
      let = {};

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

      await updateProject.updateProject(
        rel.target,
        req.body.nodes,
        req.body.rels,
        queriesArray
      );
      res.status(200);
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

module.exports = {
  updateDependency,
  deleteDependency,
  createDependency,
};
