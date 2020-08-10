const db = require('../DB');
const { JWT } = require('jose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path')



function login(req,res){ //email, password,
    db.getSession()
    .run(`
            Match (n:User { email: "${req.body.email}" })
            RETURN n
        `)
    .then(result => {
        console.log(result.records[0])
        let id = (result.records[0]._fields[0].identity.low)
        if(result.records.length != 0){
            let hash = result.records[0]._fields[0].properties.password;
            console.log()
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if(result){
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


async function register(req,res){ //email, password, name, surname
    let x = "storage/default.jpg"
    console.log(path.dirname)
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
                                sname:"${req.body.sname}",
                                birthday: "${req.body.um_date}",
                                profilepicture: "${x}"
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

async function editUser(req, res) {
    
    let creator = await verify(req.body.ct_pid);
    creator = " "
    if(creator!=null)
    {
        db.getSession()
        .run(
            `
            MATCH (a) 
            WHERE ID(a) = ${req.body.userId}
            SET a += {
                name:"${req.body.name}",
                sname:"${req.body.sname}",
                email:"${req.body.email}",
                birthday:"${req.body.bday}"
            } 
            RETURN a
          `
        )
        .then(result => {
            console.log(result.records[0]._fields[0].properties)
            let user={
                id: result.records[0]._fields[0].identity.low,
                name: result.records[0]._fields[0].properties.name,
                sname: result.records[0]._fields[0].properties.sname,
                email: result.records[0]._fields[0].properties.email,
                birthday: result.records[0]._fields[0].properties.bday
            }
            res.status(200);
            res.send({user});
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.send(err);
          });
    }
    else
    {
        res.status(400)
        res.send({user:null})
    }
}

async function getUser(req,res)
{
    let creator = await verify(req.body.creatorID);
    console.log(req.body.creatorID)
      if ( creator != null ) {
        db.getSession()
        .run(
        `
            MATCH (u:User) 
            WHERE ID(u) = ${creator} 
            RETURN u
        `
        )
        .then(result => {
            console.log(result.records[0]._fields[0].properties)
            let user={
                id: result.records[0]._fields[0].identity.low,
                name: result.records[0]._fields[0].properties.name,
                sname: result.records[0]._fields[0].properties.sname,
                email: result.records[0]._fields[0].properties.email,
                birthday: result.records[0]._fields[0].properties.birthday,
                profilepicture: result.records[0]._fields[0].properties.profilepicture
            }
            res.status(200);
            res.send({user});
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            res.send(err);
          });
    }
    else
    {
        res.status(400)
        res.send({user:null})
    }
}

async function verify(token)
{
    let answer = "initial"
    bool = false;
     try {
         //console.log("user")
         var user = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { maxAge: 1440 });
         var milliseconds = +new Date;        
         var seconds = milliseconds / 1000;
        // console.log(seconds)
        // console.log(user)
         if(seconds - user.iat > 86400)
             return (null)
         await db.getSession()
         .run(`
                 Match (n:User { email: "${user.email}" })
                 RETURN n
             `)
         .then(result => {
             //console.log(result.records[0]._fields[0].properties.password, " == ", user.hash)
             if(user.password == result.records[0]._fields[0].properties.hash){
                    answer = result.records[0]._fields[0].identity.low
                    console.log("Sending...    ",answer)
                    bool = true
             }
         })
         .catch(err => 
         {
            return (null)

         });
     } 
     catch (err) 
     {
        return (null)

     }
    if(bool)
        return answer;
    else
        return null
 }

module.exports =
{
    login,
    register,
    editUser,
    verify,
    getUser
};