const db = require("../DB");

async function updateProject(rootId, nodes, rels, queriesArray) {
  let root = nodes.find(findNode, rootId);
  propagateDependencies(root, nodes, rels, queriesArray);

  var query = "";
  for (var x = 0; x < queriesArray.length; x++) {
    if (x == queriesArray.length - 1) {
      query += queriesArray[x];
    } else {
      query += queriesArray[x] + ";";
    }
  }
}

function excecuteQueries(queriesArray) {
  for (var x = 0; x < queriesArray.length; x++) {
    executeQuery(queriesArray[x]);
  }
}

function executeQuery(query) {
  let session = db.getSession();
  session.run(query).catch((err) => {
    console.log(err);
  });
}

async function propagateDependencies(currentNode, nodes, rels, queriesArray) {
  let predecessors = getPredecessors(currentNode.id, nodes, rels);
  let successors = getSuccessors(currentNode.id, nodes, rels);

  if (predecessors != 0) {
    var tempLatestDate = [2000, 1, 1];

    for (var x = 0; x < predecessors.length; x++) {
      var relType = predecessors[x].rel.relationshipType;
      var relDuration = predecessors[x].rel.duration;
      var relativeDate;

      if (relType == "fs") {
        relativeDate = predecessors[x].node.endDate;
      } else {
        relativeDate = predecessors[x].node.startDate;
      }

      var newTempDate = addDays(
        relativeDate.year.low,
        relativeDate.month.low,
        relativeDate.day.low,
        relDuration
      );
      if (
        compareDates(
          tempLatestDate[0],
          tempLatestDate[1],
          tempLatestDate[2],
          newTempDate[0],
          newTempDate[1],
          newTempDate[2]
        ) == 1
      ) {
        tempLatestDate = newTempDate;
      }
    }

    addNewQuery(currentNode, tempLatestDate, queriesArray);
  }

  for (var x = 0; x < successors.length; x++) {
    propagateDependencies(successors[x], nodes, rels, queriesArray);
  }
}

function addNewQuery(currentNode, startDate, queriesArray) {
  let endDate = addDays(
    startDate[0],
    startDate[1],
    startDate[2],
    currentNode.duration
  );

  currentNode.startDate.year.low = startDate[0];
  currentNode.startDate.month.low = startDate[1];
  currentNode.startDate.day.low = startDate[2];

  currentNode.endDate.year.low = endDate[0];
  currentNode.endDate.month.low = endDate[1];
  currentNode.endDate.day.low = endDate[2];

  let query = `
      MATCH(n) 
      WHERE ID(n) = ${currentNode.id}
      SET n +={
        startDate:date("${startDate[0]}-${startDate[1]}-${startDate[2]}"), 
        endDate:date("${endDate[0]}-${endDate[1]}-${endDate[2]}")
      }
    `;
  queriesArray.push(query);
}

function findNode(node) {
  return node.id == this;
}

function deleteDependency(rel) {
  return rel.id != this;
}

function getPredecessors(id, nodes, rels) {
  let predecessors = [];

  rels.forEach((rel) => {
    if (rel.target == id) {
      predecessors.push({
        node: nodes.find(findNode, rel.source),
        rel: rel,
      });
    }
  });

  return predecessors;
}

function getSuccessors(id, nodes, rels) {
  let successors = [];

  rels.forEach((rel) => {
    if (rel.source == id) {
      successors.push(nodes.find(findNode, rel.target));
    }
  });

  return successors;
}

function compareDates(year1, month1, day1, year2, month2, day2) {
  //returns 1 if date1 < date2, otherwise returns 0
  date1 = new Date(year1, month1, day1);
  date2 = new Date(year2, month2, day2);

  if (date1 < date2) {
    return 1; //sencond date is after first
  } else if (date2 < date1) {
    return 0; //first date is after second
  } else {
    return 0; //does not matter what is returned as they are equal
  }
}

function addDays(year, month, day, duration) {
  //adds days to a date to generate new date in the form [year, month, day]
  var initialDate = new Date(year, month - 1, day);
  const copy = new Date(Number(initialDate));
  copy.setDate(initialDate.getDate() + duration);
  dateWithDuration = [copy.getFullYear(), copy.getMonth() + 1, copy.getDate()];
  return dateWithDuration;
}

module.exports = {
  updateProject,
  excecuteQueries,
  executeQuery,
  findNode,
  deleteDependency,
  getSuccessors,
  addDays,
  compareDates
};
