var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

async function createTask(req,res){
    var Tname = req.body.task_name;
    var Sdate = req.body.start_date;
    var Edate = req.body.end_date;
    var Dur = req.body.duration;
    var Desc = req.body.description;
    await session
        .run('CREATE(n:TASK {name:$taskName, startDate: $startDate, endDate:$endDate, duration:$duration, description:$desc}) RETURN n', {taskName:Tname, startDate:Sdate, endDate:Edate, duration:Dur, desc:Desc})
        .catch(function(err){
            console.log(err);
        });
    console.log(Tname);
    res.redirect('/');
   /* CREATE (:TASK 
        {
            name:"task B", 
            startDate: date("2018-06-13"),
            endDate: date("2018-09-19"),
            duration: 6
            description:""
        }) */
}

async function deleteTask(req,res){
    var delTask = req.body.task_name;
    await session
        .run('MATCH (n:TASK{ name: $del }) DETACH DELETE n', {del:delTask})
        .catch(function(err){
            console.log(err);
        });
    console.log(delTask);
    res.redirect('/');
}

async function updateTask(req,res){
    console.log(req.body)
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.body.error = "no record of that "
        res.redirect('/')
    }else{
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.id}
            SET a = {name:"${req.body.name}", 
                startDate: date("${req.body.startDate}"), 
                endDate: date("${req.body.endDate}"), 
                duration: ${req.body.duration},
                description: "${req.body.description}"}
            RETURN (a)`
        )
        let singleRecord = result.records[0]
        let node = singleRecord.get(0)

        res.redirect('/')
    }
}

module.exports =
{
    createTask,
    deleteTask,
    updateTask
};