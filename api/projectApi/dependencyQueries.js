const db = require('../DB') 
var updateProject = require('./updateProject')

async function createDependency(req,res){
    var session = db.getSession();
    var relArr = [];

    result = await session
        .run(`  MATCH (a),(b)
                WHERE ID(a) = ${req.body.changedInfo.cd_fid} AND ID(b) = ${req.body.changedInfo.cd_sid} 
                CREATE (a)-[n:DEPENDENCY{ projId:${req.body.changedInfo.cd_pid}, relationshipType:'${req.body.changedInfo.cd_relationshipType}', duration:${req.body.changedInfo.cd_duration}}]->(b) 
                RETURN n
            `)
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


    let changedRel = relArr[0];
    let queriesArray = [];
    req.body.rels.push(changedRel);

    await updateProject.updateProject(changedRel.target, req.body.nodes, req.body.rels, queriesArray);
    res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:null, displayRel: changedRel.id});
    updateProject.excecuteQueries(queriesArray)
}

async function updateDependency(req,res){ //update a Dependency between 2 nodes with specified fields
    var session = db.getSession();
    var relArr = [];

    result = await session.run(
        `MATCH (a)-[r]->(b) 
        WHERE ID(r) = ${req.body.changedInfo.ud_did}
        SET r += { duration:${req.body.changedInfo.ud_duration}, relationshipType: "${req.body.changedInfo.ud_relationshipType}" }
        RETURN r
        `)
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

    let changedRel = relArr[0]
    for(var x=0; x<req.body.rels.length; x++){
        if(req.body.rels[x].id == changedRel.id)
        {
            req.body.rels[x] = changedRel
        }
    }

    let queriesArray = []

    await updateProject.updateProject(changedRel.target, req.body.nodes, req.body.rels, queriesArray)
    res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:null, displayRel: changedRel.id})
    updateProject.excecuteQueries(queriesArray)
}

async function deleteDependency(req,res){
    var session = db.getSession();
    var result =  await session
        .run
		(`
            MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) 
            WHERE ID(r)=${req.body.changedInfo.dd_did} 
            DELETE r 
            RETURN *
		`)
        .catch(function(err){
            res.send({ret: result});
        });

    let queriesArray = [];
    var rel
    
    for(var x=0; x<req.body.rels.length; x++)
    {
        if(req.body.rels[x].id == req.body.changedInfo.dd_did)
        {
            rel = req.body.rels[x]

            if(x == 0){
                req.body.rels.shift();
            }

            else{
                req.body.rels.splice(x, x)
            }
        }
    }

    await updateProject.updateProject(rel.target, req.body.nodes, req.body.rels, queriesArray);

    res.send({nodes: req.body.nodes, rels: req.body.rels, displayNode:null, displayRel: null});
    updateProject.excecuteQueries(queriesArray)
}


module.exports =
{
    updateDependency,
    deleteDependency,
    createDependency,
};