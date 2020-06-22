const express = require('express');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var tq = require('./api/taskQueries')
var dq = require('./api/dependencyQueries')
var pq = require('./api/projectQueries')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var driver = neo4j.driver('bolt://hobby-mhcikakdabfpgbkehagladel.dbs.graphenedb.com:24786', neo4j.auth.basic("basicuser", "b.Gfev5nJbFk0m.KsFizDJjQRcy36cR"), {encrypted: 'ENCRYPTION_ON'});
var session = driver.session();

app.get('/api/hello', (req, res) => {
  
  	res.send('Hello');
});

app.post('/api/world', async function(req, res){
	var taskArr = [];
	await session
			.run('MATCH (n) RETURN n LIMIT 25')
			.then(function(result){
				result.records.forEach(function(record){
					console.log(record._fields[0].properties.name)
					taskArr.push({
						id: record._fields[0].identity.low,
						name: record._fields[0].properties.name,
					});

				});
			})
			.catch(function(err){
				console.log(err);
			});
		console.log(taskArr[0])
	res.send({taskArr});
});

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	  
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
	  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
  }

app.listen(port, () => console.log(`Listening on port ${port}`));