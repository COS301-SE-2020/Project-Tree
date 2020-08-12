const db = require("../DB");
const { isEmpty } = require("lodash");

function assignPeople(req,res){
  let taskId = req.body[0];
  let packageManagers = req.body[1];
  let responsiblePersons = req.body[2];
  let resources = req.body[3];

  if(isEmpty(packageManagers) !== true){
    addPackageManager(taskId,packageManagers);
  }
  if(isEmpty(responsiblePersons) !== true){
    addResponsiblePerson(taskId,responsiblePersons);
  }
  if(isEmpty(resources) !== true){
    addResources(taskId,resources);
  }

  res.status(200)
}

async function addPackageManager(taskId, persons) {
  var session = db.getSession();
  let query='MATCH (a:User),(b:Task) WHERE ID(a) = ' + persons[0].id + ' '
  for(let x = 1; x < persons.length; x++)
  {
    query += 'OR ID(a) = ' + persons[x].id + ' '
  }
  query += 'AND ID(b) = ' + taskId + ' CREATE(a)-[n:PACKAGE_MANAGER]->(b)'
  await session
    .run(query)
    .catch(function (err) {
      console.log(err);
    });
}

async function addResponsiblePerson(taskId, persons) {
  var session = db.getSession();
  let query='MATCH (a:User),(b:Task) WHERE ID(a) = ' + persons[0].id + ' '
  for(let x = 1; x < persons.length; x++)
  {
    query += 'OR ID(a) = ' + persons[x].id + ' '
  }
  query += 'AND ID(b) = ' + taskId + ' CREATE(a)-[n:RESPONSIBLE_PERSON]->(b)'
  await session
    .run(query)
    .catch(function (err) {
      console.log(err);
    });
}

async function addResources(taskId, persons) {
  var session = db.getSession();
  let query='MATCH (a:User),(b:Task) WHERE ID(a) = ' + persons[0].id + ' '
  for(let x = 1; x < persons.length; x++)
  {
    query += 'OR ID(a) = ' + persons[x].id + ' '
  }
  query += 'AND ID(b) = ' + taskId + ' CREATE(a)-[n:RESOURCE]->(b)'
  await session
    .run(query)
    .catch(function (err) {
      console.log(err);
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
    })
    .catch(function (err) {
      console.log(err);
    });
    res.send({ users: usersArr });
}

module.exports = {
  assignPeople,
  getAllUsers
};
