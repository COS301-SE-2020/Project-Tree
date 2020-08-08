const uq = require("../UserManagementApi/userQueries");
const { JWT } = require('jose');

const db = require("../DB");



 async function createProject(req, res) {

  //(async () => console.log(await uq.verify(req.body.creatorID)))()
  let creator = await uq.verify(req.body.creatorID);
  console.log(creator)
  req.body.cp_pm_Create != undefined
    ? (cp_pm_Create = true)
    : (cp_pm_Create = false);
  req.body.cp_pm_Delete != undefined
    ? (cp_pm_Delete = true)
    : (cp_pm_Delete = false);
  req.body.cp_pm_Update != undefined
    ? (cp_pm_Update = true)
    : (cp_pm_Update = false);
  req.body.cp_rp_Create != undefined
    ? (cp_rp_Create = true)
    : (cp_rp_Create = false);
  req.body.cp_rp_Delete != undefined
    ? (cp_rp_Delete = true)
    : (cp_rp_Delete = false);
  req.body.cp_rp_Update != undefined
    ? (cp_rp_Update = true)
    : (cp_rp_Update = false);
  req.body.cp_r_Create != undefined
    ? (cp_r_Create = true)
    : (cp_r_Create = false);
  req.body.cp_r_Delete != undefined
    ? (cp_r_Delete = true)
    : (cp_r_Delete = false);
  req.body.cp_r_Update != undefined
    ? (cp_r_Update = true)
    : (cp_r_Update = false);

  db.getSession()
    .run(
      `
        MATCH (b)
        WHERE ID(b) = ${creator}
        CREATE(n:Project {
            name:"${req.body.cp_Name}", 
            description:"${req.body.cp_Description}", 
            projManCT:true, 
            projManDT:true, 
            projManUT:true, 
            packManCT:${cp_pm_Create}, 
            packManDT:${cp_pm_Delete}, 
            packManUT:${cp_pm_Update}, 
            resPerCT:${cp_rp_Create}, 
            resPerDT:${cp_rp_Delete}, 
            resPerUT:${cp_rp_Update}, 
            resourceCT:${cp_r_Create}, 
            resourceDT:${cp_r_Delete}, 
            resourceUT:${cp_r_Update}
        }),
        (b)-[x:MANAGES]->(n)
        RETURN n
      `
    )
    .then((result) => {
      res.status(200);
      res.send({
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        permissions: [
          result.records[0]._fields[0].properties.packManCT,
          result.records[0]._fields[0].properties.packManDT,
          result.records[0]._fields[0].properties.packManUT,
          result.records[0]._fields[0].properties.resPerCT,
          result.records[0]._fields[0].properties.resPerDT,
          result.records[0]._fields[0].properties.resPerUT,
          result.records[0]._fields[0].properties.resourceCT,
          result.records[0]._fields[0].properties.resourceDT,
          result.records[0]._fields[0].properties.resourceUT,
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
  //)
}

function deleteProject(req, res) {
  db.getSession()
    .run(
      `
        MATCH (n)
        WHERE n.projId=${req.body.dp_id}
        OR ID(n)=${req.body.dp_id}
        DETACH DELETE n
        RETURN n
      `
    )
    .then((result) => {
      res.status(200);
      res.send({ delete: result.records[0]._fields[0].identity.low });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

function updateProject(req, res) {
  req.body.up_pm_Create != undefined
    ? (up_pm_Create = true)
    : (up_pm_Create = false);
  req.body.up_pm_Delete != undefined
    ? (up_pm_Delete = true)
    : (up_pm_Delete = false);
  req.body.up_pm_Update != undefined
    ? (up_pm_Update = true)
    : (up_pm_Update = false);
  req.body.up_rp_Create != undefined
    ? (up_rp_Create = true)
    : (up_rp_Create = false);
  req.body.up_rp_Delete != undefined
    ? (up_rp_Delete = true)
    : (up_rp_Delete = false);
  req.body.up_rp_Update != undefined
    ? (up_rp_Update = true)
    : (up_rp_Update = false);
  req.body.up_r_Create != undefined
    ? (up_r_Create = true)
    : (up_r_Create = false);
  req.body.up_r_Delete != undefined
    ? (up_r_Delete = true)
    : (up_r_Delete = false);
  req.body.up_r_Update != undefined
    ? (up_r_Update = true)
    : (up_r_Update = false);
  db.getSession()
    .run(
      `
        MATCH (a) 
        WHERE ID(a) = ${req.body.up_id}
        SET a += {
            name:"${req.body.up_name}",
            description:"${req.body.up_description}",
            projManCT:true, 
            projManDT:true, 
            projManUT:true, 
            packManCT:${up_pm_Create}, 
            packManDT:${up_pm_Delete}, 
            packManUT:${up_pm_Update}, 
            resPerCT:${up_rp_Create}, 
            resPerDT:${up_rp_Delete}, 
            resPerUT:${up_rp_Update}, 
            resourceCT:${up_r_Create}, 
            resourceDT:${up_r_Delete}, 
            resourceUT:${up_r_Update}
        } 
        RETURN a
      `
    )
    .then((result) => {
      res.status(200);
      res.send({
        id: result.records[0]._fields[0].identity.low,
        name: result.records[0]._fields[0].properties.name,
        description: result.records[0]._fields[0].properties.description,
        permissions: [
          result.records[0]._fields[0].properties.packManCT,
          result.records[0]._fields[0].properties.packManDT,
          result.records[0]._fields[0].properties.packManUT,
          result.records[0]._fields[0].properties.resPerCT,
          result.records[0]._fields[0].properties.resPerDT,
          result.records[0]._fields[0].properties.resPerUT,
          result.records[0]._fields[0].properties.resourceCT,
          result.records[0]._fields[0].properties.resourceDT,
          result.records[0]._fields[0].properties.resourceUT,
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

function getProgress(req, res) {
  db.getSession()
    .run(
      `
        MATCH (a)-[:PART_OF]->(x:Project) 
        RETURN a.projId, x.name, a.progress, a.name, a.duration
      `
    )
    .then((result) => {
      let response = [];
      result.records.forEach((record) => {
        response.push({
          projectId: record._fields[0].low,
          projectName: record._fields[1],
          progress: record._fields[2],
          taskName: record._fields[3],
          duration: record._fields[4].low,
        });
      });
      res.status(200);
      res.send({ response: response });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function getProjects(req, res) {
  let creator = await uq.verify(req.body.creatorID);
  if(creator != null)  {
    await db.getSession()
    .run(
      `
        MATCH (user)-[:MANAGES]->(project) 
        WHERE ID(user) = ${creator}
        return project
      `
    )
    .then(result => {
      let taskArr = [];
      result.records.forEach((record) => {
        taskArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          description: record._fields[0].properties.description,
          permissions: [
            record._fields[0].properties.packManCT,
            record._fields[0].properties.packManDT,
            record._fields[0].properties.packManUT,
            record._fields[0].properties.resPerCT,
            record._fields[0].properties.resPerDT,
            record._fields[0].properties.resPerUT,
            record._fields[0].properties.resourceCT,
            record._fields[0].properties.resourceDT,
            record._fields[0].properties.resourceUT,
          ],
        });
      });
      res.status(200);
      res.send({ projects: taskArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
  }
  else if(typeof creator == 'undefined')
  {
    res.send(
      {
        message: "Undefined"
      })
  }
  else
  {
    res.send(
    {
      message: "Invalid User"
    }
   )
  }
}

function getProjectTasks(req, res) {
  db.getSession()
    .run(
      `
        MATCH (a)-[:PART_OF]->(x:Project) 
        WHERE ID(x) = ${req.body.projId}
        RETURN a
        ORDER BY a.startDate
      `
    )
    .then(result => {
      let response = [];
      result.records.forEach((record) => {
        response.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          description: record._fields[0].properties.description,
          startDate: record._fields[0].properties.startDate,
          progress: record._fields[0].properties.progress,
          endDate: record._fields[0].properties.endDate,
          duration: record._fields[0].properties.duration.low,
        });
      });
      res.status(200);
      res.send({ tasks: response });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

function getCriticalPath(req, res){
	db.getSession()
  .run
  (`
    MATCH (a:Task {projId: ${req.body.projId}})-[:DEPENDENCY *..]->(b:Task {projId: ${req.body.projId}})
    WITH MAX(duration.inDays(a.startDate, b.endDate)) as dur
    MATCH p = (c:Task {projId: ${req.body.projId}})-[:DEPENDENCY *..]->(d:Task {projId: ${req.body.projId}})
    WHERE duration.inDays(c.startDate, d.endDate) = dur
    RETURN p
  `)
  .then(result => {
      res.status(200);
      if(result.records[0] != null) res.send({path: result.records[0]._fields[0]});
      else res.send({path: null});
  })
  .catch(err => {
      console.log(err);
      res.status(400);
      res.send(err);
  });
};

module.exports = {
  createProject,
  deleteProject,
  updateProject,
  getProjects,
  getProgress,
  getProjectTasks,
  getCriticalPath
};
