const db = require("../DB");

async function addResponsiblePerson(taskId, personId) {
  var session = db.getSession();
  await session
    .run(
      "MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:RESPONSIBLE_PERSON]->(b)",
      { personId: personId, taskId: taskId }
    )
    .catch(function (err) {
      console.log(err);
    });
}

async function addPackageManager(taskId, personId) {
  var session = db.getSession();
  await session
    .run(
      "MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:PACKAGE_MANAGER]->(b)",
      { personId: personId, taskId: taskId }
    )
    .catch(function (err) {
      console.log(err);
    });
}

async function addResources(taskId, personId) {
  var session = db.getSession();
  var people = personId.split(",");
  for (var x = 0; x < people.length; x++) {
    await session
      .run(
        "MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:RESOURCE]->(b)",
        { personId: parseInt(people[x]), taskId: taskId }
      )
      .catch(function (err) {
        console.log(err);
      });
  }
}

module.exports = {
  addResponsiblePerson,
  addPackageManager,
  addResources,
};
