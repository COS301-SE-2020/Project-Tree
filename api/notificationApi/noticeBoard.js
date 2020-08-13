const db = require("../DB");

function sendNoticeBoardNotification(ids, fromName, taskName, projName, projID, timestamp, message, type){
    let queriesArray = [];
    for(var index=0; index<ids.length; index++){
        queriesArray = addNewQuery(queriesArray, ids[index], fromName, taskName, projName, projID, timestamp, message, type)
    }

    excecuteQueries(queriesArray);
}

function addNewQuery(queriesArray, id, fromName, taskName, projName, projID, timestamp, message, type) {
    let query = `
        MATCH (b:User)
        WHERE ID(b) = ${id}
        CREATE (a:Notification {fromName:'${fromName}', projName:'${projName}', taskName:'${taskName}', projID:${projID}, 
        message:'${message}', timestamp:datetime('${timestamp}'), type:('${type}')})-[:SENT_TO]->(b)
        RETURN a
      `;
    queriesArray.push(query);
    return queriesArray;
}

function excecuteQueries(queriesArray) {
    for (var x = 0; x < queriesArray.length; x++) {
      executeQuery(queriesArray[x]);
    }
  }
  
function executeQuery(query) {
    let session = db.getSession();
    session.run(query).catch(function (err) {
        console.log(err);
    });
}

module.exports = {
    sendNoticeBoardNotification
}