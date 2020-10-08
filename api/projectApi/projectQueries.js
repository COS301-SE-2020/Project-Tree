const uq = require("../userManagementApi/userQueries");
const db = require("../DB");
const {
  checkPermissionInternal,
  verify,
} = require("../userManagementApi/userQueries");

const up = require("./updateProject");
const uuid = require('uuid');

async function createProject(req, res) {
  let userId = await uq.verify(req.body.token);
  if (userId != null) {
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

    let startDate = `${req.body.cp_StartDate}T${req.body.cp_StartTime}`;
    let endDate = `${req.body.cp_EndDate}T${req.body.cp_EndTime}`;

    db.getSession()
      .run(
        `
          MATCH (b)
          WHERE ID(b) = ${userId}
          CREATE(n:Project {
              name:"${req.body.cp_Name}", 
              description:"${req.body.cp_Description}", 
              startDate: datetime("${startDate}"),
              endDate: datetime("${endDate}"),
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
              resourceUT:${cp_r_Update},
              accessCode:"${uuid.v4().substring(9, 23)}"
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
          accessCode: result.records[0]._fields[0].properties.accessCode,
          startDate: up.datetimeToString(
            result.records[0]._fields[0].properties.startDate
          ),
          endDate: up.datetimeToString(
            result.records[0]._fields[0].properties.endDate
          ),
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
        res.send({ message: err });
      });
  } else {
    res.status(400);
    res.send({ message: "Invalid user" });
  }
}

async function deleteProject(req, res) {
  body = JSON.parse(req.body.data);
  let userId = await verify(body.token);
  if (userId != null) {
    let permissions = await checkPermissionInternal(body.token, body.project);
    if (permissions.project != false) {
      db.getSession()
        .run(
          `
            MATCH (n)
            WHERE ID(n)=${body.project.id} OR n.projId = ${body.project.id} OR n.projID = ${body.project.id}
            DETACH DELETE n
          `
        )
        .then((result) => {
          res.status(200);
          res.send({ delete: body.project.id });
        })
        .catch((err) => {
          console.log(err);
          res.status(400);
          res.send({ message: err });
        });
    } else {
      res.status(400);
      res.send({ message: "incorrect permission to delete project" });
    }
  } else {
    res.status(400);
    res.send({ message: "Invalid user" });
  }
}

async function updateProject(req, res) {
  let userId = await uq.verify(req.body.token);
  if (userId != null) {
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
      
    let startDate = `${req.body.up_StartDate}T${req.body.up_StartTime}`;
    let endDate = `${req.body.up_EndDate}T${req.body.up_EndTime}`;

    db.getSession()
      .run(
        `
          MATCH (a) 
          WHERE ID(a) = ${req.body.up_id}
          SET a += {
              name:"${req.body.up_name}",
              description:"${req.body.up_description}",
              startDate: datetime("${startDate}"),
              endDate: datetime("${endDate}"),
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
          accessCode: result.records[0]._fields[0].properties.accessCode,
          startDate: up.datetimeToString(
            result.records[0]._fields[0].properties.startDate
          ),
          endDate: up.datetimeToString(
            result.records[0]._fields[0].properties.endDate
          ),
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
        res.send({ message: err });
      });
  } else {
    res.status(400);
    res.send({ message: "Invalid user" });
  }
}

async function getProjects(req, res) {
  let userId = await uq.verify(req.body.token);
  if (userId != null) {
    let ownedProjects = [];
    let otherProjects = [];
    await db
      .getSession()
      .run(
        `
          MATCH (user)-[:MANAGES]->(project) 
          WHERE ID(user) = ${userId}
          return project
        `
      )
      .then((result) => {
        result.records.forEach((record) => {
          ownedProjects.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name,
            description: record._fields[0].properties.description,
            accessCode: record._fields[0].properties.accessCode,
            startDate: up.datetimeToString(
              record._fields[0].properties.startDate
            ),
            endDate: up.datetimeToString(
              record._fields[0].properties.endDate
            ),
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
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send({ message: err });
      });
    await db
      .getSession()
      .run(
        `
          MATCH (user:User)-[r:MEMBER]->(j) 
          WHERE ID(user) = ${userId}
          return DISTINCT j
        `
      )
      .then((result) => {
        result.records.forEach((record) => {
          otherProjects.push({
            id: record._fields[0].identity.low,
            name: record._fields[0].properties.name,
            description: record._fields[0].properties.description,
            accessCode: record._fields[0].properties.accessCode,
            startDate: up.datetimeToString(
              record._fields[0].properties.startDate
            ),
            endDate: up.datetimeToString(
              record._fields[0].properties.endDate
            ),
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
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send({ message: err });
      });
    res.status(200);
    let data = filterProjects(ownedProjects, otherProjects);
    res.send(data);
  } else if (typeof userId == "undefined") {
    res.status(400);
    res.send({
      message: "Undefined",
    });
  } else {
    res.status(400);
    res.send({
      message: "Invalid User",
    });
  }
}

function filterProjects(ownedProjects, otherProjects) {
  for (var x = 0; x < ownedProjects.length; x++) {
    otherProjects = otherProjects.filter(
      (item) => item.id !== ownedProjects[x].id
    );
  }

  return { ownedProjects, otherProjects };
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
    .then((result) => {
      let response = [];
      result.records.forEach((record) => {
        response.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          description: record._fields[0].properties.description,
          type: record._fields[0].properties.type,
          progress: record._fields[0].properties.progress.low,
          startDate: up.datetimeToString(
            record._fields[0].properties.startDate
          ),
          endDate: up.datetimeToString(record._fields[0].properties.endDate),
          duration: parseInt(record._fields[0].properties.duration),
        });
      });
      res.status(200);
      res.send({ tasks: response });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function getCriticalPath(req, res) {
  db.getSession()
    .run(
      `
        MATCH (a:Task {projId: ${req.body.projId}})-[:DEPENDENCY *..]->(b:Task {projId: ${req.body.projId}})
        WITH MAX(duration.between(a.startDate, b.endDate)) as dur
        MATCH p = (c:Task {projId: ${req.body.projId}})-[:DEPENDENCY *..]->(d:Task {projId: ${req.body.projId}})
        WHERE duration.between(c.startDate, d.endDate) = dur
        RETURN p
      `
    )
    .then((result) => {
      res.status(200);
      if (result.records[0] != null)
        res.send({ path: result.records[0]._fields[0] });
      else res.send({ path: null });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function joinProject(req, res) {
  db.getSession()
    .run(
      `
      MATCH (n:Project) WHERE n.accessCode = "${req.body.accessCode}" RETURN id(n)
      `
    )
    .then((result) => {
      if (result.records[0] != null){
        let project = result.records[0]._fields[0].low;
        db.getSession()
          .run(
            `
            MATCH (a:User), (b:Project)
            WHERE (a)-[]->(b) AND id(a)=${req.body.userId} AND id(b)=${project}
            RETURN (b)
            `
          )
          .then((result) => {
            if (result.records[0] == null){
              db.getSession()
                .run(
                  `
                    MATCH (a:User), (b:Project)
                    WHERE id(a)=${req.body.userId} AND id(b)=${project}
                    CREATE (a)-[:PENDING_MEMBER]->(b)        
                  `
                )
                .then((result) => {
                  res.status(200);
                  res.send({ response:"okay" });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(400);
                  res.send({ message: err });
                });
            }

            else res.send({ response: "You are already a member of this project or are pending approval" });
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.send({ message: err });
          });

      }

      else res.send({ response: "The access code you have provided doesn't exist" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}



function getAllInfo(req, res) {}

module.exports = {
  createProject,
  deleteProject,
  updateProject,
  getProjects,
  getProjectTasks,
  getCriticalPath,
  joinProject
};
