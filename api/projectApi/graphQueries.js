const db = require('../DB') 

async function getProjectTasks(req,res)
{
    var session = db.getSession();
	var projID = parseInt(req.body.id);
	var taskArr = [];
	var relArr = [];
	await session
			.run('MATCH (n {projId:'+projID+'}) RETURN n')
			.then(function(result){
				result.records.forEach(function(record){
					taskArr.push({
                        id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name,
						description: record._fields[0].properties.description,
						startDate: record._fields[0].properties.startDate,
						endDate: record._fields[0].properties.endDate,
						duration: record._fields[0].properties.duration.low,
						progress: record._fields[0].properties.progress,
                    });
				});
			})
			.catch(function(err){
				console.log(err);
			});
	await session
			.run('MATCH (n)-[r {projId: '+projID+'}]->(m) RETURN r')
			.then(function(result){
				result.records.forEach(function(record){
					relArr.push({
						id: record._fields[0].identity.low,
						duration: record._fields[0].properties.duration.low,
						relationshipType: record._fields[0].properties.relationshipType,
						source: record._fields[0].start.low,
						target: record._fields[0].end.low
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