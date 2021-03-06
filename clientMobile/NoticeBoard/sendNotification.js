async function sendNotification(
  type,
  fromName,
  recipients,
  timestamp,
  notification,
  taskName,
  projName,
  projID,
  mode,
  profileId,
) {
  let data = {
    type: type, //personal, task, project, auto
    fromName: fromName,
    recipients: recipients,
    timestamp: timestamp,
    message: notification,
    taskName: taskName,
    projName: projName,
    projID: projID,
    mode: mode, //email: 0, notice: 1, both: 2
    mobile: true,
    profileId: profileId,
  };

  data = JSON.stringify(data);

  const response = await fetch(
    'https://projecttree.herokuapp.com/sendNotification',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    },
  );
}

export default sendNotification;
