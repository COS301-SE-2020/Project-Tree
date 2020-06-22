var PORT = process.env.PORT || 3030
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var tq = require('./api/taskQueries')
var dq = require('./api/dependencyQueries')

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
        .run('MATCH (n) RETURN n LIMIT 25')
        .then(function(result){
            var taskArr = [];
            var updateobj = [];
            result.records.forEach(function(record){
                taskArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    startDate: record._fields[0].properties.startDate,
                    endDate: record._fields[0].properties.endDate,
                    duration: record._fields[0].properties.duration,
                    description: record._fields[0].properties.description
                });

            });
            if(req.query.ut_id_select != undefined){
                session
                    .run(`MATCH (n) WHERE ID(n) = ${req.query.ut_id_select} RETURN n`)
                    .then(function(result){
                        console.log(result.records[0]._fields[0].properties.name)
                        result.records.forEach(function(record){
                            updateobj.push({
                                id: record._fields[0].identity.low,
                                name: record._fields[0].properties.name,
                                startDate: record._fields[0].properties.startDate,
                                duration: record._fields[0].properties.duration,
                                endDate: record._fields[0].properties.endDate,
                                description: record._fields[0].properties.description,
                            });
                        });
                        session
                          .run('MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) RETURN r')
                          .then(function(result){
                              var dependencyArr = [];
                              result.records.forEach(function(record){
                                  dependencyArr.push({
                                      startId: record.get(0).start.low,
                                      endId: record.get(0).end.low,
                                      duration: record.get(0).properties.duration,
                                      relType: record.get(0).properties.relationshipType
                                  });
                              });
                              res.render(__dirname + '/views/index.html', {
                                  tasks: taskArr,
                                  updateobj: updateobj,
                                  req,
                                  dependencies: dependencyArr
                              });
                          });
                    })
            }else{
              updateobj.push({
                id: 0,
                name: '',
                startDate: null,
                duration: 0,
                endDate: null,
                description: '',
              });
              session
                .run(' MATCH (a:Task)-[r:DEPENDENCY]->(b:Task) RETURN r')
                .then(function(result){
                    var dependencyArr = [];
                    result.records.forEach(function(record){
                        dependencyArr.push({
                            startId: record.get(0).start.low,
                            endId: record.get(0).end.low,
                            duration: record.get(0).properties.duration,
                            relType: record.get(0).properties.relationshipType
                        });
                    });
                    res.render(__dirname + '/views/index.html', {
                        tasks: taskArr,
                        updateobj: updateobj,
                        req,
                        dependencies: dependencyArr
                    });
                });
            }
        })
        .catch(function(err){
            console.log(err);
        });
});


app.post('/task/add', tq.createTask);
app.post('/task/delete', tq.deleteTask);
app.post("/task/update", tq.updateTask)
app.post("/dependency/add", dq.createDependency)
app.post("/dependency/update", dq.updateDependency)
app.post('/dependency/delete', dq.deleteDependency);


app.listen(PORT);
console.log('Server started on port ' + PORT);

module.exports = app;