const db = require('../DB') 
var dependencyFunctions = require('./dependencyQueries');
var peopleFunctions = require('./personQueries')
var updateProject = require('./updateProject');
const { update } = require('lodash');

async function createTask(req,res){
    var session = db.getSession();
    var taskArr = [];
    var proj = parseInt(req.body.changedInfo.ct_pid);
    var status = "Incomplete"
    var result = await session
        .run
        (`
            MATCH (b) WHERE ID(b) = ${proj} CREATE(a:Task {name:"${req.body.changedInfo.ct_Name}", startDate: date("${req.body.changedInfo.ct_startDate}"), endDate:date("${req.body.changedInfo.ct_endDate}"), duration:${req.body.changedInfo.ct_duration}, description:"${req.body.changedInfo.ct_description}", projId:${req.body.changedInfo.ct_pid}, progress:"${status}"})-[n:PART_OF]->(b) RETURN a
        `)
        .then(function(result){
            result.records.forEach(function(record){
                taskArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    description: record._fields[0].properties.description,
                    startDate: record._fields[0].properties.startDate,
                    endDate: record._fields[0].properties.endDate,
                    duration: record._fields[0].properties.duration.low,
                    progress: record._fields[0].properties.progress
                });
    
            });
        })
        .catch(function(err){
            console.log(err);
        });

    req.body.nodes.push(taskArr[0])
    res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:taskArr[0].id, displayRel: null});
}

async function deleteTask(req,res){
    var session = db.getSession();
    let successors = updateProject.getSuccessors(req.body.changedInfo.id, req.body.nodes, req.body.rels)
    
    var result = await session
        .run
		(`
			MATCH (n) WHERE ID(n)=${req.body.changedInfo.id} DETACH DELETE (n)		
		`)
        .catch(function(err){
            console.log(err)
        })
    
    for(var x=0; x<req.body.nodes.length; x++)
    {
        if(req.body.nodes[x].id == req.body.changedInfo.id)
        {
            req.body.nodes[x] = null
        }
    }

    var tempArr=[]
    for(var x=0; x<req.body.nodes.length; x++)
    {
        if(req.body.nodes[x]!= null)
        {
            tempArr.push(req.body.nodes[x])
        }
    }
    req.body.nodes = tempArr

    for(var x=0; x<req.body.rels.length; x++)
    {
        if(req.body.rels[x].target == req.body.changedInfo.id || req.body.rels[x].source == req.body.changedInfo.id)
        {
            req.body.rels[x] = null;
        }
    }

    tempArr=[]
    for(var x=0; x<req.body.rels.length; x++)
    {
        if(req.body.rels[x]!= null)
        {
            tempArr.push(req.body.rels[x])
        }
    }
    req.body.rels = tempArr

    let queriesArray = []
    for(var x=0; x<successors.length; x++)
    {
        await updateProject.updateProject(successors[x].id, req.body.nodes, req.body.rels, queriesArray)
    }

    res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:null, displayRel: null})
    updateProject.excecuteQueries(queriesArray)
}

async function updateTask(req,res){ //update a task with a certain ID with specified fields
    var session = db.getSession()
    var taskArr = []
    
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.changedInfo.ut_id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no task of that id')
    }
    
    else{
        let upDep = false;
        if(result.records[0]._fields[0].properties.startDate != req.body.changedInfo.ut_startDate ||
            result.records[0]._fields[0].properties.duration != req.body.changedInfo.ut_duration ) upDep = true;
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.changedInfo.ut_id}
            SET a += {
                name:"${req.body.changedInfo.ut_name}",
                startDate: date("${req.body.changedInfo.ut_startDate}"),
                duration: ${req.body.changedInfo.ut_duration},
                endDate: date("${req.body.changedInfo.ut_endDate}"),
                description: "${req.body.changedInfo.ut_description}"
            }
            RETURN a`
        )
        .then(function(result){
            result.records.forEach(function(record){
                taskArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    description: record._fields[0].properties.description,
                    startDate: record._fields[0].properties.startDate,
                    endDate: record._fields[0].properties.endDate,
                    duration: record._fields[0].properties.duration.low,
                    progress: record._fields[0].properties.progress
                })
    
            })
        })
        .catch(function(err){
            console.log(err);
        })

        let changedTask = taskArr[0]
        for(var x=0; x<req.body.nodes.length; x++){
            if(req.body.nodes[x].id == changedTask.id)
            {
                req.body.nodes[x] = changedTask
            }
        }

        let queriesArray = []
        if(upDep == true){
            await updateProject.updateProject(changedTask.id, req.body.nodes, req.body.rels, queriesArray)
        }

        res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:changedTask.id, displayRel: null})
        updateProject.excecuteQueries(queriesArray)
    }
}

async function updateProgress(req,res){
    var session = db.getSession();

    var result = await session.run(
        `
            MATCH (n)
            WHERE ID(n) = ${req.body.id}
            SET n.progress = toString("${req.body.progress}")
            RETURN n
        `
    )
    res.send({ret: result})
}

module.exports =
{
    createTask,
    deleteTask,
    updateTask,
    updateProgress
};

