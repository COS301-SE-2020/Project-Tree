const db = require("../DB");

async function sendNoticeBoardNotification(
  ids,
  fromName,
  taskName,
  projName,
  projID,
  timestamp,
  message,
  type,
  profileId
) {
  let queriesArray = [];
  let session = db.getSession();
  await session
    .run(
      `
        CREATE (a:Notification {
          fromName:'${fromName}',
          projName:'${projName}',
          taskName:'${taskName}',
          projID:${projID}, 
          message:'${message}',
          timestamp:datetime('${timestamp}'),
          type:'${type}',
          profileId:'${profileId}'
        })
      `
    )
    .catch(function (err) {
      console.log(err);
    });

  for (let index = 0; index < ids.length; index++) {
    queriesArray = addNewQuery(
      queriesArray,
      ids[index],
      timestamp,
      projID,
      message
    );
  }

  excecuteQueries(queriesArray);
}

function addNewQuery(queriesArray, id, timestamp, projID, message) {
  let query = `
    Match (a:Notification {
      timestamp:datetime('${timestamp}'), 
      projID:${projID}, 
      message:'${message}'
    }), (b:User)
    WHERE  id(b) = ${id}
    CREATE (a)-[:SENT_TO]->(b)
  `;
  queriesArray.push(query);
  return queriesArray;
}

function excecuteQueries(queriesArray) {
  for (var x = 0; x < queriesArray.length; x++) {
    executeQuery(queriesArray[x]);
  }
}

async function executeQuery(query) {
  let session = db.getSession();
  session.run(query).catch((err) => {
    console.log(err);
  });
}

module.exports = {
  sendNoticeBoardNotification,
};
