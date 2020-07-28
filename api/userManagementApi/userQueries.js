const db = require('../DB');
const { JWT } = require('jose');
const bcrypt = require('bcrypt');

function login(req,res){ //email, password, 
    db.getSession()
    .run(`
            Match (n:User { email: "${req.query.email}" })
            RETURN n.password
        `)
    .then(result => {
        let hash = result.records[0]._fields[0];
        bcrypt.compare(req.query.password, hash, function(err, result) {
            if(result){
                res.status(200);
                res.send({sessionToken : JWT.sign({email: req.query.email, hash}, process.env.ACCESS_TOKEN_SECRET)});
            }else{
                res.send("error")
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400);
        res.send(err);
    })
}

function register(req,res){ //email, password, name, surname
    db.getSession()
        .run(`
                Match (n:User { email: "${req.query.email}" })
                RETURN n
            `)
        .then(result => {
            if(result.records.length != 0) res.send("already a user")
            else{
                bcrypt.hash(req.query.password, 10, function(err, hash) {
                    db.getSession()
                    .run(`
                            CREATE(a:User {
                                email:"${req.query.email}",
                                password:"${hash}", 
                                name:"${req.query.name}",
                                sname:"${req.query.sname}"
                            })
                            RETURN a
                        `)
                    .then(result => {
                        res.status(200);
                        res.send({sessionToken : JWT.sign({email: req.query.email, hash}, process.env.ACCESS_TOKEN_SECRET)});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400);
                        res.send(err);
                    })
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.send(err);
        });
}

function updateInfo(){

}

function verify(token, res){
    var session = db.getSession();
    try {
        var temp = JWT.verify(token.query.token, process.env.ACCESS_TOKEN_SECRET, { maxTokenAge: '10 min' });
        //if(temp.user !== "j") throw error
        res.send("correct token");
    } catch (error) {
        res.send("incorrect token")
    }
}


module.exports =
{
    login,
    register,
    updateInfo,
    verify
};