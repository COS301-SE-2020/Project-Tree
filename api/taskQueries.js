var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();
var dependencyFunctions = require('./dependencyQueries');
var peopleFunctions = require('./personQueries')

async function createTask(req,res){
    var Tname = req.body.ct_taskName;
    var Sdate = req.body.ct_startDate;
    var Edate = req.body.ct_endDate;
    var Dur = req.body.ct_duration;
    var Desc = req.body.ct_description;
    var resPersonId = parseInt(req.body.ct_resPersonId);
    var pacManId = parseInt(req.body.ct_pacManId);
    var resourceId = req.body.ct_resourceId;
    var taskId = null;
    await session
        .run('CREATE(n:Task {name:$taskName, startDate: date($startDate), endDate:date($endDate), duration:$duration, description:$desc}) RETURN n', {taskName:Tname, startDate:Sdate, endDate:Edate, duration:Dur, desc:Desc})
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
    res.redirect('/');
}

async function deleteTask(req,res){
    var delTask = req.body.id;
    var successors = await dependencyFunctions.getSuccessorNodes(delTask)
    await session
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
    res.redirect('/');
}

async function updateTask(req,res){ //update a task with a certain ID with specified fields
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

        res.redirect('/')
    }
}

module.exports =
{
    createTask,
    deleteTask,
    updateTask
};

