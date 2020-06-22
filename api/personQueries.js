var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

async function addResponsiblePerson(taskId,personId){
    await session
        .run('MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:RESPONSIBLE_PERSON]->(b)',{personId:personId,taskId:taskId})
        .catch(function(err){
            console.log(err);
        });
}

async function addPackageManager(taskId,personId){
    await session
        .run('MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:PACKAGE_MANAGER]->(b)',{personId:personId,taskId:taskId})
        .catch(function(err){
            console.log(err);
        });
}

async function addResources(taskId,personId){
    var people = personId.split(',');
    for(var x = 0; x < people.length; x++)
    {
        await session
            .run('MATCH (a:Person),(b:Task) WHERE ID(a) = $personId AND ID(b) = $taskId CREATE(a)-[n:RESOURCE]->(b)',{personId:parseInt(people[x]),taskId:taskId})
            .catch(function(err){
                console.log(err);
            });
    }
}

module.exports = {
    addResponsiblePerson,
    addPackageManager,
    addResources
}