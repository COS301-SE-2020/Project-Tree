const db = require("../DB");
const { isEmpty } = require("lodash");
const sendProjectNotification = require("../notificationApi/notificationHandler");

function assignPeople(req, res) {
  let taskId = req.body.ct_taskId;
  let packageManagers = req.body.ct_pacMans;
  let responsiblePersons = req.body.ct_resPersons;
  let resources = req.body.ct_resources;

  if (isEmpty(packageManagers) !== true) {
    let pacManAddStatus = addPackageManager(taskId, packageManagers);
    if (pacManAddStatus === 400) res.sendStatus(400);
  }
  if (isEmpty(responsiblePersons) !== true) {
    let resPersonAddStatus = addResponsiblePerson(taskId, responsiblePersons);
    if (resPersonAddStatus === 400) res.sendStatus(400);
  }
  if (isEmpty(resources) !== true) {
    let resourcesAddStatus = addResources(taskId, resources);
    if (resourcesAddStatus === 400) res.sendStatus(400);
  }

  let data = sendProjectNotification.formatAutoAssignData(
    packageManagers,
    responsiblePersons,
    resources,
    req.body.auto_notification
  );

  if (data.packMan.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.packMan });
  if (data.resPer.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.resPer });
  if (data.res.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.res });

  res.sendStatus(200);
}

async function addPackageManager(taskId, persons) {
  var session = db.getSession();

  let query = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
  for (let x = 1; x < persons.length; x++) {
    query += `OR ID(a) = ${persons[x].id} `;
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:PACKAGE_MANAGER]->(b)`;

  await session
    .run(query)
    .then((result) => {
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

async function addResponsiblePerson(taskId, persons) {
  var session = db.getSession();

  let query = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
  for (let x = 1; x < persons.length; x++) {
    query += `OR ID(a) = ${persons[x].id} `;
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:RESPONSIBLE_PERSON]->(b)`;

  await session
    .run(query)
    .then((result) => {
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

async function addResources(taskId, persons) {
  var session = db.getSession();

  let query = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
  for (let x = 1; x < persons.length; x++) {
    query += `OR ID(a) = ${persons[x].id} `;
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:RESOURCE]->(b)`;

  await session
    .run(query)
    .then((result) => {
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

function updateAssignedPeople(req, res) {
  let taskId = req.body.ut_taskId;
  let packageManagers = req.body.ut_pacMans;
  let originalPackageManagers = req.body.ut_originalPacMans;
  let originalResponsiblePersons = req.body.ut_originalResPersons;
  let originalResources = req.body.ut_originalResources;
  let notificationOrigPacMan = [...originalPackageManagers];
  let notificationOrigResPer = [...originalResponsiblePersons];
  let notificationOrigRes = [...originalResources];
  let responsiblePersons = req.body.ut_resPersons;
  let resources = req.body.ut_resources;

  if (!isEmpty(packageManagers) || !isEmpty(originalPackageManagers)) {
    let pacManAddStatus = updatePackageManager(
      taskId,
      packageManagers,
      originalPackageManagers
    );
    if (pacManAddStatus === 400) res.sendStatus(400);
  }

  if (!isEmpty(responsiblePersons) || !isEmpty(originalResponsiblePersons)) {
    let resPersonAddStatus = updateResponsiblePerson(
      taskId,
      responsiblePersons,
      originalResponsiblePersons
    );
    if (resPersonAddStatus === 400) res.sendStatus(400);
  }

  if (!isEmpty(resources) || !isEmpty(originalResources)) {
    let resourcesAddStatus = updateResources(
      taskId,
      resources,
      originalResources
    );
    if (resourcesAddStatus === 400) res.sendStatus(400);
  }

  if (
    req.body.auto_notification.timeComplete !== undefined &&
    req.body.auto_notification.timeComplete !== null
  ) {
    let data2 = sendProjectNotification.formatAutoCompleteData(
      [...packageManagers],
      [...responsiblePersons],
      [...resources],
      req.body.auto_notification
    );

    if (data2.recipients.length !== 0)
      sendProjectNotification.sendNotification({ body: data2 });
  }

  for (var x = 0; x < notificationOrigPacMan.length; x++) {
    packageManagers = packageManagers.filter(
      (el) => el.id !== notificationOrigPacMan[x].id
    );
  }

  for (var x = 0; x < notificationOrigResPer.length; x++) {
    responsiblePersons = responsiblePersons.filter(
      (el) => el.id !== notificationOrigResPer[x].id
    );
  }

  for (var x = 0; x < notificationOrigRes.length; x++) {
    resources = resources.filter((el) => el.id !== notificationOrigRes[x].id);
  }

  let data = sendProjectNotification.formatAutoAssignData(
    packageManagers,
    responsiblePersons,
    resources,
    req.body.auto_notification
  );

  if (data.packMan.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.packMan });
  if (data.resPer.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.resPer });
  if (data.res.recipients.length !== 0)
    sendProjectNotification.sendNotification({ body: data.res });

  res.sendStatus(200);
}

async function updatePackageManager(taskId, persons, originalPackageManagers) {
  var session = db.getSession();

  if (isEmpty(persons) && !isEmpty(originalPackageManagers)) {
    let deletingQuery = `MATCH (a:User) WHERE ID(a) = ${originalPackageManagers[0].id} `;
    for (let x = 1; x < originalPackageManagers.length; x++) {
      deletingQuery += `OR ID(a) = ${originalPackageManagers[x].id} `;
    }
    deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:PACKAGE_MANAGER]->(b) DELETE r`;

    await session
      .run(deletingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else if (!isEmpty(persons) && isEmpty(originalPackageManagers)) {
    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:PACKAGE_MANAGER]->(b)`;

    await session
      .run(addingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else {
    let peopleToRemove = originalPackageManagers;
    for (let x = 0; x < peopleToRemove.length; x++) {
      for (let y = 0; y < persons.length; y++) {
        if (peopleToRemove[x] !== undefined && persons[y] !== undefined) {
          if (peopleToRemove[x].id === persons[y].id) {
            if (x === 0) peopleToRemove.shift();
            else if (x === peopleToRemove.length - 1) peopleToRemove.pop();
            else peopleToRemove.splice(x, 1);
          }
        }
      }
    }

    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:PACKAGE_MANAGER]->(b)`;

    let deletingQuery = ``;
    if (!isEmpty(peopleToRemove)) {
      deletingQuery = `MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `;
      for (let x = 1; x < peopleToRemove.length; x++) {
        deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `;
      }
      deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:PACKAGE_MANAGER]->(b) DELETE r`;
    }

    await session
      .run(addingQuery)
      .then(async (result) => {
        if (!isEmpty(deletingQuery)) {
          await db
            .getSession()
            .run(deletingQuery)
            .then((result) => {
              return 200;
            })
            .catch((err) => {
              console.log(err);
              return 400;
            });
        }
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  }
}

async function updateResponsiblePerson(
  taskId,
  persons,
  originalResponsiblePersons
) {
  var session = db.getSession();

  if (isEmpty(persons) && !isEmpty(originalResponsiblePersons)) {
    let deletingQuery = `MATCH (a:User) WHERE ID(a) = ${originalResponsiblePersons[0].id} `;
    for (let x = 1; x < originalResponsiblePersons.length; x++) {
      deletingQuery += `OR ID(a) = ${originalResponsiblePersons[x].id} `;
    }
    deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESPONSIBLE_PERSON]->(b) DELETE r`;

    await session
      .run(deletingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else if (!isEmpty(persons) && isEmpty(originalResponsiblePersons)) {
    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESPONSIBLE_PERSON]->(b)`;

    await session
      .run(addingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else {
    let peopleToRemove = originalResponsiblePersons;
    for (let x = 0; x < peopleToRemove.length; x++) {
      for (let y = 0; y < persons.length; y++) {
        if (peopleToRemove[x] !== undefined && persons[y] !== undefined) {
          if (peopleToRemove[x].id === persons[y].id) {
            if (x === 0) peopleToRemove.shift();
            else if (x === peopleToRemove.length - 1) peopleToRemove.pop();
            else peopleToRemove.splice(x, 1);
          }
        }
      }
    }

    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESPONSIBLE_PERSON]->(b)`;

    let deletingQuery = ``;
    if (!isEmpty(peopleToRemove)) {
      deletingQuery = `MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `;
      for (let x = 1; x < peopleToRemove.length; x++) {
        deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `;
      }
      deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESPONSIBLE_PERSON]->(b) DELETE r`;
    }

    await session
      .run(addingQuery)
      .then(async (result) => {
        if (!isEmpty(deletingQuery)) {
          await db
            .getSession()
            .run(deletingQuery)
            .then((result) => {
              return 200;
            })
            .catch((err) => {
              console.log(err);
              return 400;
            });
        }
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  }
}

async function updateResources(taskId, persons, originalResources) {
  var session = db.getSession();

  if (isEmpty(persons) && !isEmpty(originalResources)) {
    let deletingQuery = `MATCH (a:User) WHERE ID(a) = ${originalResources[0].id} `;
    for (let x = 1; x < originalResources.length; x++) {
      deletingQuery += `OR ID(a) = ${originalResources[x].id} `;
    }
    deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESOURCE]->(b) DELETE r`;

    await session
      .run(deletingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else if (!isEmpty(persons) && isEmpty(originalResources)) {
    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESOURCE]->(b)`;

    await session
      .run(addingQuery)
      .then((result) => {
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  } else {
    let peopleToRemove = originalResources;
    for (let x = 0; x < peopleToRemove.length; x++) {
      for (let y = 0; y < persons.length; y++) {
        if (peopleToRemove[x] !== undefined && persons[y] !== undefined) {
          if (peopleToRemove[x].id === persons[y].id) {
            if (x === 0) peopleToRemove.shift();
            else if (x === peopleToRemove.length - 1) peopleToRemove.pop();
            else peopleToRemove.splice(x, 1);
          }
        }
      }
    }

    let addingQuery = `MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `;
    for (let x = 1; x < persons.length; x++) {
      addingQuery += `OR ID(a) = ${persons[x].id} `;
    }
    addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESOURCE]->(b)`;

    let deletingQuery = ``;
    if (!isEmpty(peopleToRemove)) {
      deletingQuery = `MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `;
      for (let x = 1; x < peopleToRemove.length; x++) {
        deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `;
      }
      deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESOURCE]->(b) DELETE r`;
    }

    await session
      .run(addingQuery)
      .then(async (result) => {
        if (!isEmpty(deletingQuery)) {
          await db
            .getSession()
            .run(deletingQuery)
            .then((result) => {
              return 200;
            })
            .catch((err) => {
              console.log(err);
              return 400;
            });
        }
        return 200;
      })
      .catch((err) => {
        console.log(err);
        return 400;
      });
  }
}

async function getAllUsers(req, res) {
  let session = db.getSession();
  let usersArr = [];
  await session
    .run(
      `
      MATCH (n:User) RETURN n
      `
    )
    .then(function (result) {
      result.records.forEach(function (record) {
        usersArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture,
        });
      });
      res.send({ users: usersArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function getAllProjectMembers(req, res) {
  let session = db.getSession();
  var projID = parseInt(req.body.id);
  let usersArr = [];
  await session
    .run(
      `
      MATCH (n:User)-[r:MEMBER]->(j) WHERE ID(j)=${projID} RETURN n,r UNION MATCH (n:User)-[r:MANAGES]->(j) WHERE ID(j)=${projID} RETURN n,r
      `
    )
    .then(function (result) {
      result.records.forEach(function (record) {
        usersArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture,
        });
      });
      res.send({ users: usersArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function getProjectManagers(req, res) {
  let session = db.getSession();
  var projID = parseInt(req.body.id);
  let usersArr = [];
  await session
    .run(
      `
      MATCH (n:User)-[r:MANAGES]->(j) WHERE ID(j)=${projID} RETURN n,r
      `
    )
    .then(function (result) {
      result.records.forEach(function (record) {
        usersArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture,
        });
      });
      res.send({ users: usersArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function getAssignedProjectUsers(req, res) {
  let session = db.getSession();
  var projID = parseInt(req.body.id);
  let usersArr = [];

  await session
    .run(
      `
      MATCH (n:User)-[r]->(m:Task)-[:PART_OF]->(j) WHERE ID(j)=${projID} RETURN n,r,m
      `
    )
    .then(function (result) {
      result.records.forEach(function (record) {
        let user = {
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture,
        };

        let relationship = {
          id: record._fields[1].identity.low,
          start: record._fields[1].start.low,
          end: record._fields[1].end.low,
          type: record._fields[1].type,
        };

        usersArr.push([user, relationship]);
      });
      res.status(200);
      res.send({ projectUsers: usersArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function addProjectManager(req, res) {
  let user = parseInt(req.body.userId);
  let project = parseInt(req.body.projId);
  let alreadyManager = false;

  let session = db.getSession();
  await session
    .run(
      `
        MATCH (c:User)-[r:MANAGES]->(d:Project)
        WHERE id(c)=${user} and id(d)=${project}
        RETURN c
      `
    )
    .then((result) => {
      if (result.records[0] != null) {
        alreadyManager = true;
        res.status(200);
        res.send({
          response: "You are already a project manager for this project",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });

  if (alreadyManager === true) {
    return;
  }

  await session
    .run(
      `
        MATCH (c:User)-[r:MEMBER]->(d:Project)
        WHERE id(c)=${user} and id(d)=${project}
        DETACH DELETE r
      `
    )
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });

  await session
    .run(
      `
      MATCH (a:User), (b:Project) WHERE id(a)=${user} AND id(b)=${project} CREATE (a)-[:MANAGES]->(b)
      `
    )
    .then(function (result) {
      res.send({ response: "okay" });
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function getPendingMembers(req, res) {
  let session = db.getSession();
  let usersArr = [];
  await session
    .run(
      `
      MATCH (a), (b) WHERE id(a)=${req.body.projId} AND (b)-[:PENDING_MEMBER]->(a) RETURN b
      `
    )
    .then(function (result) {
      result.records.forEach(function (record) {
        usersArr.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture,
        });
      });
      res.send({ users: usersArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

async function authoriseMember(req, res) {
  let user = JSON.parse(req.body.user);
  let project = JSON.parse(req.body.project);

  let notification = null;
  if (req.body.check == "true" || req.body.check == true) {
    notification = "Your request to join has been accepted";
  } else {
    notification = "Your request to join has been declined";
  }

  let notificationData = {
    type: "auto",
    fromName: "Project Tree",
    recipients: [{ email: user.email }],
    projName: project.name,
    projID: project.id,
    mode: 0,
    message: notification,
  };

  sendProjectNotification.sendNotification({ body: notificationData });

  let session = db.getSession();
  await session
    .run(
      `
        MATCH (c:User)-[r:PENDING_MEMBER]->(d:Project)
        WHERE id(c)=${user.id} and id(d)=${project.id}
        DETACH DELETE r
      `
    )
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });

  if (req.body.check == "true" || req.body.check == true) {
    db.getSession()
      .run(
        `
          MATCH (c:User), (d:Project)
          WHERE id(c)=${user.id} and id(d)=${project.id}
          CREATE (c)-[:MEMBER]->(d)
          RETURN c
        `
      )
      .then(function (result) {
        res.status(200);
        res.send({ okay: "okay" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send(err);
      });
  } else {
    res.status(200);
    res.send({ okay: "okay" });
  }
}

module.exports = {
  assignPeople,
  updateAssignedPeople,
  getAllUsers,
  getAllProjectMembers,
  getAssignedProjectUsers,
  addProjectManager,
  getPendingMembers,
  authoriseMember,
  getProjectManagers,
};
