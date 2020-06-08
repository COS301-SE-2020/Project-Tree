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

module.exports =
{
    updateDependency
};