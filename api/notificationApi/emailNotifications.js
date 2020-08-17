var nodemailer = require('nodemailer');
var templates = require('./emailTemplates');

function sendEmailNotification(fromName, taskName, projectName, to, message, type){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'thebteam.project@gmail.com',
          pass: 'TheBTe@m1'
        }
    });

    let mailOptions = templates.createHtmlEmail(fromName, taskName, projectName, to, message, type);

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendEmailNotification
};






  