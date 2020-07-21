const aws = require('aws-sdk');

let s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});
console.log(s3)

// var neo4j = require('neo4j-driver');
// let username = process.env.
// var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("apiuser", "b.itTi1EW0Ydq8.TC6VgDMZxKtzSkGD"), {encrypted: 'ENCRYPTION_ON'});

// function getSession()
// {
//    return driver.session();
// }

module.exports =
{
    getSession
};
