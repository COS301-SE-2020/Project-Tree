var emailHandler = require('./emailNotifications');

function sendNotification(data)
{
    //mode 0: email
    //mode 1: notice board
    //mode 2: notice board and email

    if(data.mode === 0){
        let emails = getEmails(data.recipients);
        emailHandler.sendEmailNotification(data.fromName, data.taskName, data.projectName, emails, data.message);
    }

    else if(data.mode === 1){
        console.log('notice board')
    }

    else{
        console.log('other')
    }
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

data = {
    fromName: "Amber Grill",
    recipients: [{email:"ambzgrill@gmail.com", id:1}, {email:"damianventer1@gmail.com", id:2}],
    timestamp: "date",
    message: "Please finish your work damian, you're extremely behind!",
    taskName: "Do math",
    projectName: "Fix yourself",
    projectID: 5,
    mode:0
}

sendNotification(data);