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
    var delTask = req.body.id;
    await session
        .run(`MATCH (n) WHERE ID(n)=${req.body.id} DETACH DELETE (n)`)
        .catch(function(err){
            console.log(err);
        });
    console.log(delTask);
    res.redirect('/');
}

module.exports =
{
	deleteTask,
  createTask
};