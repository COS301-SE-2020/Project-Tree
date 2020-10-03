// Auto-generated by the Load Impact converter

import "./libs/shim/core.js";
import "./libs/shim/expect.js";

export let options = {
  maxRedirects: 4,
  duration: "30s",
  vus: 400
};

const Request = Symbol.for("request");
postman[Symbol.for("initial")]({
  options
});

export default function() {
  postman[Request]({
    name: "Register 1",
    id: "2e411bb9-c358-48a8-85f8-804eb681d5cc",
    method: "POST",
    address: "https://projecttree.herokuapp.com/register",
    data:
      '{\r\n    "email": "thebteam.project@gmail.com",\r\n    "password": "theB-Team123",\r\n    "name": "TheB",\r\n    "sname": "Team",\r\n    "um_date": " ",\r\n    "type": "webToken"\r\n}',
    post(res) {
      pm.test("responds with 200", () => {
        pm.response.to.have.status(200);
      });

      pm.test("has correct body", () => {
        let response = pm.response.json();
        pm.expect(response.message).to.eql("duplicate");
      });

      pm.test("Response time is less than 2s", () => {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
    }
  });

  postman[Request]({
    name: "Register 2",
    id: "5617b5a8-4a98-4d08-834c-7498d9aa054d",
    method: "POST",
    address: "https://projecttree.herokuapp.com/register",
    data:
      '{\r\n    "email": "u18076514@tuks.co.za",\r\n    "password": "theB-Team123",\r\n    "name": "Dummy",\r\n    "sname": "One",\r\n    "um_date": " ",\r\n    "type": "webToken"\r\n}',
    post(res) {
      pm.test("responds with 200", () => {
        pm.response.to.have.status(200);
      });

      pm.test("has correct body", () => {
        let response = pm.response.json();
        pm.expect(response.message).to.eql("duplicate");
      });

      pm.test("Response time is less than 2s", () => {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
    }
  });

  postman[Request]({
    name: "Register 3",
    id: "caba2db0-0f23-47a3-befb-7013f214fb85",
    method: "POST",
    address: "https://projecttree.herokuapp.com/register",
    data:
      '{\r\n    "email": "damianventer1@gmail.com",\r\n    "password": "theB-Team123",\r\n    "name": "Dummy",\r\n    "sname": "Two",\r\n    "um_date": " ",\r\n    "type": "webToken"\r\n}',
    post(res) {
      pm.test("responds with 200", () => {
        pm.response.to.have.status(200);
      });

      pm.test("has correct body", () => {
        let response = pm.response.json();
        pm.expect(response.message).to.eql("duplicate");
      });

      pm.test("Response time is less than 2s", () => {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
    }
  });

  // postman[Request]({
  //   name: "Login",
  //   id: "6a09c707-950b-4aa3-9a42-fe311990570f",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/login",
  //   data:
  //     '{\r\n    "email": "thebteam.project@gmail.com",\r\n    "password": "theB-Team123",\r\n    "type": "webToken"\r\n}',
  //   post(res) {
  //     pm.test("responds with 200", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("sessionToken", response.sessionToken);
  //       pm.expect(response.sessionToken).to.match(
  //         /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  //       );
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get User",
  //   id: "20777aaa-4fd4-4488-b42f-ea0ab7b64014",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/user/get",
  //   data: '{\r\n    "token": "{{sessionToken}}"\r\n}',
  //   post(res) {
  //     pm.test("responds with 200", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let user = pm.response.json().user;
  //       pm.globals.set("user", JSON.stringify(user));
  //       pm.expect(user.name).to.eql("TheB");
  //       pm.expect(user.sname).to.eql("Team");
  //       pm.expect(user.email).to.eql("thebteam.project@gmail.com");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Edit User",
  //   id: "05278412-eb09-4fd4-bb8f-6b64bdaf7153",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/user/edit",
  //   data:
  //     '{\r\n    "userId": {{userId}},\r\n    "token": "{{sessionToken}}",\r\n    "name":"TheB",\r\n    "sname":"Team",\r\n    "email":"thebteam.project@gmail.com",\r\n    "bday": "null",\r\n    "profilepicture": "https://i.ibb.co/37MF1qH/user-2935527-640.png",\r\n    "oldprofile": "undefined"\r\n}',
  //   pre() {
  //     pm.globals.set("userId", JSON.parse(pm.globals.get("user")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let user = pm.response.json().user;
  //       pm.globals.set("user", JSON.stringify(user));
  //       pm.expect(user.name).to.eql("TheB");
  //       pm.expect(user.sname).to.eql("Team");
  //       pm.expect(user.email).to.eql("thebteam.project@gmail.com");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get All Users",
  //   id: "704f76e0-7a93-417d-8cd3-4403c244edf2",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/people/getAllUsers",
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     let response = pm.response.json();
  //     pm.globals.set("users", JSON.stringify(response.users));

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Edit Password",
  //   id: "3e845f37-172a-44e6-9e03-42b6a280b7c9",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/user/pass",
  //   data:
  //     '{\r\n    "token": "{{sessionToken}}",\r\n    "testPass": "testPassword",\r\n    "newPass": "newPassword"\r\n}',
  //   post(res) {
  //     pm.test("responds with 200", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       pm.expect(pm.response.json()).to.eql({
  //         status: false,
  //         message: "wrong"
  //       });
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Create Project",
  //   id: "94f37a99-127d-467b-b7d7-3a1b31001a4b",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/add",
  //   data:
  //     '{\n    "token":"{{sessionToken}}",\n    "cp_Name":"PostmanProject",\n    "cp_Description":"This is a postman test project",\n    "cp_pm_Create":true,\n    "cp_pm_Delete":true,\n    "cp_pm_Update":true,\n    "cp_rp_Delete":true,\n    "cp_rp_Update":true,\n    "cp_r_Update":true\n}',
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       let nodes = [];
  //       let rels = [];
  //       pm.globals.set("project", JSON.stringify(response));
  //       pm.globals.set("nodes", JSON.stringify(nodes));
  //       pm.globals.set("rels", JSON.stringify(rels));
  //       pm.expect(response.name).to.eql("PostmanProject");
  //       pm.expect(response.description).to.eql(
  //         "This is a postman test project"
  //       );
  //       pm.expect(response.permissions).to.eql([
  //         true,
  //         true,
  //         true,
  //         false,
  //         true,
  //         true,
  //         false,
  //         false,
  //         true
  //       ]);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get Projects",
  //   id: "aa38fd41-9c32-4ffd-8ce5-2fe680ae031c",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/get",
  //   data: '{\r\n    "token":"{{sessionToken}}"\r\n}',
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.ownedProjects).to.eql([
  //         JSON.parse(pm.globals.get("project"))
  //       ]);
  //       pm.expect(response.otherProjects).to.eql([]);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "getProject",
  //   id: "ad0ca7e0-7ba0-497f-ac10-93c9951e149b",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/getProject",
  //   data: '{\r\n    "id":"{{projectId}}"\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Check Permissions",
  //   id: "912463b8-c503-4a78-aecc-12cd2805541b",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/user/checkpermission",
  //   data: '{\r\n    "data": {{data}}\r\n}',
  //   pre() {
  //     var data = {};
  //     data.project = JSON.parse(pm.globals.get("project"));
  //     data.token = pm.globals.get("sessionToken");
  //     pm.globals.set("data", JSON.stringify(JSON.stringify(data)));
  //   },
  //   post(res) {
  //     pm.test("responds with 200", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.create).to.eql(true);
  //       pm.expect(response.update).to.eql(true);
  //       pm.expect(response.delete).to.eql(true);
  //       pm.expect(response.project).to.eql(true);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Update Project",
  //   id: "bca5b2d3-200d-483b-aaba-264c42dd9523",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/update",
  //   data:
  //     '{\r\n    "token":"{{sessionToken}}",\r\n    "up_id": "{{projectId}}",\r\n    "up_name": "Postman project updated",\r\n    "up_description": "update",\r\n    "up_pm_Create": true,\r\n    "up_pm_Delete": true,\r\n    "up_pm_Update": true,\r\n    "up_rp_Create": true,\r\n    "up_rp_Delete": true,\r\n    "up_rp_Update": true\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.name).to.eql("Postman project updated");
  //       pm.expect(response.description).to.eql("update");
  //       pm.expect(response.permissions).to.eql([
  //         true,
  //         true,
  //         true,
  //         true,
  //         true,
  //         true,
  //         false,
  //         false,
  //         false
  //       ]);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Create Task 1",
  //   id: "e0cf05a9-976b-4571-894f-3ef184b8144e",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/add",
  //   data:
  //     '{\n    "changedInfo": {\n        "name": "Unit test",\n        "startDate": "2020-08-21T08:00",\n        "endDate": "2020-08-25T09:00",\n        "description": "Unit testing from postman demo 3",\n        "project": {\n            "id": "{{projectId}}"\n        }\n    },\n    "nodes": {{nodes}},\n    "rels": {{rels}}\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.nodes[response.nodes.length - 1].name).to.eql(
  //         "Unit test"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].startDate).to.eql(
  //         "2020-08-21T08:00"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].endDate).to.eql(
  //         "2020-08-25T09:00"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].duration).to.eql(
  //         349200000
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].description).to.eql(
  //         "Unit testing from postman demo 3"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].progress).to.eql(0);
  //       pm.expect(response.nodes[response.nodes.length - 1].type).to.eql(
  //         "Incomplete"
  //       );
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get Project Tasks",
  //   id: "3166d316-0982-4ec3-818e-37f4b57b5fb2",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/projecttasks",
  //   data: '{\r\n    "projId":"{{projectId}}"\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.tasks).to.eql(JSON.parse(pm.globals.get("nodes")));
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Create Task 2",
  //   id: "eed2ddc4-3be2-4f97-8537-f510ae2f8918",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/add",
  //   data:
  //     '{\n    "changedInfo": {\n        "name": "Unit test 2",\n        "startDate": "2020-09-10T08:00",\n        "endDate": "2020-09-15T09:00",\n        "description": "Unit testing 2 from postman demo 3",\n        "project": {\n            "id": "{{projectId}}"\n        }\n    },\n    "nodes": {{nodes}},\n    "rels": {{rels}}\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.nodes[response.nodes.length - 1].name).to.eql(
  //         "Unit test 2"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].startDate).to.eql(
  //         "2020-09-10T08:00"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].endDate).to.eql(
  //         "2020-09-15T09:00"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].duration).to.eql(
  //         435600000
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].description).to.eql(
  //         "Unit testing 2 from postman demo 3"
  //       );
  //       pm.expect(response.nodes[response.nodes.length - 1].progress).to.eql(0);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Create Dependency",
  //   id: "a27dcd9e-024e-4339-9fe7-82893b216ea9",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/dependency/add",
  //   data:
  //     '{\n    "changedInfo":{\n        "fid": {{node1}},\n        "sid": {{node2}},\n        "projId": "{{projectId}}",\n        "relationshipType":"ss",\n        "sStartDate": "2020-08-21T08:00",\n        "sEndDate": "2020-08-25T09:00",\n        "startDate": "2020-08-21T08:00",\n        "endDate": "2020-09-10T08:00",\n        "cd_viewId_source": null,\n        "cd_viewId_target": null\n    },\n    "nodes":{{nodes}},\n    "rels":{{rels}}\n}',
  //   pre() {
  //     pm.globals.set("node1", JSON.parse(pm.globals.get("nodes"))[0].id);
  //     pm.globals.set("node2", JSON.parse(pm.globals.get("nodes"))[1].id);
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(
  //         response.rels[response.rels.length - 1].relationshipType
  //       ).to.eql("ss");
  //       pm.expect(response.rels[response.rels.length - 1].sStartDate).to.eql(
  //         "2020-08-21T08:00"
  //       );
  //       pm.expect(response.rels[response.rels.length - 1].sEndDate).to.eql(
  //         "2020-08-25T09:00"
  //       );
  //       pm.expect(response.rels[response.rels.length - 1].startDate).to.eql(
  //         "2020-08-21T08:00"
  //       );
  //       pm.expect(response.rels[response.rels.length - 1].endDate).to.eql(
  //         "2020-09-10T08:00"
  //       );
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get Project Critical Path",
  //   id: "716d4f10-ec45-49ba-b827-462d0e5a2990",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/criticalpath",
  //   data: '{\r\n    "projId":"{{projectId}}"\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Update Task 1",
  //   id: "1951ae70-da21-43ef-9999-d7774bd9e220",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/update",
  //   data:
  //     '{\r\n    "changedInfo":{\r\n        "id": {{node}},\r\n        "name":"Unit test updated",\r\n        "startDate":"2020-08-22T12:00",\r\n        "endDate":"2020-08-27T14:25",\r\n        "description":"Unit testing from postman demo 3 again",\r\n        "progress":100,\r\n        "type":"Complete"\r\n    },\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.nodes[0].name).to.eql("Unit test updated");
  //       pm.expect(response.nodes[0].startDate).to.eql("2020-08-22T12:00");
  //       pm.expect(response.nodes[0].endDate).to.eql("2020-08-27T14:25");
  //       pm.expect(response.nodes[0].description).to.eql(
  //         "Unit testing from postman demo 3 again"
  //       );
  //       pm.expect(response.nodes[0].progress).to.eql(100);
  //       pm.expect(response.nodes[0].type).to.eql("Complete");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Update Task 2",
  //   id: "562723e9-83cf-4690-bfaf-248d9a9001b1",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/update",
  //   data:
  //     '{\r\n    "changedInfo":{\r\n        "id": {{node}},\r\n        "name":"Unit test 2 updated",\r\n        "startDate":"2020-09-12T08:30",\r\n        "endDate":"2020-09-17T15:00",\r\n        "description":"Unit testing from postman demo 3 again",\r\n        "progress":50,\r\n        "type":"Issue"\r\n    },\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[1].id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.nodes[1].name).to.eql("Unit test 2 updated");
  //       pm.expect(response.nodes[1].startDate).to.eql("2020-09-12T08:30");
  //       pm.expect(response.nodes[1].endDate).to.eql("2020-09-17T15:00");
  //       pm.expect(response.nodes[1].description).to.eql(
  //         "Unit testing from postman demo 3 again"
  //       );
  //       pm.expect(response.nodes[1].progress).to.eql(50);
  //       pm.expect(response.nodes[1].type).to.eql("Issue");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Create View",
  //   id: "a3cdcb5d-eb5a-45a8-bb04-d4f1317ba725",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/createClone",
  //   data: '{\r\n    "id": {{node}}\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "getProjectViews",
  //   id: "a9689c7d-0cb1-48bf-94be-c6a944a8f367",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/getProjectViews",
  //   data: '{\r\n    "id":"{{projectId}}"\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     let response = pm.response.json();
  //     pm.globals.set("views", JSON.stringify(response.views));

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Delete View",
  //   id: "68d29464-f975-4b84-a621-dc411d420763",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/deleteClone",
  //   data:
  //     '{\r\n    "changedInfo":{\r\n        "viewId": {{view}}\r\n    }\r\n}',
  //   pre() {
  //     pm.globals.set("view", JSON.parse(pm.globals.get("views"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Assign People",
  //   id: "73b93c44-5a1e-45d2-9c51-b3b53279ba86",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/people/assignPeople",
  //   data:
  //     '{\r\n    "ct_taskId":{{node}},\r\n    "ct_pacMans":[{{user1}},{{user2}}],\r\n    "ct_resPersons":[],\r\n    "ct_resources":[],\r\n    "auto_notification": {\r\n        "timestamp": {{timestamp}},\r\n        "projName": {{projName}},\r\n        "projID": {{projId}},\r\n        "taskName": "task",\r\n        "type": "auto",\r\n        "mode": 2\r\n    }\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //     pm.environment.set(
  //       "user1",
  //       JSON.stringify(JSON.parse(pm.globals.get("users"))[0])
  //     );
  //     pm.environment.set(
  //       "user2",
  //       JSON.stringify(JSON.parse(pm.globals.get("users"))[1])
  //     );
  //     pm.environment.set(
  //       "projName",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).name)
  //     );
  //     pm.environment.set(
  //       "projId",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).id)
  //     );
  //     let timestamp = new Date();
  //     timestamp.setTime(
  //       timestamp.getTime() - new Date().getTimezoneOffset() * 60 * 1000
  //     );
  //     pm.environment.set(
  //       "timestamp",
  //       JSON.stringify((timestamp = timestamp.toISOString()))
  //     );
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Get Assigned People",
  //   id: "5580a7fe-e58f-42c5-8352-24956983bda5",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/people/assignedProjectUsers",
  //   data: '{\r\n    "id":{{projId}}\r\n}',
  //   pre() {
  //     pm.environment.set(
  //       "projId",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).id)
  //     );
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.projectUsers.length).to.be.above(0);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Edit Assigned People",
  //   id: "d089d869-c29a-4435-9d05-dedaa67f92cf",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/people/updateAssignedPeople",
  //   data:
  //     '{\r\n    "ut_taskId":{{node}},\r\n    "ut_pacMans":[],\r\n    "ut_resources":[],\r\n    "ut_resPersons":[],\r\n    "ut_originalPacMans":[{{user1}},{{user2}}],\r\n    "ut_originalResPersons":[],\r\n    "ut_originalResources":[],\r\n    "auto_notification": {\r\n        "timestamp": {{timestamp}},\r\n        "projName": {{projName}},\r\n        "projID": {{projId}},\r\n        "taskName": "task",\r\n        "type": "auto",\r\n        "mode": 2\r\n    }\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //     pm.environment.set(
  //       "user1",
  //       JSON.stringify(JSON.parse(pm.globals.get("users"))[0])
  //     );
  //     pm.environment.set(
  //       "user2",
  //       JSON.stringify(JSON.parse(pm.globals.get("users"))[1])
  //     );
  //     pm.environment.set(
  //       "projName",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).name)
  //     );
  //     pm.environment.set(
  //       "projId",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).id)
  //     );
  //     let timestamp = new Date();
  //     timestamp.setTime(
  //       timestamp.getTime() - new Date().getTimezoneOffset() * 60 * 1000
  //     );
  //     pm.environment.set(
  //       "timestamp",
  //       JSON.stringify((timestamp = timestamp.toISOString()))
  //     );
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Update Dependency",
  //   id: "f46798b1-152b-4f10-8d69-5fb1349696f6",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/dependency/update",
  //   data:
  //     '{\r\n    "changedInfo":{\r\n        "id": {{rel1}},\r\n        "relationshipType":"fs",\r\n        "sStartDate": "2020-08-21T08:00",\r\n        "sEndDate": "2020-08-25T09:00",\r\n        "startDate": "2020-08-25T09:00",\r\n        "endDate": "2020-09-14T08:00",\r\n        "cd_viewId_source": null,\r\n        "cd_viewId_target": null\r\n    },\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("rel1", JSON.parse(pm.globals.get("rels"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.rels[0].relationshipType).to.eql("fs");
  //       pm.expect(response.rels[0].sStartDate).to.eql("2020-08-21T08:00");
  //       pm.expect(response.rels[0].sEndDate).to.eql("2020-08-25T09:00");
  //       pm.expect(response.rels[0].startDate).to.eql("2020-08-25T09:00");
  //       pm.expect(response.rels[0].endDate).to.eql("2020-09-14T08:00");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Send Project Notification",
  //   id: "2bcd3f96-d2eb-4700-be7d-ce2d8a5ff8a7",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/sendNotification",
  //   data:
  //     '{\r\n    "type":"project",\r\n    "fromName":{{fromUser}},\r\n    "recipients":[],\r\n    "timestamp": {{timestamp}},\r\n    "message": "hello",\r\n    "projName": {{projectName}},\r\n    "projId": {{projectId}},\r\n    "mode": 2\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //     pm.environment.set(
  //       "projectName",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).name)
  //     );

  //     let user =
  //       JSON.parse(pm.globals.get("user")).name +
  //       " " +
  //       JSON.parse(pm.globals.get("user")).sname;
  //     pm.environment.set("fromUser", JSON.stringify(user));

  //     let timestamp = new Date();
  //     timestamp.setHours(timestamp.getHours() + 2);
  //     timestamp = timestamp.toISOString();
  //     pm.environment.set("timestamp", JSON.stringify(timestamp));
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.response).to.eql("okay");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Send Task Notification",
  //   id: "14cb9282-af25-43cb-bda5-d9d6afc8c401",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/sendNotification",
  //   data:
  //     '{\r\n    "type":"task",\r\n    "fromName":{{fromUser}},\r\n    "recipients":"[]",\r\n    "timestamp": {{timestamp}},\r\n    "message": "hello",\r\n    "taskName": {{taskName}},\r\n    "projName": {{projectName}},\r\n    "projId": {{projectId}},\r\n    "mode": 2\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //     pm.environment.set(
  //       "projectName",
  //       JSON.stringify(JSON.parse(pm.globals.get("project")).name)
  //     );
  //     pm.environment.set(
  //       "taskName",
  //       JSON.stringify(JSON.parse(pm.globals.get("nodes"))[0].name)
  //     );

  //     let user =
  //       JSON.parse(pm.globals.get("user")).name +
  //       " " +
  //       JSON.parse(pm.globals.get("user")).sname;
  //     pm.environment.set("fromUser", JSON.stringify(user));

  //     let timestamp = new Date();
  //     timestamp.setHours(timestamp.getHours() + 2);
  //     timestamp = timestamp.toISOString();
  //     pm.environment.set("timestamp", JSON.stringify(timestamp));
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.response).to.eql("okay");
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Retrieve Notifications",
  //   id: "2b2f46cb-2c60-41f4-ac78-865a1b71efff",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/retrieveNotifications",
  //   data: '{\r\n    "userID":{{userId}},\r\n    "projID":{{projectId}}\r\n}',
  //   pre() {
  //     pm.environment.set("projectId", JSON.parse(pm.globals.get("project")).id);
  //     pm.environment.set("userId", JSON.parse(pm.globals.get("user")).id);
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Delete Dependency",
  //   id: "1223f1f2-df68-4a72-807d-aa22f7e7826a",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/dependency/delete",
  //   data:
  //     '{\r\n    "changedInfo":\r\n    {\r\n        "dd_did": {{rel1}},\r\n        "sourceView": "",\r\n        "targetView": ""\r\n    } ,\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("rel1", JSON.parse(pm.globals.get("rels"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //       pm.expect(response.displayRel).to.eql(null);
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Delete Task 1",
  //   id: "4ee19e35-e240-4628-9ed0-3e3f2c22d337",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/delete",
  //   data:
  //     '{\r\n   "changedInfo":{\r\n        "id": {{node}}\r\n    },\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.globals.set("nodes", JSON.stringify(response.nodes));
  //       pm.globals.set("rels", JSON.stringify(response.rels));
  //     });

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Delete Task 2",
  //   id: "c703c730-6974-4094-80b5-fac9fc47a5da",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/task/delete",
  //   data:
  //     '{\r\n    "changedInfo":{\r\n        "id": {{node}}\r\n    },\r\n    "nodes":{{nodes}},\r\n    "rels":{{rels}}\r\n}',
  //   pre() {
  //     pm.globals.set("node", JSON.parse(pm.globals.get("nodes"))[0].id);
  //   },
  //   post(res) {
  //     pm.test("Status code is 200", function() {
  //       pm.response.to.have.status(200);
  //     });

  //     let response = pm.response.json();
  //     pm.globals.set("nodes", JSON.stringify(response.nodes));
  //     pm.globals.set("rels", JSON.stringify(response.rels));

  //     pm.test("Response time is less than 2s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(2000);
  //     });
  //   }
  // });

  // postman[Request]({
  //   name: "Delete Project",
  //   id: "c29590f2-3670-4cc7-9245-3e214a0945a1",
  //   method: "POST",
  //   address: "https://projecttree.herokuapp.com/project/delete",
  //   data: '{\r\n    "data": {{data}}\r\n}',
  //   pre() {
  //     var data = {};
  //     data.project = JSON.parse(pm.globals.get("project"));
  //     data.token = pm.globals.get("sessionToken");
  //     pm.globals.set("data", JSON.stringify(JSON.stringify(data)));
  //   },
  //   post(res) {
  //     pm.test("responds with 200 OK", () => {
  //       pm.response.to.have.status(200);
  //     });

  //     pm.test("has correct body", () => {
  //       let response = pm.response.json();
  //       pm.expect(response.delete).to.eql(
  //         JSON.parse(pm.globals.get("project")).id
  //       );
  //     });

  //     pm.test("Response time is less than 5s", () => {
  //       pm.expect(pm.response.responseTime).to.be.below(5000);
  //     });
  //   }
  // });
}