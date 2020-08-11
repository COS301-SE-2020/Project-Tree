var emailHandler = require('./emailNotifications');
var noticeBoardHandler = require('./noticeBoard');
const db = require("../DB");

function sendNotification(req, res){
    // mode 0: email
    // mode 1: notice board
    // mode 2: notice board and email
    let data = req.body;

    if(data.mode === 0){
        let emails = getEmails(data.recipients);
        emailHandler.sendEmailNotification(data.fromName, data.taskName, data.projName, emails, data.message);
    }

    else if(data.mode === 1){
        let ids = getIds(data.recipients)
        noticeBoardHandler.sendNoticeBoardNotification(ids, data.fromName, data.taskName, data.projName, data.projID, data.timestamp, data.message);
    }

    else{
        console.log('other')
    }

    res.status(200);
    res.send({response:"okay"});
}

async function retrieveNotifications(req, res){
    let data = req.body;

    await db.getSession()
    .run(
        `
            Match (b), (a:User)
            WHERE id(a) = ${data.userID} and (b)-[:SENT_TO]->(a) and b.projID= ${data.projID}
            WITH b
            ORDER BY b.timestamp
            RETURN b
        `
    )
    .then(result => {
      let messageArr = [];
      result.records.forEach((record) => {
        messageArr.push({
          id: record._fields[0].identity.low,
          fromName: record._fields[0].properties.fromName,
          taskName: record._fields[0].properties.taskName,
          message: record._fields[0].properties.message,
          timestamp: record._fields[0].properties.timestamp
        });
      });
      res.status(200);
      res.send({ notifications: messageArr });
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send(err);
    });
}

function getIds(data){
    let ids = [];
    for(var count=0; count<data.length; count++){
        ids.push(data[count].id);
    }

    return ids;
}

function getEmails(data){
    let emails = "";
    for(var count=0; count<data.length; count++){
        if(count === data.length-1){
            emails += data[count].email
            break;
        }
        emails += data[count].email+',';
    }

    return emails;
}

module.exports = {
    sendNotification,
    retrieveNotifications
}