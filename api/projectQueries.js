var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();
//var dependencyFunctions = require('./dependencyQueries');

async function createProject(req,res)
{
    var Pname = req.body.cp_Name;
	console.log(Pname);
    var Desc = req.body.cp_Description;
	var pmC = req.body.cp_pm_Create;
	var pmD = req.body.cp_pm_Delete;
	var pmU = req.body.cp_pm_Update	;		
    var rpC = req.body.cp_rp_Create  ;           
    var rpD = req.body.cp_rp_Delete   ;        
    var rpU = req.body.cp_rp_Update  ;
	var rC = req.body.cp_r_Create ;
	var rD = req.body.cp_r_Delete ;
	var rU = req.body.cp_r_Update	;
	console.log(rU)	
	console.log(pmC)	
    let result = await session
        .run('CREATE(n:Project {name:$projectName, description:$desc}) RETURN ID(n)', {projectName:Pname, desc:Desc})
        .catch(function(err){
            console.log(err);
        });
	//createPermissions(projectID, req.body);
    res.redirect('/home');
	
}

module.exports =
{
    createProject  
};

