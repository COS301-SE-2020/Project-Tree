var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var tq = require('./api/taskQueries')

var app = express();

app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '123456'));
var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

app.get('/', function(req,res){
    session
        .run('MATCH(n) RETURN n LIMIT 25')
        .then(function(result){
            var taskArr = [];
            result.records.forEach(function(record){
                taskArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });

            });

            res.render(__dirname + '/views/index.html', {
                tasks: taskArr,
            });
        })
        .catch(function(err){
            console.log(err);
        });
});


app.post('/task/add', tq.createTask);
app.post('/task/delete', tq.deleteTask);
app.post("/task/update", tq.updateTask)


app.listen(3030);
console.log('Server started on port 3030');

module.exports = app;