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

async function updateTask(req,res){ //update a task with a certain ID with specified fields
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.ut_id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no task of that id')
    }else{
        console.log()
        let props = '';
        let check = false
        if(req.body.ut_name != ''){
            check = true
            props += `name:"${req.body.ut_name}"`
        }
        if(req.body.ut_startDate != ''){
            if(check) props += ','
            else check = true
            props += `startDate: date("${req.body.ut_startDate}")`
        }
        if(req.body.ut_endDate != ''){
            if(check) props += ','
            else check = true
            props += `endDate: date("${req.body.ut_endDate}")`
        }
        if(req.body.ut_duration != ''){
            if(check) props += ','
            else check = true
            props += `duration: ${req.body.ut_duration}`
        }
        if(req.body.ut_description != ''){
            if(check) props += ','
            else check = true
            props += `description: "${req.body.ut_description}`
        }
        console.log(props)
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.ut_id}
            SET a += {${props}}`
        )
        res.redirect('/')
    }
}

async function getSuccessorNodes(nodeID)        //gets successsor nodes
{
    const session = driver.session()
    var nodes = [];
    try {
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
    } 
    
    finally {
        await session.close();
    }

    return nodes;
}

async function getPredecessorNodes(nodeID)      //gets predecessor nodes
{
    const session = driver.session()
    var nodes = [];
    try {
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
    } 
    
    finally {
        await session.close();
    }

    return nodes;
}

async function getDependencies(nodeID)  //gets relationships in the form x---dependency--->nodeID
{
    const session = driver.session()
    var dependencies = [];
    try {
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
    } 
    
    finally {
        await session.close();
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
    const session = driver.session()
    var year = newDate[0];
    var month = newDate[1];
    var day = newDate[2];
    try {
        const result = await session.run(
            'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.startDate = date("'+year+'-'+month+'-'+day+'")'
        )
    } 
    
    finally {
        await session.close();
    }
}

async function setEndDate(nodeID)   //sets end date based on a nodes start date and duration 
{
    const session1 = driver.session()
    var endDate;
    try {
        const result1 = await session.run(
            'MATCH(n) WHERE ID(n) = '+nodeID+' return n'
        )

        startDate = [result1.records[0].get(0).properties.startDate.year.low, result1.records[0].get(0).properties.startDate.month.low, result1.records[0].get(0).properties.startDate.day.low];
        duration = result1.records[0].get(0).properties.duration.low;

        endDate = addDays(startDate[0], startDate[1], startDate[2], duration);
    } 
    
    finally {
        await session1.close();
    }

    const session2 = driver.session()
    var year = endDate[0];
    var month = endDate[1];
    var day = endDate[2];
    try {
        const result2 = await session.run(
            'MATCH(n) WHERE ID(n) = '+nodeID+' SET n.endDate = date("'+year+'-'+month+'-'+day+'")'
        )
    } 
    
    finally {
        await session2.close();
    }
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
    createTask,
    deleteTask,
    updateTask
};

