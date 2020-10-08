const { check } = require("prettier");
const db = require("../DB");

function updateCurTask(task, nodes, rels, queries) {
  getSuccDependencies(task, rels).forEach((dep) =>
    updateDependency(dep, nodes, rels, queries)
  );
}

function updateCurDependency(dependency, nodes, rels, queries) {
  nodes.forEach((node) => {
    if (node.id == dependency.target) updateTask(node, nodes, rels, queries);
  });
}

function updateTask(task, nodes, rels, queries) {
  let maxStartDate = new Date(task.startDate);
  maxStartDate.setTime(
    maxStartDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
  );
  let predDependencies = getPredDependencies(task, rels);
  if (predDependencies.length != 0) {
    maxStartDate = new Date(0);
    maxStartDate.setTime(
      maxStartDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    predDependencies.forEach((dep) => {
      let endDate = new Date(dep.endDate);
      endDate.setTime(
        endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      );
      if (endDate > maxStartDate) maxStartDate = endDate;
    });
  }
  let startDate = maxStartDate;
  let endDate = new Date(startDate.getTime() + task.duration);
  task.startDate = startDate.toISOString().substring(0, 16);
  task.endDate = endDate.toISOString().substring(0, 16);

  queries.push({ 
    endDate : task.endDate,
    query: `
        MATCH (a:Task) 
        WHERE ID(a) = ${task.id}
        SET a += {
          startDate: datetime("${task.startDate}"),
          endDate: datetime("${task.endDate}")
        }
      `
  });

  getSuccDependencies(task, rels).forEach((dep) =>
    updateDependency(dep, nodes, rels, queries)
  );
}

function updateDependency(dependency, nodes, rels, queries) {
  let source;
  nodes.forEach((node) => {
    if (node.id == dependency.source) source = node;
  });
  dependency.sStartDate = source.startDate;
  dependency.sEndDate = source.endDate;
  if (dependency.relationshipType == "ss")
    dependency.startDate = source.startDate;
  else dependency.startDate = source.endDate;
  let startDate = new Date(dependency.startDate);
  startDate.setTime(
    startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
  );
  dependency.endDate = new Date(startDate.getTime() + dependency.duration)
    .toISOString()
    .substring(0, 16);

    queries.push({ 
      endDate : dependency.endDate,
      query: `
        MATCH (a)-[r:DEPENDENCY]->(b) 
        WHERE ID(r) = ${dependency.id}
        SET r += {
          sStartDate: datetime("${dependency.sStartDate}"),
          sEndDate: datetime("${dependency.sEndDate}"),
          startDate: datetime("${dependency.startDate}"),
          endDate: datetime("${dependency.endDate}")
        }
      `
    });
  nodes.forEach((node) => {
    if (node.id == dependency.target) updateTask(node, nodes, rels, queries);
  });
}

function getPredDependencies(task, rels) {
  let dependencies = [];
  rels.forEach((rel) => {
    if (rel.target == task.id) {
      dependencies.push(rel);
    }
  });
  return dependencies;
}

function getSuccDependencies(task, rels) {
  let dependencies = [];
  rels.forEach((rel) => {
    if (rel.source == task.id) {
      dependencies.push(rel);
    }
  });
  return dependencies;
}

function getSuccessors(id, nodes, rels) {
  let successors = [];
  rels.forEach((rel) => {
    if (rel.source == id) {
      nodes.forEach((node) => {
        if (node.id == rel.target) successors.push(node);
      });
    }
  });
  return successors;
}

async function runQueries(queries) {
  queries.forEach(query => {
    db.getSession().run(query.query).catch((err)=>console.log(err));
  });
}

function CheckEndDate(queries, project) {
  let check = true;
  console.log(queries);
  queries.forEach(query => {
    console.log(query.endDate);
    if (query.endDate > project.endDate) check = false;
  });
  return check;
}

function datetimeToString(datetime) {
  let obj = {
    year: datetime.year.low,
    month:
      datetime.month.low < 10 ? `0${datetime.month.low}` : datetime.month.low,
    day: datetime.day.low < 10 ? `0${datetime.day.low}` : datetime.day.low,
    hour: datetime.hour.low < 10 ? `0${datetime.hour.low}` : datetime.hour.low,
    min:
      datetime.minute.low < 10
        ? `0${datetime.minute.low}`
        : datetime.minute.low,
  };
  return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.min}`;
}

module.exports = {
  updateCurTask,
  updateCurDependency,
  updateTask,
  updateDependency,
  getSuccessors,
  datetimeToString,
  getPredDependencies,
  getSuccDependencies,
  runQueries,
  CheckEndDate,
};
