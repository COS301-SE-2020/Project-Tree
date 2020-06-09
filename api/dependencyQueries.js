var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

async function updateDependency(req,res){ //update a Dependency with a certain ID with specified fields
    let result = await session.run(
        `MATCH ()-[r]-() WHERE ID(r) = ${req.body.id}
        RETURN r`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no dependency of that id')
    }else{
        let props = '';
        let check = false
        if(req.body.duration != ''){
            check = true
            props += `duration:${req.body.duration}`
        }
        if(req.body.relationshipType != ''){
            if(check) props += ','
            else check = true
            props += `relationshipType: "${req.body.relationshipType}"`
        }
        result = await session.run(
            `MATCH ()-[r]-() 
            WHERE id(r)=${req.body.id}
            SET r += {${props}}`
        )
        res.redirect('/')
    }
}

async function deleteDependency(req,res){
    var delTask = req.body.dep1;
    await session
        .run
		(`
			MATCH (a:TASK)-[r:DEPENDENCY]->(b:TASK) WHERE (ID(a)=${req.body.dep1} AND ID(b)=${req.body.dep2}) OR (ID(a)=${req.body.dep2} AND ID(b)=${req.body.dep1}) DELETE r	
		`)
        .catch(function(err){
            console.log(err);
        });
    console.log(delTask);
    res.redirect('/');
}



async function createDependency(req,res){
    var firstTask = parseInt(req.body.cd_firstTaskId)
    var secondTask = parseInt(req.body.cd_secondTaskId)
    var relationshipType = req.body.cd_relationshipType
    var Dduration = req.body.cd_dependencyDuration

    await session
        .run('MATCH (a),(b) WHERE ID(a) = $Ftask AND ID(b) = $Stask CREATE(a)-[n:DEPENDENCY{relationshipType:$Rtype, duration:$duration}]->(b) RETURN type(n)',{Ftask:firstTask,Stask:secondTask, Rtype:relationshipType, duration:Dduration})
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
}

async function getSuccessorNodes(nodeID)        //gets successsor nodes
{
    var nodes = [];
    const result = await session.run(
        'MATCH (a:TASK)-[r:DEPENDENCY]->(b:TASK) WHERE ID(a) = ' + nodeID +' RETURN b'
    )

    if(result.records.length == 0)
    {
        return 0;   //no successors
    }
    
    records = result.records;
    for(var x=0; x<records.length; x++)
    {
        nodes.push(records[x].get(0));
    }

    return nodes;
}

async function getPredecessorNodes(nodeID)      //gets predecessor nodes
{
    var nodes = [];
    const result = await session.run(
        'MATCH (a:TASK)-[r:DEPENDENCY]->(b:TASK) WHERE ID(b) = ' + nodeID +' RETURN a'
    )

    if(result.records.length == 0)
    {
        return 0;   //no predecessors
    }
    
    records = result.records;
    for(var x=0; x<records.length; x++)
    {
        nodes.push(records[x].get(0));
    }

    return nodes;
}

async function getDependencies(nodeID)  //gets relationships in the form x---dependency--->nodeID
{
    var dependencies = [];
    const result = await session.run(
        'MATCH (a:TASK)-[r:DEPENDENCY]->(b:TASK) WHERE ID(b) = ' + nodeID +' RETURN r'
    )

    if(result.records.length == 0)
    {
        return 0;   //no predecessors
    }
    
    records = result.records;
    for(var x=0; x<records.length; x++)
    {
        dependencies.push(records[x].get(0));
    }

    return dependencies;
}

function compareDates(year1, month1, day1, year2, month2, day2)     //returns 1 if date1 < date2, otherwise returns 0
{
    date1 = new Date(year1, month1, day1);
    date2 = new Date(year2, month2, day2);

    if(date1<date2)
    {
        return 1    //sencond date is after first
    }

    else if(date2<date1)
    {
        return 0;   //first date is after second
    }

    else
    {
        return 0    //does not matter what is returned as they are equal
    }
}

function addDays(year, month, day, duration) {      //adds days to a date to generate new date in the form [year, month, day]
    var initialDate = new Date(year, (month-1), day);
    const copy = new Date(Number(initialDate))
    copy.setDate(initialDate.getDate() + duration)
    dateWithDuration = [copy.getFullYear(), copy.getMonth()+1, copy.getDate()]
    return dateWithDuration
}

async function setStartDate(newDate, nodeID)    //provided with a date, sets a new start date
{
    var year = newDate[0];
    var month = newDate[1];
    var day = newDate[2];
    const result = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.startDate = date("'+year+'-'+month+'-'+day+'")'
    )

}

async function setEndDate(nodeID)   //sets end date based on a nodes start date and duration 
{
    var endDate;
    const result1 = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' return n'
    )

    startDate = [result1.records[0].get(0).properties.startDate.year.low, result1.records[0].get(0).properties.startDate.month.low, result1.records[0].get(0).properties.startDate.day.low];
    duration = result1.records[0].get(0).properties.duration.low;

    endDate = addDays(startDate[0], startDate[1], startDate[2], duration);
    
    var year = endDate[0];
    var month = endDate[1];
    var day = endDate[2];
    const result2 = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.endDate = date("'+year+'-'+month+'-'+day+'")'
    )
}

async function updateDependencies(currentNodeID)
{
    var predecessors = await getPredecessorNodes(currentNodeID);
    var successors = await getSuccessorNodes(currentNodeID);
    var dependencies = await getDependencies(currentNodeID);  //dependencies of the form B->CurrentNode s

    if(predecessors != 0)
    {
        var tempLatestDate = [2000, 1, 1];

        for(var x=0; x<predecessors.length; x++)
        {
            var relType = dependencies[x].properties.relationshipType;
            var relDuration = dependencies[x].properties.duration.low;
            var relativeDate;

            if(relType == "fs")
            {
                relativeDate = predecessors[x].properties.endDate
            }

            else
            {
                relativeDate = predecessors[x].properties.startDate
            }
            
            var newTempDate = addDays(relativeDate.year.low, relativeDate.month.low, relativeDate.day.low, relDuration)

            if(compareDates(tempLatestDate[0], tempLatestDate[1], tempLatestDate[2], newTempDate[0], newTempDate[1], newTempDate[2]) == 1)
            {
                tempLatestDate = newTempDate;
            }
        }

        await setStartDate(tempLatestDate, currentNodeID);
        await setEndDate(currentNodeID);
    }

    if(successors != 0)
    {
        for(var x=0; x<successors.length; x++)
        {
            successorID = successors[x].identity.low;
            await updateDependencies(successorID);
        }
    }
}

module.exports =
{
    updateDependency,
    deleteDependency,
    createDependency,

    getSuccessorNodes,
    getPredecessorNodes,
    getDependencies,
    compareDates,
    addDays,
    updateDependencies
};