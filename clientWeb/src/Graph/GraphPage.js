import React from "react";
import { ProgressBar, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Graph from "./Graph";
import DeleteTask from "./Task/DeleteTask";
import UpdateTask from "./Task/UpdateTask";
import UpdateProgress from "./Task/UpdateProgress";
import UpdateDependency from "./Dependency/UpdateDependency";
import DeleteDependency from "./Dependency/DeleteDependency";
import SendTaskNotification from "../Notifications/SendTaskNotification";
import FilterComponent from "./FilterComponent";
import $ from "jquery";

class GraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      project: this.props.project, 
      task:null, 
      dependency:null, 
      nodes:null, 
      links:null,
      views:null,
      allUsers:null, 
      assignedProjUsers:null,
      filterOn:false,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.setTaskInfo = this.setTaskInfo.bind(this);
    this.getProjectInfo = this.getProjectInfo.bind(this);
    this.updateAssignedPeople = this.updateAssignedPeople.bind(this);
    this.setFilterOn = this.setFilterOn.bind(this);
  }

  componentDidMount() {
    $.post("/getProject", { id: this.state.project.id }, (response) => {
      this.setState({ nodes: response.tasks, links: response.rels });
    }).fail((err) => {
      throw Error(err);
    });

    $.post("/getProjectViews", { id: this.state.project.id }, (response) => {
      this.setState({ views: response.views });
    }).fail((err) => {
      throw Error(err);
    });

    // Gets all the users in the database, might update to be all users assigned to the project
    $.post( "/people/getAllUsers", {id: this.state.project.id} , response => {
      this.setState({ allUsers: response.users });
    }).fail((err) => {
      throw Error(err);
    });

    // Gets all users already assigned to a task in a project
    $.post( "/people/assignedProjectUsers", {id: this.state.project.id} , response => {
      this.setState({assignedProjUsers:response.projectUsers});
    })
    .fail(err => {
      throw Error(err);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      $.post("/getProject", { id: this.props.project.id }, (response) => {
        this.setState({
          project: this.props.project,
          nodes: response.tasks,
          links: response.rels,
        });
      }).fail((err) => {
        throw Error(err);
      });
    }
  }

  setFilterOn(value){
    this.setState({filterOn: value});
  }

  getProjectInfo() {
    return { nodes: this.state.nodes, rels: this.state.links };
  }

  setTaskInfo(nodes, rels, displayNode, displayRel, assignedPeople) {
    if (nodes !== undefined && rels !== undefined) {
      this.setState({ nodes: nodes, links: rels });

      if (displayNode !== undefined || displayRel !== undefined) {
        // Will set the state of the assigned project users when a task is created or updated
        if(assignedPeople !== undefined){
          this.setState({assignedProjUsers: assignedPeople});
        }
        this.toggleSidebar(displayNode, displayRel);
      }

      return;
    }
    $.post("/getProject", { id: this.state.project.id }, (response) => {
      this.setState({ nodes: response.tasks, links: response.rels });
    }).fail((err) => {
      throw Error(err);
    });
  }

  updateAssignedPeople(newPeopleList){
    this.setState({assignedProjUsers:newPeopleList})
  }

  toggleSidebar(newTaskID, newDependencyID) {
    var newTask = null;
    var newDependency = null;
    var x;

    if (newTaskID != null) {
      for (x = 0; x < this.state.nodes.length; x++) {
        if (this.state.nodes[x].id === newTaskID) {
          newTask = this.state.nodes[x];
        }
      }
      this.setState({ task: newTask, dependency: newDependency });
    } else if (newDependencyID != null) {
      for (x = 0; x < this.state.links.length; x++) {
        if (this.state.links[x].id === newDependencyID) {
          newDependency = this.state.links[x];
        }
      }
      this.setState({ task: newTask, dependency: newDependency });
    } else {
      this.setState({ task: null, dependency: null });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid style={{ height: "100%", width: "100%" }}>
          <Row className="h-100">
            <Col
              className="text-center block-example border-right border-secondary bg-light"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <Container>
                <Row>
                  <Col>
                    <Link to="/project">
                      <Button
                        variant="light"
                        size="sm"
                        className="text-left align-items-top"
                      >
                        <i className="fa fa-arrow-left"></i>
                      </Button>
                    </Link>
                  </Col>
                  <Col xs={6} md={6} lg={6} xl={6} className="text-center">
                    <h3>{this.props.project.name}</h3>
                  </Col>
                  <Col></Col>
                </Row>
              </Container>
              <hr></hr>
              {this.state.task !== null ? (
                <TaskSidebar
                  task={this.state.task}
                  userPermission={this.props.userPermission}
                  toggleSidebar={this.toggleSidebar}
                  setTaskInfo={this.setTaskInfo}
                  getProjectInfo={this.getProjectInfo}
                  assignedProjUsers={this.state.assignedProjUsers}
                  allUsers={this.state.allUsers}
                  updateAssignedPeople={this.updateAssignedPeople}
                  user={this.props.user}
                  project={this.state.project}
                />
              ) : null}
              {this.state.dependency !== null ? (
                <DependencySidebar
                  project={this.props.project}
                  dependency={this.state.dependency}
                  nodes={this.state.nodes}
                  userPermission={this.props.userPermission}
                  setTaskInfo={this.setTaskInfo}
                  toggleSidebar={this.toggleSidebar}
                  getProjectInfo={this.getProjectInfo}
                />
              ) : null}
              {this.state.dependency===null && this.state.task===null ?
                <FilterComponent 
                  nodes={this.state.nodes} 
                  users={this.state.assignedProjUsers} 
                  setTaskInfo={this.setTaskInfo} 
                  links={this.state.links}
                  filterOn={this.state.filterOn}
                  setFilterOn={this.setFilterOn}
                  user={this.props.user}
                />
                :null
              }
              <LegendSidebar />
            </Col>
            <Col
              xs={9}
              md={9}
              lg={9}
              xl={9}
              className="align-items-center text-center"
            >
              {this.state.nodes !== null ? (
                <Graph
                  project={this.state.project}
                  nodes={this.state.nodes}
                  links={this.state.links}
                  views={this.state.views}
                  userPermission={this.props.userPermission}
                  setTaskInfo={this.setTaskInfo}
                  toggleSidebar={this.toggleSidebar}
                  getProjectInfo={this.getProjectInfo}
                  allUsers={this.state.allUsers}
                  assignedProjUsers={this.state.assignedProjUsers}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

class TaskSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.classifyExistingUsers = this.classifyExistingUsers.bind(this);
  }

  // Classifies users on the project according to role if they are part of this task
  classifyExistingUsers() {
    let taskUsers = [];
    let taskPacMans = [];
    let taskResPersons = [];
    let taskResources = [];

    // Get the users that are part of the selected task
    for(let x = 0; x < this.props.assignedProjUsers.length; x++){
      if(this.props.assignedProjUsers[x][1].end === this.props.task.id){
        taskUsers.push(this.props.assignedProjUsers[x])
      }
    }

    // Assign users to their respective roles by putting them in arrays
    for (let x = 0; x < taskUsers.length; x++) {
      if (taskUsers[x][1].type === "PACKAGE_MANAGER") {
        taskPacMans.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === "RESPONSIBLE_PERSON") {
        taskResPersons.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === "RESOURCE") {
        taskResources.push(taskUsers[x][0]);
      }
    }

    taskUsers = [];
    taskUsers.push(taskPacMans);
    taskUsers.push(taskResPersons);
    taskUsers.push(taskResources);

    return taskUsers;
  }

  printUsers(people) {
    let list = [];
    for (let x = 0; x < people.length; x++) {
      list.push(
        <p key={people[x].id}>
          {people[x].name}&nbsp;{people[x].surname}
        </p>
      );
    }
    return list;
  }

  render() {
    let startDate =
      this.props.task.startDate.year.low +
      "-" +
      this.props.task.startDate.month.low +
      "-" +
      this.props.task.startDate.day.low;
    let endDate =
      this.props.task.endDate.year.low +
      "-" +
      this.props.task.endDate.month.low +
      "-" +
      this.props.task.endDate.day.low;

    let taskUsers = this.classifyExistingUsers();
    let taskPacMans = taskUsers[0];
    let taskResPersons = taskUsers[1];
    let taskResources = taskUsers[2];

    
    let progressColor = "success"
    if (this.props.task.progress < 33) progressColor = "danger";
    else if (this.props.task.progress < 66) progressColor = "warning";

    return (
      <React.Fragment>
        <Container
          className="text-dark text-center bg-light py-2"
          style={{ fontSize: "19px", wordWrap: "break-word" }}
        >
          <Row className="text-center">
            <Col>
              {this.props.userPermission["delete"] === true ? (
                <DeleteTask
                  task={this.props.task}
                  setTaskInfo={this.props.setTaskInfo}
                  getProjectInfo={this.props.getProjectInfo}
                  toggleSidebar={this.props.toggleSidebar}
                />
              ) : null}
            </Col>
            <Col xs={6}>
              <h3>{this.props.task.name}</h3>
            </Col>
            <Col className="text-right">
              <Button
                className="btn-light border-dark"
                onClick={() => this.props.toggleSidebar(null, null)}
              >
                <i className="fa fa-close"></i>
              </Button>
            </Col>
          </Row>
          <Row className="text-center align-items-center p-1">
            <Col className="text-center">{this.props.task.description}</Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Task Id: {this.props.task.id}
            </Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">Start Date: {startDate}</Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">End Date: {endDate}</Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Duration: {this.props.task.duration} days
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar
                variant={progressColor}
                now={this.props.task.progress}
                label={`${Math.round(this.props.task.progress)}% Complete`}
              />
            </Col>
          </Row>
          {this.props.userPermission["update"] === true ? (
            <Row className="my-2">
              <Col xs={12} className="text-center">
                <UpdateProgress
                  task={this.props.task}
                  setTaskInfo={this.props.setTaskInfo}
                  toggleSidebar={this.props.toggleSidebar}
                />
              </Col>
            </Row>
          ) : null}
          {this.props.userPermission["update"] === true ? (
            <Row className="my-2">
              <Col xs={12} className="text-center">
                <UpdateTask
                  task={this.props.task}
                  setTaskInfo={this.props.setTaskInfo}
                  getProjectInfo={this.props.getProjectInfo}
                  toggleSidebar={this.props.toggleSidebar}
                  pacMans={taskPacMans}
                  resPersons={taskResPersons}
                  resources={taskResources}
                  allUsers={this.props.allUsers}
                  assignedProjUsers={this.props.assignedProjUsers}
                  updateAssignedPeople={this.props.updateAssignedPeople}
                  project={this.props.project}
                />
              </Col>
            </Row>
          ) : null}
          <Row className="my-2">
            <Col xs={12} className="text-center">
              <SendTaskNotification
                task={this.props.task}
                project={this.props.project}
                user={this.props.user}
                taskPacMans={taskPacMans}
                taskResPersons={taskResPersons}
                taskResources={taskResources}
              />
            </Col>
          </Row>
          <hr />
          <b>Package managers:</b>
          <br />
          <br />
          {this.printUsers(taskPacMans)}
          <b>Responsible persons:</b>
          <br />
          <br />
          {this.printUsers(taskResPersons)}
          <b>Resources:</b>
          <br />
          <br />
          {this.printUsers(taskResources)}
        </Container>
      </React.Fragment>
    );
  }
}

class DependencySidebar extends React.Component {
  render() {
    var start;
    var end;

    for (var x = 0; x < this.props.nodes.length; x++) {
      if (this.props.nodes[x].id === this.props.dependency.source) {
        start = this.props.nodes[x].name;
      } else if (this.props.nodes[x].id === this.props.dependency.target) {
        end = this.props.nodes[x].name;
      }
    }

    return (
      <React.Fragment>
        <Container
          className="text-black text-center py-2"
          style={{ fontSize: "19px" }}
        >
          <Row>
            <Col>
              {this.props.userPermission["delete"] === true ? (
                <DeleteDependency
                  dependency={this.props.dependency}
                  getProjectInfo={this.props.getProjectInfo}
                  setTaskInfo={this.props.setTaskInfo}
                  toggleSidebar={this.props.toggleSidebar}
                />
              ) : null}
            </Col>
            <Col xs={8}>
              <h4>{start + "→" + end}</h4>
            </Col>
            <Col className="text-right">
              <Button
                className="btn-light border-dark"
                onClick={() => this.props.toggleSidebar(null, null)}
              >
                <i className="fa fa-close"></i>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col xs={8}>
              {this.props.dependency.relationshipType === "fs"
                ? "Finish-Start"
                : "Start-Start"}
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col xs={8}>Duration: {this.props.dependency.duration} days</Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              {this.props.userPermission["update"] === true ? (
                <UpdateDependency
                  project={this.props.project}
                  dependency={this.props.dependency}
                  getProjectInfo={this.props.getProjectInfo}
                  setTaskInfo={this.props.setTaskInfo}
                  toggleSidebar={this.props.toggleSidebar}
                />
              ) : null}
            </Col>
          </Row>
          <hr />
        </Container>
      </React.Fragment>
    );
  }
}

class LegendSidebar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container
          className="text-black text-center"
          style={{ fontSize: "20px" }}
        >
          <Row>
            <Col className="text-center">
              <h4>Task progress key</h4>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1 p-1"
              xs={6}
              style={{
                backgroundColor: "white",
                color: "black",
                width: "120px",
              }}
            >
              Incomplete
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1 p-1"
              xs={6}
              style={{
                backgroundColor: "#77dd77",
                color: "black",
                width: "120px",
              }}
            >
              Complete
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1 p-1"
              xs={6}
              style={{
                backgroundColor: "#ff6961",
                color: "black",
                width: "120px",
              }}>
              Overdue
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-dark m-1 p-1"
              xs={6}
              style={{
                backgroundColor: "#ffae42",
                color: "black",
                width: "120px",
              }}
            >
              Issue
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col
              className="text-center border rounded border-primary m-1 p-1"
              xs={6}
              style={{
                backgroundColor: "white",
                color: "black",
                width: "120px",
              }}
            >
              Critical Path
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default GraphPage;
