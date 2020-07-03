const db = require('./DB') 
var dependencyFunctions = require('./dependencyQueries');
var peopleFunctions = require('./personQueries')

async function createTask(req,res){
    var session = db.getSession();
    var Tname = req.body.ct_Name;
    var proj = parseInt(req.body.ct_pid);
    var Sdate = req.body.ct_startDate;
    var Edate = req.body.ct_endDate;
    var Dur = req.body.ct_duration;
    var Desc = req.body.ct_description;
    var resPersonId = parseInt(req.body.ct_resPersonId);
    var pacManId = parseInt(req.body.ct_pacManId);
    var resourceId = req.body.ct_resourceId;
    var status = "Incomplete"
    var taskId = null;
    var result = await session
        .run
        (`
            CREATE(n:Task {name:"${req.body.ct_Name}", startDate: date("${req.body.ct_startDate}"), endDate:date("${req.body.ct_endDate}"), duration:${req.body.ct_duration}, description:"${req.body.ct_description}", projId:${req.body.ct_pid}, progress:"${status}"}) RETURN n
        `)
        .then(function(result){
            taskId = result.records[0]._fields[0].identity.low
        })
        .catch(function(err){
            console.log(err);
        });

    if(resPersonId != undefined)
        await peopleFunctions.addResponsiblePerson(taskId,resPersonId)
    if(pacManId != undefined)
        await peopleFunctions.addPackageManager(taskId,pacManId)
    if(resourceId != undefined)
        await peopleFunctions.addResources(taskId,resourceId)
    result = await session.run(
        'MATCH (a),(b) WHERE ID(a) = '+ taskId +' AND ID(b) = '+proj +'  CREATE (a)-[n:PART_OF]->(b) RETURN *'
    )
    res.send({ret: result.records[0]._fields[0]});
}

async function deleteTask(req,res){
    var session = db.getSession();
    var delTask = req.body.id;
    var successors = await dependencyFunctions.getSuccessorNodes(delTask)
    var result = await session
        .run
		(`
			MATCH (n) WHERE ID(n)=${req.body.id} DETACH DELETE (n)		
			
		`)
        .catch(function(err){
            console.log(err);
        });
    
    for(var x = 0; x < successors.length; x++)
    {
        await dependencyFunctions.updateDependencies(successors[x].identity.low)
    }
    res.send({ret: result});
}

async function updateTask(req,res){ //update a task with a certain ID with specified fields
    var session = db.getSession();
    console.log("req.body.ut_id: ", req.body.ut_id)
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.ut_id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no task of that id')
    }else{
        let upDep = false;
        if(result.records[0]._fields[0].properties.startDate != req.body.ut_startDate ||
            result.records[0]._fields[0].properties.duration != req.body.ut_duration ) upDep = true;
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.ut_id}
            SET a += {
                name:"${req.body.ut_name}",
                startDate: date("${req.body.ut_startDate}"),
                duration: ${req.body.ut_duration},
                endDate: date("${req.body.ut_endDate}"),
                description: "${req.body.ut_description}"
            }`
        )

        if(upDep == true){
            await dependencyFunctions.updateDependencies(req.body.ut_id)
        }

        res.send({ret: result})
    }
}

async function updateProgress(req,res){
    var session = db.getSession();

    var result = await session.run(
        `
            MATCH (n)
            WHERE ID(n) = ${req.body.id}
            SET n.progress = toString("${req.body.progress}")
            RETURN n
        `
    )
    res.send({ret: result})
}

module.exports =
{
    createTask,
    deleteTask,
    updateTask,
    updateProgress
};

