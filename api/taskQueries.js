var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();
var dependencyFunctions = require('./dependencyQueries');

async function createTask(req,res){
    var Tname = req.body.ct_taskName;
    var Sdate = req.body.ct_startDate;
    var Edate = req.body.ct_endDate;
    var Dur = req.body.ct_duration;
    var Desc = req.body.ct_description;
    await session
        .run('CREATE(n:Task {name:$taskName, startDate: date($startDate), endDate:date($endDate), duration:$duration, description:$desc}) RETURN n', {taskName:Tname, startDate:Sdate, endDate:Edate, duration:Dur, desc:Desc})
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
}

async function deleteTask(req,res){
    var delTask = req.body.id;
    await session
        .run
		(`
			MATCH (n) WHERE ID(n)=${req.body.id} DETACH DELETE (n)		
			
		`)
        .catch(function(err){
            console.log(err);
        });
    console.log(delTask);
    res.redirect('/');
}

async function updateTask(req,res){ //update a task with a certain ID with specified fields
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no task of that id')
    }else{
        let props = '';
        let check = false
        if(req.body.name != ''){
            check = true
            props += `name:"${req.body.name}"`
        }
        if(req.body.startDate != ''){
            if(check) props += ','
            else check = true
            props += `startDate: date("${req.body.startDate}")`
        }
        if(req.body.endDate != ''){
            if(check) props += ','
            else check = true
            props += `endDate: date("${req.body.endDate}")`
        }
        if(req.body.duration != ''){
            if(check) props += ','
            else check = true
            props += `duration: ${req.body.duration}`
        }
        if(req.body.description != ''){
            if(check) props += ','
            else check = true
            props += `description: "${req.body.description}`
        }
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.id}
            SET a += {${props}}`
        )
        res.redirect('/')
    }
}

module.exports =
{
    createTask,
    deleteTask,
    updateTask,
    createDependency
};

