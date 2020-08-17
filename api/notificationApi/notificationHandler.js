const emailHandler = require("./emailNotifications");
const noticeBoardHandler = require("./noticeBoard");
const db = require("../DB");

async function sendNotification(req, res) {
  // mode 0: email
  // mode 1: notice board
  // mode 2: notice board and email
  // type, fromName, recipients, timestamp, notification, taskName, projName, projID, mode

  let data = req.body;
  data.projID = parseInt(data.projID);
  data.mode = parseInt(data.mode);

  if (data.type === "project") {
    data.recipients = await getProjectMembers(data.projID);
  }

  if (data.type === "task") {
    data.recipients = JSON.parse(data.recipients);
  }

  if (data.mode === 0) {
    let emails = getEmails(data.recipients);
    emailHandler.sendEmailNotification(
      data.fromName,
      data.taskName,
      data.projName,
      emails,
      data.message,
      data.type
    );
  } else if (data.mode === 1) {
    let ids = getIds(data.recipients);
    noticeBoardHandler.sendNoticeBoardNotification(
      ids,
      data.fromName,
      data.taskName,
      data.projName,
      data.projID,
      data.timestamp,
      data.message,
      data.type
    );
  } else {
    let emails = getEmails(data.recipients);
    emailHandler.sendEmailNotification(
      data.fromName,
      data.taskName,
      data.projName,
      emails,
      data.message,
      data.type
    );

    let ids = getIds(data.recipients);
    noticeBoardHandler.sendNoticeBoardNotification(
      ids,
      data.fromName,
      data.taskName,
      data.projName,
      data.projID,
      data.timestamp,
      data.message,
      data.type
    );
  }

  if (data.type === "auto") {
    return;
  }

  res.status(200);
  res.send({ response: "okay" });
}

async function retrieveNotifications(req, res) {
  let data = req.body;

  await db
    .getSession()
    .run(
      `
        Match (b), (a:User)
        WHERE id(a) = ${data.userID} and (b)-[:SENT_TO]->(a) and b.projID= ${data.projID}
        WITH b
        ORDER BY b.timestamp DESC
        RETURN b
      `
    )
    .then((result) => {
      let messageArr = [];
      result.records.forEach((record) => {
        messageArr.push({
          id: record._fields[0].identity.low,
          fromName: record._fields[0].properties.fromName,
          taskName: record._fields[0].properties.taskName,
          message: record._fields[0].properties.message,
          timestamp: record._fields[0].properties.timestamp,
          type: record._fields[0].properties.type,
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

async function getProjectMembers(id) {
  let recipientArr = [];
  await db
    .getSession()
    .run(
      `
            MATCH (a:Project), (b), (c)
            WHERE id(a) = ${id} AND (
            (b)-[:MANAGES]->(a) OR 
            (b)-[:RESPONSIBLE_PERSON]->(c)-[:PART_OF]->(a) OR 
            (b)-[:PACKAGE_MANAGER]->(c)-[:PART_OF]->(a) OR 
            (b)-[:RESOURCE]->(c)-[:PART_OF]->(a))
            RETURN DISTINCT b
        `
    )
    .then((result) => {
      result.records.forEach((record) => {
        recipientArr.push({
          id: record._fields[0].identity.low,
          email: record._fields[0].properties.email,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  return recipientArr;
}

function formatAutoAssignData(
  packageManagers,
  responsiblePersons,
  resources,
  data
) {
  let recipients = [];

  for (let x = 0; x < packageManagers.length; x++) {
    recipients.push({
      id: packageManagers[x].id,
      email: packageManagers[x].email,
    });
  }

  let packMan = {
    type: "auto",
    fromName: "Project Tree",
    recipients: [...recipients],
    timestamp: data.timestamp,
    message:
      "You have been assigned as a package manager to task: " + data.taskName,
    taskName: undefined,
    projName: data.projName,
    projID: data.projID,
    mode: 2,
  };

  recipients = [];

  for (let x = 0; x < responsiblePersons.length; x++) {
    recipients.push({
      id: responsiblePersons[x].id,
      email: responsiblePersons[x].email,
    });
  }

  let resPer = {
    type: "auto",
    fromName: "Project Tree",
    recipients: [...recipients],
    timestamp: data.timestamp,
    message:
      "You have been assigned as a responsible person to task: " +
      data.taskName,
    taskName: undefined,
    projName: data.projName,
    projID: data.projID,
    mode: 2,
  };

  recipients = [];

  for (let x = 0; x < resources.length; x++) {
    recipients.push({ id: resources[x].id, email: resources[x].email });
  }

  let res = {
    type: "auto",
    fromName: "Project Tree",
    recipients: [...recipients],
    timestamp: data.timestamp,
    message: "You have been assigned as a resource to task: " + data.taskName,
    taskName: undefined,
    projName: data.projName,
    projID: data.projID,
    mode: 2,
  };

  let returnData = {
    packMan: packMan,
    resPer: resPer,
    res: res,
  };

  return returnData;
}

function getIds(data) {
  let ids = [];
  for (let count = 0; count < data.length; count++) {
    ids.push(data[count].id);
  }

  return ids;
}

function getEmails(data) {
  let emails = "";
  for (let count = 0; count < data.length; count++) {
    if (count === data.length - 1) {
      emails += data[count].email;
      break;
    }
    emails += data[count].email + ",";
  }

  return emails;
}

module.exports = {
  sendNotification,
  retrieveNotifications,
  formatAutoAssignData,
};
