const db = require('../DB');
const { JWT } = require('jose');
const bcrypt = require('bcrypt');

function login(req,res){ //email, password,
    db.getSession()
    .run(`
            Match (n:User { email: "${req.body.email}" })
            RETURN n
        `)
    .then(result => {
        let id = (result.records[0]._fields[0].identity.low)
        if(result.records.length != 0){
            let hash = result.records[0]._fields[0].properties.password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if(result){
                    //console.log("JERE")
                    res.status(200);
                    res.send({
                        sessionToken : JWT.sign({email: req.body.email, hash}, process.env.ACCESS_TOKEN_SECRET), 
                        status: true,
                        id : id
                    });
                }else
                {
                    res.send({
                        status: false,
                        err:err
                    })
                }
            });
        }else{
            res.send('err')
        }
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
                Match (n:User { email: "${req.body.email}" })
                RETURN n
            `)
        .then(result => {
            if(result.records.length != 0) res.send("Already a user")
            else{
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    db.getSession()
                    .run(`
                            CREATE(a:User {
                                email:"${req.body.email}",
                                password:"${hash}", 
                                name:"${req.body.name}",
                                sname:"${req.body.sname}"
                            })
                            RETURN a
                        `)
                    .then(result => {
                        let id = (result.records[0]._fields[0].identity.low)
                        console.log(req.body.email, hash)
                        res.status(200);
                        res.send({
                            sessionToken : JWT.sign({email: req.body.email, hash}, process.env.ACCESS_TOKEN_SECRET), 
                            status: true,
                            id : id
                        });
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

function updateInfo()
{

}

function verify(req, res){
    console.log(req.body.foo)
    try {
        var user = JWT.verify(req, process.env.ACCESS_TOKEN_SECRET, { maxTokenAge: '1440 min' });
        console.log("user")
        db.getSession()
        .run(`
                Match (n:User { email: "${user.email}" })
                RETURN n
            `)
        .then(result => {
            if(user.password == result.records[0]._fields[0].password){
                res.send(result.records[0]._fields[0].identity.low);
            }else{
                res.send(null);
            }
        })
        .catch(err => 
        {
            res.send(null);
        });
    } catch (err) 
    {
        res.send(null);
    }
}


module.exports =
{
    login,
    register,
    updateInfo,
    verify
};