var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

async function updateProject(req,res){ //update a Project with a certain ID with specified fields
    let result = await session.run(
        `MATCH (a) WHERE ID(a) = ${req.body.up_id}
        RETURN (a)`
    )
    if(result.records.length == 0){
        res.redirect('/?error=no project of that id')
    }else{
        result = await session.run(
            `MATCH (a) WHERE ID(a) = ${req.body.up_id}
            SET a += {
                name:"${req.body.up_name}"
                description: "${req.body.up_description}"
            }`
        )
        updatePermissions(req.body)
        res.redirect('/home')
    }
}
async function createPermissions(projectID, data)
{
    await session.run(
        "MATCH (a:Project) WHERE ID(a)= "+projectID+" CREATE (a)<-[r:PERMISSIONREL]-(b: PermissionTable {projManCT:true, projManDT:true, projManUT:true, packManCT:"+data.cp_pm_Create+", packManDT:"+data.cp_pm_Delete+", packManUT:"+data.cp_pm_Update+", resPerCT:"+data.cp_rp_Create+", resPerDT:"+data.cp_rp_Delete+", resPerUT:"+data.cp_rp_Update+", resourceCT:"+data.cp_r_Create+", resourceDT:"+data.cp_r_Delete+", resourceUT:"+data.cp_r_Update+"})"
    )
}

async function updatePermissions(data)
{
    await session.run(
        "Match (a)-[r:PERMISSIONREL]->(b) WHERE ID(b) = "+data.up_id +"SET a+={projManCT:true, projManDT:true, projManUT:true, packManCT:"+data.up_pm_Create+", packManDT:"+data.up_pm_Delete+", packManUT:"+data.up_pm_Update+", resPerCT:"+data.up_rp_Create+", resPerDT:"+data.up_rp_Delete+", resPerUT:"+data.up_rp_Update+", resourceCT:"+data.up_r_Create+", resourceDT:"+data.up_r_Delete+", resourceUT:"+data.up_r_Update+"}"
    )
}

module.exports =
{
    createProject,
    deleteProject,
    updateProject
};
