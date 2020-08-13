const db = require("../DB");
const { isEmpty } = require("lodash");

function assignPeople(req,res){
  let taskId = req.body[0];
  let packageManagers = req.body[1];
  let responsiblePersons = req.body[2];
  let resources = req.body[3];

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
  getAllUsers,
  getProjectUsers
};
