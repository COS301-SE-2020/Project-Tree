function createHtmlEmail(from_name, taskName, projectName, _to, message){
    var mailOptions = {
        from: 'thebteam.project@gmail.com',
        to: _to,
        subject: 'Project Tree Notification',
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

    return mailOptions;
}

module.exports = {
    createHtmlEmail
};


