const db = require('./DB') 

async function createDependency(req,res){
    var session = db.getSession();
    
    if(req.body.cd_fid == req.body.cd_sid)
    {
        res.send({ret: 400})
    }

    result = await session
        .run(`  MATCH (a),(b)
                WHERE ID(a) = ${req.body.cd_fid} AND ID(b) = ${req.body.cd_sid} 
                CREATE (a)-[n:DEPENDENCY{ projId:${req.body.cd_pid}, relationshipType:'${req.body.cd_relationshipType}', duration:${req.body.cd_duration}}]->(b) 
                RETURN *
            `)
        .catch(function(err){
            return err;
        });
    await updateDependencies(req.body.cd_sid)
    res.send({ret: result});
}

async function updateDependency(req,res){ //update a Dependency between 2 nodes with specified fields
    var session = db.getSession();
    result = await session.run(
        `MATCH (a)-[r]->(b) 
        WHERE ID(r) = ${req.body.ud_did}
        SET r += { duration:${req.body.ud_duration}, relationshipType: "${req.body.ud_relationshipType}" }
        RETURN *
        `)
    await updateDependencies(result.records[0]._fields[1].identity.low)
    res.send({ret: result});
    
}

async function deleteDependency(req,res){
    var session = db.getSession();
    var result =  await session
        .run
		(`
            MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) 
            WHERE ID(r)=${req.body.dd_did} 
            DELETE r 
            RETURN *
		`)
        .catch(function(err){
            res.send({ret: result});
        });
    await updateDependencies(result.records[0]._fields[0].identity.low)
    await updateDependencies(result.records[0]._fields[1].identity.low)
    res.send({ret: result});
}

async function getSuccessorNodes(nodeID)        //gets successsor nodes
{
    var session = db.getSession();
    var nodes = [];
    const result = await session.run(
        'MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) WHERE ID(a) = ' + nodeID +' RETURN b'
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
    var session = db.getSession();
    var nodes = [];
    const result = await session.run(
        'MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) WHERE ID(b) = ' + nodeID +' RETURN a'
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
    var session = db.getSession();
    var dependencies = [];
    const result = await session.run(
        'MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) WHERE ID(b) = ' + nodeID +' RETURN r'
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
    var session = db.getSession();
    var year = newDate[0];
    if(newDate[0]<10)
        year = "0"+ newDate[0]
    var month = newDate[1];
    if(newDate[0]<10)
        month = "0"+newDate[1]
    var day = newDate[2];
    if(newDate[0]<10)
        day = "0"+newDate[2]
    const result = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.startDate = date("'+year+'-'+month+'-'+day+'")'
    )

}

async function setEndDate(nodeID)   //sets end date based on a nodes start date and duration 
{
    var session = db.getSession();
    var endDate;
    const result1 = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' return n'
    )

    startDate = [result1.records[0].get(0).properties.startDate.year.low, result1.records[0].get(0).properties.startDate.month.low, result1.records[0].get(0).properties.startDate.day.low];
    duration = parseInt(result1.records[0].get(0).properties.duration);
    
    endDate = addDays(startDate[0], startDate[1], startDate[2], duration);
    
    var year = endDate[0];
    if(endDate[0]<10)
        year = "0"+endDate[0]
    var month = endDate[1];
    if(endDate[0]<10)
        month = "0"+endDate[1]
    var day = endDate[2];
    if(endDate[0]<10)
        day = "0"+endDate[2]
    var finaldate = year+"-"+month+"-"+day
    const result2 = await session.run(
        'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.endDate = date("'+year+'-'+month+'-'+day+'")'
    )
}

async function updateDependencies(currentNodeID)
{
    console.log("HELLO" + currentNodeID)
    var predecessors = await getPredecessorNodes(currentNodeID);
    var successors = await getSuccessorNodes(currentNodeID);
    var dependencies = await getDependencies(currentNodeID);  //dependencies of the form B->CurrentNode s

    if(predecessors != 0)
    {
        var tempLatestDate = [2000, 1, 1];

        for(var x=0; x<predecessors.length; x++)
        {
            var relType = dependencies[x].properties.relationshipType;
            var relDuration = parseInt(dependencies[x].properties.duration);
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