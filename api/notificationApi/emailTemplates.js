function createHtmlEmail(from_name, taskName, projectName, _to, message){
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
            
                <body> //Project-Wide
                    <img src="https://cdn.discordapp.com/attachments/713307810942681089/738461435297923142/Project_Tree.png" alt="Project-Tree">
                    <h2> New notification from `+ from_name +` for project `+ projectName +`.<br/>`+ message +` <br/> <a href="https://projecttree.herokuapp.com/">Explore</a></p></h2>
                    
                </body>
                <body> //Task-Wide
                    <img src="https://cdn.discordapp.com/attachments/713307810942681089/738461435297923142/Project_Tree.png" alt="Project-Tree">
                    <h2> New notification from `+ from_name +` for project `+ projectName+ ` regarding your task `+ taskName +`.<br/>`+ message +` <br/> <a href="https://projecttree.herokuapp.com/">Explore</a></p></h2>
                    
                </body>
                <body> //Automated Project assignment
                    <img src="https://cdn.discordapp.com/attachments/713307810942681089/738461435297923142/Project_Tree.png" alt="Project-Tree">
                    <h2>You have been added to a new project, `+ projectName +`.<br/> <a href="https://projecttree.herokuapp.com/">Go check it out!</a></h2>                    
                </body>
                <body> //Automated task assignment
                    <img src="https://cdn.discordapp.com/attachments/713307810942681089/738461435297923142/Project_Tree.png" alt="Project-Tree">
                    <h2> You have been assigned to a new task, `+ taskName +` in your project `+ projectName +`.<br/> <a href="https://projecttree.herokuapp.com/">Go check it out!</a></h2>                    
                </body>
            </html>
                `
    };

    return mailOptions;
}

module.exports = {
    createHtmlEmail
};


