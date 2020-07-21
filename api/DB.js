require('dotenv').config()

var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD), {encrypted: 'ENCRYPTION_ON'});

function getSession()
{
   return driver.session();
}

module.exports =
{
    getSession
};
