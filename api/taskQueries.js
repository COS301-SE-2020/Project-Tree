var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

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

module.exports =
{
	deleteTask
};