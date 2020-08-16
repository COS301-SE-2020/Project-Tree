const db = require("../DB");
const { isEmpty } = require("lodash");

function assignPeople(req,res){
  let taskId = req.body.ct_taskId;
  let packageManagers = req.body.ct_pacMans;
  let responsiblePersons = req.body.ct_resPersons;
  let resources = req.body.ct_resources;

  console.log(taskId)
  console.log(packageManagers)

  if(isEmpty(packageManagers) !== true){
    let pacManAddStatus = addPackageManager(taskId,packageManagers);
    if(pacManAddStatus === 400) res.sendStatus(400);
  }
  if(isEmpty(responsiblePersons) !== true){
    let resPersonAddStatus = addResponsiblePerson(taskId,responsiblePersons);
    if(resPersonAddStatus === 400) res.sendStatus(400);
  }
  if(isEmpty(resources) !== true){
    let resourcesAddStatus = addResources(taskId,resources);
    if(resourcesAddStatus === 400) res.sendStatus(400);
  }
  res.sendStatus(200)
}

async function addPackageManager(taskId, persons) {
  var session = db.getSession();

  let query=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    query += `OR ID(a) = ${persons[x].id} `
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:PACKAGE_MANAGER]->(b)`
  
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

  let query=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    query += `OR ID(a) = ${persons[x].id} `
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:RESPONSIBLE_PERSON]->(b)`

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

  let query=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    query += `OR ID(a) = ${persons[x].id} `
  }
  query += `MATCH (b:Task) WHERE ID(b) = ${taskId} CREATE(a)-[n:RESOURCE]->(b)`

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

function updateAssignedPeople(req,res){
  let taskId = req.body.ut_taskId;
  let packageManagers = req.body.ut_pacMans;
  let originalPackageManagers = req.body.ut_originalPacMans;
  let originalResponsiblePersons = req.body.ut_originalResPersons;
  let originalResources = req.body.ut_originalResources;
  let responsiblePersons = req.body.ut_resPersons;
  let resources = req.body.ut_resources;

  if(isEmpty(packageManagers) !== true){
    let pacManAddStatus = updatePackageManager(taskId,packageManagers,originalPackageManagers);
    if(pacManAddStatus === 400) res.sendStatus(400);
  }
  if(isEmpty(responsiblePersons) !== true){
    let resPersonAddStatus = updateResponsiblePerson(taskId,responsiblePersons,originalResponsiblePersons);
    if(resPersonAddStatus === 400) res.sendStatus(400);
  }
  if(isEmpty(resources) !== true){
    let resourcesAddStatus = updateResources(taskId,resources,originalResources);
    if(resourcesAddStatus === 400) res.sendStatus(400);
  }
  res.sendStatus(200)
}

async function updatePackageManager(taskId, persons, originalPackageManagers) {
  var session = db.getSession();

  let peopleToRemove = originalPackageManagers;
  for(let x = 0; x < peopleToRemove.length; x++){
    for(let y = 0; y < persons.length; y++){
      if(peopleToRemove[x].id === persons[y].id){
        if(x === 0) peopleToRemove.shift();
        else if(x === peopleToRemove.length-1) peopleToRemove.pop()
        else peopleToRemove.splice(x,1)
      }
    }
  }

  let addingQuery=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    addingQuery += `OR ID(a) = ${persons[x].id} `
  }
  addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:PACKAGE_MANAGER]->(b)`

  let deletingQuery=`MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `
  for(let x = 1; x < peopleToRemove.length; x++)
  {
    deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `
  }
  deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:PACKAGE_MANAGER]->(b) DELETE r`
  
  await session
    .run(addingQuery)
    .then(async result => {
      await db.getSession()
        .run(deletingQuery)
        .then(result => {
          return 200
        })
        .catch((err) => {
          console.log(err);
          return 400;
        });
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

async function updateResponsiblePerson(taskId, persons,originalResponsiblePersons) {
  var session = db.getSession();

  let peopleToRemove = originalResponsiblePersons;
  for(let x = 0; x < peopleToRemove.length; x++){
    for(let y = 0; y < persons.length; y++){
      if(peopleToRemove[x].id === persons[y].id){
        if(x === 0) peopleToRemove.shift();
        else if(x === peopleToRemove.length-1) peopleToRemove.pop()
        else peopleToRemove.splice(x,1)
      }
    }
  }

  let addingQuery=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    addingQuery += `OR ID(a) = ${persons[x].id} `
  }
  addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESPONSIBLE_PERSON]->(b)`

  let deletingQuery=`MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `
  for(let x = 1; x < peopleToRemove.length; x++)
  {
    deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `
  }
  deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESPONSIBLE_PERSON]->(b) DELETE r`
  
  await session
    .run(addingQuery)
    .then(async result => {
      await db.getSession()
        .run(deletingQuery)
        .then(result => {
          return 200
        })
        .catch((err) => {
          console.log(err);
          return 400;
        });
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

async function updateResources(taskId, persons, originalResources) {
  var session = db.getSession();

  let peopleToRemove = originalResources;
  for(let x = 0; x < peopleToRemove.length; x++){
    for(let y = 0; y < persons.length; y++){
      if(peopleToRemove[x].id === persons[y].id){
        if(x === 0) peopleToRemove.shift();
        else if(x === peopleToRemove.length-1) peopleToRemove.pop()
        else peopleToRemove.splice(x,1)
      }
    }
  }

  let addingQuery=`MATCH (a:User),(b:Task) WHERE ID(a) = ${persons[0].id} `
  for(let x = 1; x < persons.length; x++)
  {
    addingQuery += `OR ID(a) = ${persons[x].id} `
  }
  addingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MERGE(a)-[n:RESOURCE]->(b)`

  let deletingQuery=`MATCH (a:User) WHERE ID(a) = ${peopleToRemove[0].id} `
  for(let x = 1; x < peopleToRemove.length; x++)
  {
    deletingQuery += `OR ID(a) = ${peopleToRemove[x].id} `
  }
  deletingQuery += `MATCH (b:Task) WHERE ID(b) = ${taskId} MATCH (a)-[r:RESOURCE]->(b) DELETE r`
  
  await session
    .run(addingQuery)
    .then(async result => {
      await db.getSession()
        .run(deletingQuery)
        .then(result => {
          return 200
        })
        .catch((err) => {
          console.log(err);
          return 400;
        });
      return 200;
    })
    .catch((err) => {
      console.log(err);
      return 400;
    });
}

async function getAllUsers(req,res){
  let session = db.getSession();
  let usersArr = []
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
          profilePicture: record._fields[0].properties.profilepicture
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

async function getProjectUsers(req,res){
  let session = db.getSession();
  var projID = parseInt(req.body.id);
  let usersArr = [];

  await session
    .run(
      `
      MATCH (n:User)-[r]->(m:Task)-[:PART_OF]->(j) WHERE ID(j)=${projID} RETURN n,r,m
      `
    )
    .then(function (result){
      result.records.forEach(function (record) {
        let user = {
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          surname: record._fields[0].properties.sname,
          email: record._fields[0].properties.email,
          profilePicture: record._fields[0].properties.profilepicture
        };
        
        let relationship = {
          id: record._fields[1].identity.low,
          start: record._fields[1].start.low,
          end: record._fields[1].end.low,
          type: record._fields[1].type
        };

        usersArr.push([user,relationship]);
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

module.exports = {
  assignPeople,
  updateAssignedPeople,
  getAllUsers,
  getProjectUsers
};
