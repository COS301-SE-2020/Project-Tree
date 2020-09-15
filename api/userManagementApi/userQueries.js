const db = require("../DB");
const { JWT } = require("jose");
const bcrypt = require("bcrypt");

async function editUser(req, res) {
  let pfp = req.body.profilepicture;
  if (pfp == "") {
    pfp = req.body.oldprofile;
  }
  let userId = await verify(req.body.token);
  if (userId != null) {
    db.getSession()
      .run(
        `
          MATCH (a) 
          WHERE ID(a) = ${userId}
          SET a += {
            name:"${req.body.name}",
            sname:"${req.body.sname}",
            email:"${req.body.email}",
            birthday:"${req.body.bday}",
            profilepicture:"${pfp}"
          } 
          RETURN a
        `
      )
      .then((result) => {
        let user = {
          id: result.records[0]._fields[0].identity.low,
          name: result.records[0]._fields[0].properties.name,
          sname: result.records[0]._fields[0].properties.sname,
          email: result.records[0]._fields[0].properties.email,
          birthday: result.records[0]._fields[0].properties.bday,
        };
        res.status(200);
        res.send({ user });
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send({ message: err });
      });
  } else {
    res.status(400);
    res.send({
      message: "Invalid User",
    });
  }
}

async function register(req, res) {
  //email, password, name, surname
  let x = "https://i.ibb.co/MRpbpHN/default.png";
  db.getSession()
    .run(
      `
        Match (n:User { email: "${req.body.email}" })
        RETURN n
      `
    )
    .then((result) => {
      if (result.records.length != 0) {
        res.status(200);
        res.send({ message: "duplicate" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          let token = JWT.sign(
            { email: req.body.email, hash },
            process.env.ACCESS_TOKEN_SECRET
          );
          db.getSession()
            .run(
              `
                CREATE(a:User {
                  email:"${req.body.email}",
                  password:"${hash}", 
                  name:"${req.body.name}",
                  sname:"${req.body.sname}",
                  birthday: "${req.body.um_date}",
                  profilepicture: "${x}",
                  ${req.body.type}: "${token}"
                })
                RETURN a
              `
            )
            .then((result) => {
              let id = result.records[0]._fields[0].identity.low;
              if (result.records.length != 0) {
                res.send({
                  sessionToken: token,
                  status: true,
                  id: id,
                  message: "success",
                });
              } else {
                res.status(400);
                res.send({ status: false, message: err });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(400);
              res.send({ message: err });
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

function login(req, res) {
  db.getSession()
    .run(
      `
        Match (n:User { email: "${req.body.email}" })
        RETURN n
      `
    )
    .then((result) => {
      if (result.records.length != 0) {
        let id = result.records[0]._fields[0].identity.low;
        let hash = result.records[0]._fields[0].properties.password;
        bcrypt.compare(req.body.password, hash, (err, result) => {
          if (result) {
            let token = JWT.sign(
              { email: req.body.email, hash },
              process.env.ACCESS_TOKEN_SECRET
            );
            db.getSession()
              .run(
                `
                  Match (n:User { email: "${req.body.email}" })
                  SET n += {
                    ${req.body.type}: "${token}"
                  }
                  RETURN n
                `
              )
              .then((result) => {
                if (result.records.length != 0) {
                  res.send({
                    sessionToken: token,
                    status: true,
                    id: id,
                  });
                } else {
                  res.status(400);
                  res.send({ status: false, message: "err" });
                }
              })
              .catch((err) => {
                console.log(err);
                res.status(400);
                res.send({ message: err });
              });
          } else {
            res.status(400);
            res.send({ status: false, message: "err" });
          }
        });
      } else {
        res.status(400);
        res.send({ message: "err" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      res.send({ message: err });
    });
}

async function checkPermissionInternal(token, project) {
  let userId = await verify(token);
  let err = "";
  let temp = 4;
  if (userId != null) {
    await db
      .getSession()
      .run(
        `
          MATCH p = (a)-[r:MANAGES]->(j)
          WHERE ID(j)=${project.id} AND ID(a)=${userId}
          RETURN p
        `
      )
      .then(async (result) => {
        if (result.records.length != 0)
          if (result.records[0]._fields[0].start.identity.low == userId) {
            if (temp >= 0) temp = 0;
            return;
          }
        await db
          .getSession()
          .run(
            `
            MATCH (n:User)-[r]->(m:Task)-[:PART_OF]->(j)
            WHERE ID(j)=${project.id} AND ID(n)=${userId} 
            RETURN r
          `
          )
          .then((result) => {
            result.records.forEach((record) => {
              if (record._fields[0].type == "PACKAGE_MANAGER")
                if (temp >= 1) temp = 1;

              if (record._fields[0].type == "RESPONSIBLE_PERSON")
                if (temp >= 2) temp = 2;

              if (record._fields[0].type == "RESOURCE") if (temp >= 3) temp = 3;
            });
          })
          .catch((error) => {
            err = error;
          });
      })
      .catch((error) => {
        err = error;
      });
    if (err != "") return { error: err };
    switch (temp) {
      case 0:
        return {
          create: true,
          update: true,
          delete: true,
          project: true,
        };
      case 1:
        return {
          create: project.permissions[0],
          update: project.permissions[2],
          delete: project.permissions[1],
          project: false,
        };
      case 2:
        return {
          create: project.permissions[3],
          update: project.permissions[5],
          delete: project.permissions[4],
          project: false,
        };
      case 3:
        return {
          create: project.permissions[6],
          update: project.permissions[8],
          delete: project.permissions[7],
          project: false,
        };
      default:
        return {
          create: false,
          update: false,
          delete: false,
          project: false,
        };
    }
  } else {
    return { error: "Cannot verify user" };
  }
}

async function checkPermission(req, res) {
  body = JSON.parse(req.body.data);
  let response = await checkPermissionInternal(body.token, body.project);
  if (response.error != undefined) {
    res.status(200);
    res.send(response);
  } else {
    res.status(200);
    res.send(response);
  }
}

async function editPassword(req, res) {
  let userId = await verify(req.body.token);
  db.getSession()
    .run(
      `
      MATCH (u:User) 
      WHERE ID(u) = ${userId} 
      RETURN u
    `
    )
    .then((result) => {
      if (result.records.length != 0) {
        let hash = result.records[0]._fields[0].properties.password;
        bcrypt.compare(req.body.testPass, hash, (err, result) => {
          let newPass = bcrypt.hashSync(req.body.newPass, 10);
          if (result) {
            db.getSession()
              .run(
                `
                    MATCH (a) 
                    WHERE ID(a) = ${userId}
                    SET a += {
                      password:"${newPass}"
                    } 
                    RETURN a
                  `
              )
              .then((result) => {
                res.status(200);
                res.send({ status: true, message: "success" });
              })
              .catch((err) => {
                console.log(err);
                res.status(400);
                res.send({ message: err });
              });
          } else {
            res.status(200);
            res.send({ status: false, message: "wrong" });
          }
        });
      } else {
        res.status(400);
        res.send({ message: "err" });
      }
    });
}

async function getUser(req, res) {
  let userId = await verify(req.body.token);
  if (userId != null) {
    db.getSession()
      .run(
        `
            MATCH (u:User) 
            WHERE ID(u) = ${userId} 
            RETURN u
        `
      )
      .then((result) => {
        let user = {
          id: result.records[0]._fields[0].identity.low,
          name: result.records[0]._fields[0].properties.name,
          sname: result.records[0]._fields[0].properties.sname,
          email: result.records[0]._fields[0].properties.email,
          birthday: result.records[0]._fields[0].properties.birthday,
          profilepicture:
            result.records[0]._fields[0].properties.profilepicture,
        };
        res.status(200);
        res.send({ user });
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.send({ message: err });
      });
  } else {
    res.status(400);
    res.send({
      message: "Invalid User",
    });
  }
}

async function verify(token) {
  let value = null;
  try {
    let user = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await db
      .getSession()
      .run(
        `
          Match (n:User { email: "${user.email}"})
          WHERE n.mobileToken = "${token}" or n.webToken= "${token}"
          RETURN n
        `
      )
      .then((result) => {
        if (user.password == result.records[0]._fields[0].properties.hash) {
          value = result.records[0]._fields[0].identity.low;
        }
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  } catch (err) {
    console.log(err);
    return null;
  }
  return value;
}

module.exports = {
  login,
  register,
  editUser,
  verify,
  getUser,
  checkPermission,
  checkPermissionInternal,
  editPassword,
};
