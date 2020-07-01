const db = require('./DB') 

async function getProjectTasks(req,res)
{
    var session = db.getSession();
	var projID = parseInt(req.body.id);
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
			.run('MATCH (n)-[r {projId: '+projID+'}]->(m) RETURN r')
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