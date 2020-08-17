var nodemailer = require('nodemailer');
var templates = require('./emailTemplates');
require("dotenv").config();

function sendEmailNotification(fromName, taskName, projectName, to, message, type){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
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






  