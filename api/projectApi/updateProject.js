const db = require("../DB");

function updateCurTask(task, nodes, rels) {
  //needed for future development
  /* getPredDependencies(task, rels)
    .forEach(dep => {
      if (task.startDate != dep.endDate) {
        dep.endDate = task.startDate;
        let startDate = new Date(dep.startDate);
        let endDate = new Date(dep.endDate);
        dep.duration = endDate.getTime() - startDate.getTime();
        db.getSession()
          .run(
            `
              MATCH (a)-[r]->(b) 
              WHERE ID(r) = ${dep.id}
              SET r += {  
                endDate: datetime("${dep.endDate}"), 
                duration:${dep.duration},
              }
            `
          ).catch((err) => {
            console.log(err);
          });
        
      }
    }); */
  getSuccDependencies(task, rels)
    .forEach(dep => updateDependency(dep, nodes, rels));
}

function updateCurDependency(dependency, nodes, rels) {
  nodes.forEach( node => {
    if (node.id == dependency.target) updateTask(node, nodes, rels);
  });
}

function updateTask(task, nodes, rels) {
  let maxStartDate =new Date(task.startDate);
  maxStartDate.setTime( maxStartDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
  let predDependencies = getPredDependencies(task, rels);
  if(predDependencies.length != 0){
    maxStartDate = new Date(0);
    maxStartDate.setTime( maxStartDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    predDependencies.forEach(dep => {
      let endDate = new Date(dep.endDate)
      endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
      if (endDate > maxStartDate) maxStartDate = endDate;
    });
  }
  let startDate = maxStartDate;
  let endDate = new Date(startDate.getTime() + task.duration);
  task.startDate = startDate.toISOString().substring(0, 16);
  task.endDate = endDate.toISOString().substring(0, 16);

  db.getSession()
    .run(
      `
        MATCH (a:Task) 
        WHERE ID(a) = ${task.id}
        SET a += {
          startDate: datetime("${task.startDate}"),
          endDate: datetime("${task.endDate}")
        }
      `
    ).catch((err) => {
      console.log(err);
    });

  getSuccDependencies(task, rels)
    .forEach( dep => updateDependency(dep, nodes, rels))
}

function updateDependency(dependency, nodes, rels) {
  let source;
  nodes.forEach( node => {
    if (node.id == dependency.source) source = node;
  });
  dependency.sStartDate = source.startDate;
  dependency.sEndDate = source.endDate;
  if (dependency.relationshipType == "ss") 
    dependency.startDate = source.startDate;
  else dependency.startDate = source.endDate;
  let startDate = new Date(dependency.startDate);
  startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
  dependency.endDate =  new Date(startDate.getTime() + dependency.duration).toISOString().substring(0, 16);

  db.getSession()
    .run(
      `
        MATCH (a)-[r:DEPENDENCY]->(b) 
        WHERE ID(r) = ${dependency.id}
        SET r += {
          sStartDate: datetime("${dependency.sStartDate}"),
          sEndDate: datetime("${dependency.sEndDate}"),
          startDate: datetime("${dependency.startDate}"),
          endDate: datetime("${dependency.endDate}")
        }
      `
    ).catch((err) => {
      console.log(err);
    });
    nodes.forEach( node => {
      if (node.id == dependency.target) updateTask(node, nodes, rels);
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
      nodes.forEach( node => {
        if (node.id == rel.target) successors.push(node);
      });
    }
  });
  return successors;
}

function datetimeToString(datetime){
  let obj = {
    year: datetime.year.low,
    month: datetime.month.low < 10 ? `0${datetime.month.low}` : datetime.month.low,
    day: datetime.day.low < 10 ? `0${datetime.day.low}` : datetime.day.low,
    hour: datetime.hour.low < 10 ? `0${datetime.hour.low}` : datetime.hour.low,
    min: datetime.minute.low < 10 ? `0${datetime.minute.low}` : datetime.minute.low,
  }
  return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.min}`
}

module.exports = {
  updateCurTask,
  updateCurDependency,
  updateTask,
  updateDependency,
  getSuccessors,
  datetimeToString,
};
