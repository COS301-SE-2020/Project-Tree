function createHtmlEmail(from_name, taskName, projectName, _to, message, type){
    let body;
    console.log(type)
    if(type === 'task'){
        body=`<h2>New notification from `+ from_name +` for project `+ projectName+ ` regarding your task `+ taskName +`:<br/>`+ message +` <br/> <a href="https://projecttree.herokuapp.com/">Explore</a></p></h2>`
    }

    if(type === 'project'){
        body=`<h2>New notification from `+ from_name +` for project `+ projectName+`.<br/>`+ message +` <br/> <a href="https://projecttree.herokuapp.com/">Explore</a></p></h2>`
    }

    if(type === 'auto'){

        body=`<h2>`+message+` for `+projectName+` .<br/> <a href="https://projecttree.herokuapp.com/">Explore</a></p></h2>`
    }

    var mailOptions = {
        from: 'thebteam.project@gmail.com',
        to: _to,
        subject: 'Project Tree Notification',
        html: `
            <!DOCTYPE html>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <html>
                <head>
                <style>
                body {background-color: #96BB7C}
                img {display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width: 20%;
                </style>
                </head>
            
                <body>
                    <img src="https://cdn.discordapp.com/attachments/713307810942681089/738461435297923142/Project_Tree.png" alt="Project-Tree">
                    `+body+`
                </body>
            </html>
                `
    };

    return mailOptions;
}

module.exports = {
    createHtmlEmail
};


