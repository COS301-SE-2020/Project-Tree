const db = require("../DB");
const updateProject = require("./updateProject");

async function createDependency(req, res) {
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  let changedRel = {
    id: "tempID",
    sStartDate: req.body.changedInfo.sStartDate,
    sEndDate: req.body.changedInfo.sEndDate,
    startDate: req.body.changedInfo.startDate,
    endDate: req.body.changedInfo.endDate,
    duration: endDate.getTime() - startDate.getTime(),
    relationshipType: req.body.changedInfo.relationshipType,
    source: req.body.changedInfo.fid,
    target: req.body.changedInfo.sid,
  };

  req.body.rels.push(changedRel);

  let queries = [];
  await updateProject.updateCurDependency(
    changedRel,
    req.body.nodes,
    req.body.rels,
    queries
  );

  if ((await updateProject.CheckEndDate(queries, req.body.project)) == false) {
    res.status(400);
    res.send({ message: "After Project End Date" });
    return;
  } else {
    db.getSession()
      .run(
        `
          MATCH (a),(b)
          WHERE ID(a) = ${req.body.changedInfo.fid} AND ID(b) = ${
          req.body.changedInfo.sid
        }
          CREATE (a)-[n:DEPENDENCY{
            projId:${req.body.project.id},
            relationshipType:'${req.body.changedInfo.relationshipType}',
            sStartDate: datetime("${req.body.changedInfo.sStartDate}"),
            sEndDate: datetime("${req.body.changedInfo.sEndDate}"),
            startDate: datetime("${req.body.changedInfo.startDate}"),
            endDate: datetime("${req.body.changedInfo.endDate}"),
            duration: "${endDate.getTime() - startDate.getTime()}"
          }]->(b)
          RETURN n
        `
      )
      .then(async (result) => {
        let changedRel = {
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
          duration: parseInt(result.records[0]._fields[0].properties.duration),
          relationshipType:
            result.records[0]._fields[0].properties.relationshipType,
          source: result.records[0]._fields[0].start.low,
          target: result.records[0]._fields[0].end.low,
        };

        for (var x = 0; x < req.body.rels.length; x++) {
          if (req.body.rels[x].id == "tempID") {
            req.body.rels[x] = changedRel;
          }
        }

        if (req.body.changedInfo.cd_viewId_source !== null) {
          if (req.body.changedInfo.cd_viewId_target !== null) {
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
          } else {
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
        } else if (req.body.changedInfo.cd_viewId_target !== null) {
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
        updateProject.runQueries(queries);

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
}

async function updateDependency(req, res) {
  //update a Dependency between 2 nodes with specified fields
  let startDate = new Date(req.body.changedInfo.startDate);
  let endDate = new Date(req.body.changedInfo.endDate);
  let changedRel = {
    id: req.body.changedInfo.id,
    sStartDate: req.body.changedInfo.sStartDate,
    sEndDate: req.body.changedInfo.sEndDate,
    startDate: req.body.changedInfo.startDate,
    endDate: req.body.changedInfo.endDate,
    duration: endDate.getTime() - startDate.getTime(),
    relationshipType: req.body.changedInfo.relationshipType,
    source: req.body.changedInfo.source,
    target: req.body.changedInfo.target,
  };

  for (let x = 0; x < req.body.rels.length; x++) {
    if (req.body.rels[x].id == changedRel.id) {
      req.body.rels[x] = changedRel;
    }
  }
  let queries = [];
  await updateProject.updateCurDependency(
    changedRel,
    req.body.nodes,
    req.body.rels,
    queries
  );
  if ((await updateProject.CheckEndDate(queries, req.body.project)) == false) {
    res.status(400);
    res.send({ message: "After Project End Date" });
    return;
  } else {
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
            duration: "${endDate.getTime() - startDate.getTime()}"
          }
          RETURN r
        `
      )
      .then(async (result) => {
        let changedRel = {
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
          duration: parseInt(result.records[0]._fields[0].properties.duration),
          relationshipType:
            result.records[0]._fields[0].properties.relationshipType,
          source: result.records[0]._fields[0].start.low,
          target: result.records[0]._fields[0].end.low,
        };

        for (let x = 0; x < req.body.rels.length; x++) {
          if (req.body.rels[x].id == changedRel.id) {
            req.body.rels[x] = changedRel;
          }
        }
        updateProject.runQueries(queries);

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
}

function deleteDependency(req, res) {
  if (
    req.body.changedInfo.sourceView.length !== 0 &&
    req.body.changedInfo.targetView.length === 0
  ) {
    db.getSession()
      .run(
        `
        MATCH (c:View)-[:VIEW_OF]->(a:Task)-[r:DEPENDENCY]->(b:Task)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        SET c.outDepArr=FILTER(x IN c.outDepArr WHERE x <> ${req.body.changedInfo.dd_did})
        DELETE r
        RETURN *
		  `
      )
      .then(async () => {
        let rel = {};

        req.body.rels = req.body.rels.filter((el) => {
          if (el.id == req.body.changedInfo.dd_did) {
            rel = el;
            return false;
          } else {
            return true;
          }
        });

        let target;
        req.body.nodes.forEach((node) => {
          if (node.id == rel.target) target = node;
        });

        let queries = [];
        await updateProject.updateTask(
          target,
          req.body.nodes,
          req.body.rels,
          queries
        );
        updateProject.runQueries(queries);

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
  } else if (
    req.body.changedInfo.sourceView.length === 0 &&
    req.body.changedInfo.targetView.length !== 0
  ) {
    db.getSession()
      .run(
        `
        MATCH (a:Task)-[r:DEPENDENCY]->(b:Task)<-[:VIEW_OF]-(c:View)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        SET c.inDepArr=FILTER(x IN c.inDepArr WHERE x <> ${req.body.changedInfo.dd_did})
        DELETE r
        RETURN *
		  `
      )
      .then(async () => {
        let rel = {};

        req.body.rels = req.body.rels.filter((el) => {
          if (el.id == req.body.changedInfo.dd_did) {
            rel = el;
            return false;
          } else {
            return true;
          }
        });

        let target;
        req.body.nodes.forEach((node) => {
          if (node.id == rel.target) target = node;
        });

        let queries = [];
        await updateProject.updateTask(
          target,
          req.body.nodes,
          req.body.rels,
          queries
        );
        updateProject.runQueries(queries);

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
  } else if (
    req.body.changedInfo.sourceView.length !== 0 &&
    req.body.changedInfo.targetView.length !== 0
  ) {
    db.getSession()
      .run(
        `
        MATCH (c:View)-[:VIEW_OF]->(a:Task)-[r:DEPENDENCY]->(b:Task)<-[:VIEW_OF]-(d:View)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        SET c.outDepArr=FILTER(x IN c.outDepArr WHERE x <> ${req.body.changedInfo.dd_did})
        WITH 1 as dummy
        MATCH (c:View)-[:VIEW_OF]->(a:Task)-[r:DEPENDENCY]->(b:Task)<-[:VIEW_OF]-(d:View)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        SET d.inDepArr=FILTER(x IN d.inDepArr WHERE x <> ${req.body.changedInfo.dd_did})
        WITH 1 as dummy
        MATCH (c:View)-[:VIEW_OF]->(a:Task)-[r:DEPENDENCY]->(b:Task)<-[:VIEW_OF]-(d:View)
        WHERE ID(r)=${req.body.changedInfo.dd_did}
        DELETE r
        RETURN *
		  `
      )
      .then(async () => {
        let rel = {};

        req.body.rels = req.body.rels.filter((el) => {
          if (el.id == req.body.changedInfo.dd_did) {
            rel = el;
            return false;
          } else {
            return true;
          }
        });

        let target;
        req.body.nodes.forEach((node) => {
          if (node.id == rel.target) target = node;
        });

        let queries = [];
        await updateProject.updateTask(
          target,
          req.body.nodes,
          req.body.rels,
          queries
        );
        updateProject.runQueries(queries);

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
  } else if (
    req.body.changedInfo.sourceView.length === 0 &&
    req.body.changedInfo.targetView.length === 0
  ) {
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

        req.body.rels = req.body.rels.filter((el) => {
          if (el.id == req.body.changedInfo.dd_did) {
            rel = el;
            return false;
          } else {
            return true;
          }
        });

        let target;
        req.body.nodes.forEach((node) => {
          if (node.id == rel.target) target = node;
        });

        let queries = [];
        await updateProject.updateTask(
          target,
          req.body.nodes,
          req.body.rels,
          queries
        );
        updateProject.runQueries(queries);

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
}

module.exports = {
  updateDependency,
  deleteDependency,
  createDependency,
};
