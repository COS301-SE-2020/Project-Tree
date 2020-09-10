const db = require("../DB");
const updateProject = require("./updateProject");

function createDependency(req, res) {
  db.getSession()
    .run(
      `
        MATCH (a),(b)
        WHERE ID(a) = ${req.body.changedInfo.cd_fid} AND ID(b) = ${req.body.changedInfo.cd_sid}
        CREATE (a)-[n:DEPENDENCY{
          projId:${req.body.changedInfo.cd_pid},
          relationshipType:'${req.body.changedInfo.cd_relationshipType}',
          duration:${req.body.changedInfo.cd_duration}
        }]->(b)
        RETURN n
      `
    )
    .then(async (result) => {
      let rel = {
        id: result.records[0]._fields[0].identity.low,
        duration: result.records[0]._fields[0].properties.duration.low,
        relationshipType:
          result.records[0]._fields[0].properties.relationshipType,
        source: result.records[0]._fields[0].start.low,
        target: result.records[0]._fields[0].end.low,
      };
      let changedRel = rel;
      let queriesArray = [];
      req.body.rels.push(changedRel);

      if(req.body.changedInfo.cd_viewId_source.length !== 0){
        if(req.body.changedInfo.cd_viewId_target.length !== 0){
          db.getSession()
          .run(
            `
              MATCH (a)
              WHERE ID(a) = ${req.body.changedInfo.cd_viewId_source}
              SET a.outDepArr=coalesce(a.outDepArr, []) + ${changedRel.id}
              WITH 1 as dummy
              MATCH (b)
              WHERE ID(b) = ${req.body.changedInfo.cd_viewId_target}
              SET b.inDepArr=coalesce(b.inDepArr, []) + ${changedRel.id}
            `
          )
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.send({ message: err });
          });
        }
        else{
          db.getSession()
          .run(
            `
              MATCH (a)
              WHERE ID(a) = ${req.body.changedInfo.cd_viewId_source}
              SET a.outDepArr=coalesce(a.outDepArr, []) + ${changedRel.id}
            `
          )
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.send({ message: err });
          });
        }
      }
      else if(req.body.changedInfo.cd_viewId_target.length !== 0){
        db.getSession()
        .run(
          `
            MATCH (a)
            WHERE ID(a) = ${req.body.changedInfo.cd_viewId_target}
            SET a.inDepArr=coalesce(a.inDepArr, []) + ${changedRel.id}
          `
        )
        .catch((err) => {
          console.log(err);
          res.status(400);
          res.send({ message: err });
        });
      }

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

      let queriesArray = [];

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
