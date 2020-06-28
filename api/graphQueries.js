var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

async function getProjectTasks(req,res)
{
    var projID = req.body.id;
	var taskArr = [];
	var relArr = [];
	await session
			.run('MATCH (n {projId:'+projID+'}) RETURN n')
			.then(function(result){
                var x = 0;
				result.records.forEach(function(record){
					taskArr.push({
                        record
                    });
				});
			})
			.catch(function(err){
				console.log(err);
			});
	await session
			.run('MATCH (n)-[r {projId: 1}]->(m) RETURN r')
			.then(function(result){
                var x = 0;
				result.records.forEach(function(record){
					relArr.push({
                        record
                    });
				});
				
			})
			.catch(function(err){
				console.log(err);
            });
	res.send({tasks: taskArr, rels: relArr});
}

module.exports = {
    getProjectTasks
}