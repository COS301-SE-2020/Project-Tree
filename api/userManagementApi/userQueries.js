const db = require('../DB');
const { JWT } = require('jose');
const bcrypt = require('bcrypt');

function b64toBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

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
    let x = " "
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
                                birthday: "${req.body.um_date}"
                            })
                            RETURN a
                        `)
                    .then(result => {
                        let id = (result.records[0]._fields[0].identity.low)
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
    console.log(req.body)
    let userId = await verify(req.body.token);
    if(userId!=null)
    {
        db.getSession()
        .run(
            `
            MATCH (a) 
            WHERE ID(a) = ${userId}
            SET a += {
                name:"${req.body.user.name}",
                sname:"${req.body.user.sname}",
                email:"${req.body.user.email}",
                birthday:"${req.body.user.bday}"
            } 
            RETURN a
          `
        )
        .then(result => {
            let user={
                id: result.records[0]._fields[0].identity.low,
                name: result.records[0]._fields[0].properties.name,
                sname: result.records[0]._fields[0].properties.sname,
                email: result.records[0]._fields[0].properties.email,
                birthday: result.records[0]._fields[0].properties.bday
            }
            console.log("user", user)
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
    let userId = await verify(req.body.token);
    if ( userId != null ) {
        db.getSession()
        .run(
        `
            MATCH (u:User) 
            WHERE ID(u) = ${userId} 
            RETURN u
        `
        )
        .then(result => {
            let user={
                id: result.records[0]._fields[0].identity.low,
                name: result.records[0]._fields[0].properties.name,
                sname: result.records[0]._fields[0].properties.sname,
                email: result.records[0]._fields[0].properties.email,
                birthday: result.records[0]._fields[0].properties.birthday
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
         var user = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { maxAge: 1440 });
         var milliseconds = +new Date;        
         var seconds = milliseconds / 1000;
         if(seconds - user.iat > 86400)
             return (null)
         await db.getSession()
         .run(`
                 Match (n:User { email: "${user.email}" })
                 RETURN n
             `)
         .then(result => {
             if(user.password == result.records[0]._fields[0].properties.hash){
                    answer = result.records[0]._fields[0].identity.low
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