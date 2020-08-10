var nodemailer = require('nodemailer');
var fs=require('fs');

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var data = require('./index.html');
var message = "this is a message";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thebteam.project@gmail.com',
      pass: 'TheBTe@m1'
    }
});

var mailOptions = {
    from: 'thebteam.project@gmail.com',
    to: 'ambzgrill@gmail.com, wda1999@gmail.com',
    subject: 'Sending Email using Node.js',
    html: `
    <!DOCTYPE html>

    <html>
        <head>
        <style>
        h1 {color:red}
        </style>
        </head>
    
        <body>
            <h1>Welcome</h1>
            <p id='message'>`+message+`</p>
        </body>
    </html>
    `
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
});
  