var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});

async function createProject(req,res)
{
    var session = driver.session();
    var taskArr = [];
    var Pname = req.body.cp_Name;
    var Desc = req.body.cp_Description;
    var data = req.body;
    data.cp_pm_Create != undefined ? cp_pm_Create = true: cp_pm_Create = false;
    data.cp_pm_Delete != undefined ? cp_pm_Delete = true: cp_pm_Delete = false;
    data.cp_pm_Update != undefined ? cp_pm_Update = true: cp_pm_Update = false;
    data.cp_rp_Create != undefined ? cp_rp_Create = true: cp_rp_Create = false;
    data.cp_rp_Delete != undefined ? cp_rp_Delete = true: cp_rp_Delete = false;
    data.cp_rp_Update != undefined ? cp_rp_Update = true: cp_rp_Update = false;
    data.cp_r_Create != undefined ? cp_r_Create = true: cp_r_Create = false;
    data.cp_r_Delete != undefined ? cp_r_Delete = true: cp_r_Delete = false;
    data.cp_r_Update != undefined ? cp_r_Update = true: cp_r_Update = false;

    let result = await session
        .run('CREATE(n:Project {name:$projectName, description:$desc, projManCT:true, projManDT:true, projManUT:true, packManCT:'+cp_pm_Create+', packManDT:'+cp_pm_Delete+', packManUT:'+cp_pm_Update+', resPerCT:'+cp_rp_Create+', resPerDT:'+cp_rp_Delete+', resPerUT:'+cp_rp_Update+', resourceCT:'+cp_r_Create+', resourceDT:'+cp_r_Delete+', resourceUT:'+cp_r_Update+'}) RETURN n', {projectName:Pname, desc:Desc})
        .then(function(result){
            result.records.forEach(function(record){
                taskArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    description: record._fields[0].properties.description,
                    permissions: [record._fields[0].properties.packManCT, record._fields[0].properties.packManDT, record._fields[0].properties.packManUT, record._fields[0].properties.resPerCT, record._fields[0].properties.resPerDT, record._fields[0].properties.resPerUT, record._fields[0].properties.resourceCT, record._fields[0].properties.resourceDT, record._fields[0].properties.resourceUT]
                });
    
            });
        })
        .catch(function(err){
            console.log(err);
        });
        res.send({nodes: taskArr[0]});
}

async function deleteProject(req, res){
    var session = driver.session();
    var Pid = req.body.dp_id
    let result = await session
        .run('MATCH(n:Project) WHERE ID(n)= '+Pid+' DETACH DELETE n RETURN n')
        .catch(function(err){
            console.log(err);
        });
        res.send({ret: result});
}

async function updateProject(req,res){
    var session = driver.session();
    var taskArr = [];
    req.body.up_pm_Create != undefined ? up_pm_Create = true: up_pm_Create = false;
    req.body.up_pm_Delete != undefined ? up_pm_Delete = true: up_pm_Delete = false;
    req.body.up_pm_Update != undefined ? up_pm_Update = true: up_pm_Update = false;
    req.body.up_rp_Create != undefined ? up_rp_Create = true: up_rp_Create = false;
    req.body.up_rp_Delete != undefined ? up_rp_Delete = true: up_rp_Delete = false;
    req.body.up_rp_Update != undefined ? up_rp_Update = true: up_rp_Update = false;
    req.body.up_r_Create != undefined ? up_r_Create = true: up_r_Create = false;
    req.body.up_r_Delete != undefined ? up_r_Delete = true: up_r_Delete = false;
    req.body.up_r_Update != undefined ? up_r_Update = true: up_r_Update = false;
    result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.up_id}
        SET a += {
            name:"${req.body.up_name}",
            description:"${req.body.up_description}",
            projManCT:true, 
            projManDT:true, 
            projManUT:true, 
            packManCT:${up_pm_Create}, 
            packManDT:${up_pm_Delete}, 
            packManUT:${up_pm_Update}, 
            resPerCT:${up_rp_Create}, 
            resPerDT:${up_rp_Delete}, 
            resPerUT:${up_rp_Update}, 
            resourceCT:${up_r_Create}, 
            resourceDT:${up_r_Delete}, 
            resourceUT:${up_r_Update}
        } RETURN a`
    )
    .then(function(result){
        result.records.forEach(function(record){
            taskArr.push({
                id: record._fields[0].identity.low,
                name: record._fields[0].properties.name,
                description: record._fields[0].properties.description,
                permissions: [record._fields[0].properties.packManCT, record._fields[0].properties.packManDT, record._fields[0].properties.packManUT, record._fields[0].properties.resPerCT, record._fields[0].properties.resPerDT, record._fields[0].properties.resPerUT, record._fields[0].properties.resourceCT, record._fields[0].properties.resourceDT, record._fields[0].properties.resourceUT]
            });

        });
    })
    .catch(function(err){
        console.log(err);
    });
    res.send({nodes: taskArr[0]});
}

async function getProjects(req, res){
    var session = driver.session();
	var taskArr = [];
	await session
			.run('MATCH (n:Project) RETURN n')
			.then(function(result){
				result.records.forEach(function(record){
					taskArr.push({
						id: record._fields[0].identity.low,
                        name: record._fields[0].properties.name,
                        description: record._fields[0].properties.description,
                        permissions: [record._fields[0].properties.packManCT, record._fields[0].properties.packManDT, record._fields[0].properties.packManUT, record._fields[0].properties.resPerCT, record._fields[0].properties.resPerDT, record._fields[0].properties.resPerUT, record._fields[0].properties.resourceCT, record._fields[0].properties.resourceDT, record._fields[0].properties.resourceUT]
					});

				});
			})
			.catch(function(err){
				console.log(err);
			});
	res.send({nodes: taskArr});
};

async function getProject(req, res){
    var session = driver.session();
	var taskArr = [];
	// await session
	// 		.run('MATCH (n:Task {projId:'+projectID+'}) RETURN n')
	// 		.then(function(result){
	// 			result.records.forEach(function(record){
	// 				taskArr.push({
	// 					id: record._fields[0].identity.low,
    //                     name: record._fields[0].properties.name,
    //                     description: record._fields[0].properties.description,
    //                     permissions: [record._fields[0].properties.packManCT, record._fields[0].properties.packManDT, record._fields[0].properties.packManUT, record._fields[0].properties.resPerCT, record._fields[0].properties.resPerDT, record._fields[0].properties.resPerUT, record._fields[0].properties.resourceCT, record._fields[0].properties.resourceDT, record._fields[0].properties.resourceUT]
	// 				});

	// 			});
	// 		})
	// 		.catch(function(err){
	// 			console.log(err);
	// 		});
	res.send("hello");
};

module.exports =
{
    createProject,
    deleteProject,
    updateProject,
    getProjects
};
