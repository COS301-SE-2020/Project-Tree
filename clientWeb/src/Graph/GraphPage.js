import React from "react";
import { ProgressBar, Button, Container, Row, Col, Tooltip, OverlayTrigger, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Graph from "./Graph";
import DeleteTask from "./Task/DeleteTask";
import UpdateTask from "./Task/UpdateTask";
import CloneTask from "./Task/CloneTask";
import UpdateDependency from "./Dependency/UpdateDependency";
import DeleteDependency from "./Dependency/DeleteDependency";
import SendTaskNotification from "../Notifications/SendTaskNotification";
import FilterComponent from "./FilterComponent";
import $ from "jquery";
import ms from "ms";
import "./style.scss";

class GraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.project,
      task: null,
      dependency: null,
      nodes: null,
      links: null,
      views: null,
      allUsers: null,
      assignedProjUsers: null,
      filterOn: false,
      viewId: null,
      sourceView: null,
      targetView: null,
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
    $.post("/people/getAllProjectMembers", { id: this.state.project.id }, (response) => {
      this.setState({ allUsers: response.users });
    }).fail((err) => {
      throw Error(err);
    });

    // Gets all users already assigned to a task in a project
    $.post(
      "/people/assignedProjectUsers",
      { id: this.state.project.id },
      (response) => {
        this.setState({ assignedProjUsers: response.projectUsers });
      }
    ).fail((err) => {
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

      $.post("/getProjectViews", { id: this.state.project.id }, (response) => {
        this.setState({ views: response.views });
      }).fail((err) => {
        throw Error(err);
      });
      this.toggleSidebar(null, null, null, null, null);
    }
  }

  setFilterOn(value) {
    this.setState({ filterOn: value });
  }

  getProjectInfo() {
    return { nodes: this.state.nodes, rels: this.state.links };
  }

  setTaskInfo(nodes, rels, displayNode, displayRel, assignedPeople) {
    if (nodes !== undefined && rels !== undefined) {
      this.setState({ nodes: nodes, links: rels });

      if (displayNode !== undefined || displayRel !== undefined) {
        // Will set the state of the assigned project users when a task is created or updated
        if (assignedPeople !== undefined) {
          this.setState({ assignedProjUsers: assignedPeople });
        }
        this.toggleSidebar(displayNode, displayRel);
      }

      $.post("/getProjectViews", { id: this.state.project.id }, (response) => {
        this.setState({ views: response.views });
      }).fail((err) => {
        throw Error(err);
      });

      return;
    }

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
  }

  updateAssignedPeople(newPeopleList) {
    this.setState({ assignedProjUsers: newPeopleList });
  }

  toggleSidebar(newTaskID, newDependencyID, viewId, sourceView, targetView) {
    var newTask = null;
    var newDependency = null;
    var x;

    if (newTaskID != null) {
      for (x = 0; x < this.state.nodes.length; x++) {
        if (this.state.nodes[x].id === newTaskID) {
          newTask = this.state.nodes[x];
        }
      }
      if (viewId !== undefined) {
        this.setState({
          task: newTask,
          dependency: newDependency,
          viewId: viewId,
        });
      } else {
        this.setState({
          task: newTask,
          dependency: newDependency,
          viewId: null,
        });
      }
    } else if (newDependencyID != null) {
      for (x = 0; x < this.state.links.length; x++) {
        if (this.state.links[x].id === newDependencyID) {
          newDependency = this.state.links[x];
        }
      }
      if (sourceView !== undefined && targetView !== undefined) {
        this.setState({
          task: newTask,
          dependency: newDependency,
          sourceView: sourceView,
          targetView: targetView,
        });
      } else {
        this.setState({
          task: newTask,
          dependency: newDependency,
          sourceView: null,
          targetView: null,
        });
      }
    } else {
      this.setState({ task: null, dependency: null });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container
          fluid
          className="m-0 p-0"
          style={{ height: this.props.height }}
        >
          <Row>
            <Col
              xs={3}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              className="text-center border-right border-secondary bg-light "
              style={{ overflowY: "auto", height: this.props.height }}
            >
              <Container>
                <Row>
                  <Col>
                    <Link to="/project">
                      <Button
                        variant="light"
                        size="sm"
                        className="text-left align-items-top m-2"
                      >
                        <i className="fa fa-arrow-left"></i>
                      </Button>
                    </Link>
                  </Col>
                  <Col xs={8} md={8} lg={8} xl={8} className="text-center m-1">
                    <h2>{this.props.project.name} {" "}
                    <OverlayTrigger
                      placement='auto'
                      overlay={
                      <Tooltip className="helpTooltip">
                        Click on a task or dependency to view their information and perform actions.
                      </Tooltip>
                      } >
                      <i className="fa fa-question-circle"  style={{ color: "black", fontSize: "20px" }}></i>
                    </OverlayTrigger></h2>
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
                  viewId={this.state.viewId}
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
                  sourceView={this.state.sourceView}
                  targetView={this.state.targetView}
                />
              ) : null}
              {this.state.dependency === null && this.state.task === null ? (
                <FilterComponent
                  nodes={this.state.nodes}
                  users={this.state.assignedProjUsers}
                  setTaskInfo={this.setTaskInfo}
                  links={this.state.links}
                  filterOn={this.state.filterOn}
                  setFilterOn={this.setFilterOn}
                  user={this.props.user}
                />
              ) : null}
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
    for (let x = 0; x < this.props.assignedProjUsers.length; x++) {
      if (this.props.assignedProjUsers[x][1].end === this.props.task.id) {
        taskUsers.push(this.props.assignedProjUsers[x]);
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
    console.log(people);
    let list = [];
    for (let x = 0; x < people.length; x++) {
      list.push(
        // <Row className="justify-content-md-center">
        //   <Col className="justify-content-md-center">
        //   <OverlayTrigger
        //     placement='auto'
        //     trigger="click"
        //     overlay={
        //       <Tooltip>
        //         <a href="https://www.w3schools.com" target="_blank">Send me an email</a>
        //       </Tooltip>
        //     }
        //   >
        //     <img
        //       class="circular"
        //       src={people[x].profilePicture}
        //       alt="user"
        //       width="50"
        //       height="50"
        //     />
        //   </OverlayTrigger>
        //   </Col>
        //   <Col key={people[x].id} xs={8} className="text-left">
        //     {people[x].name}&nbsp;{people[x].surname}
        //   </Col>
        //   <Row>
        //     <br />
        //   </Row>
          
        // </Row>
        <Card>
          <div class="row no-gutters">
            <div class="col-auto">
              <img class="circular"
                src={people[x].profilePicture}
                alt="user"
              />
            </div>
            <div class="col">
              <div class="card-block px-2">
                {/* <h4 class="card-title">{people[x].name}&nbsp;{people[x].surname}</h4> */}
                <h4>{people[x].name}&nbsp;{people[x].surname}</h4>
                <a href="https://www.w3schools.com" target="_blank">Send me an email</a>
              </div>
            </div>
          </div>
        </Card>
      );
    }
    return list;
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), { long: true });
  }

  render() {
    let taskUsers = this.classifyExistingUsers();
    let taskPacMans = taskUsers[0];
    let taskResPersons = taskUsers[1];
    let taskResources = taskUsers[2];

    let progressColor = "info";

    return (
      <React.Fragment>
        <Container
          className="text-dark text-center bg-light py-2"
          style={{ fontSize: "19px", wordWrap: "break-word" }}
        >
          <Row className="text-center align-items-center">
            <Col></Col>
            <Col xs={5} className="text-center">
              {this.props.viewId !== null ? (
                <h4>
                  {this.props.task.name}
                  <br />
                  (View)
                </h4>
              ) : (
                <h4>{this.props.task.name}</h4>
              )}
            </Col>
            <Col className="text-right">
              <Button
                className="btn-light border-dark m-0"
                onClick={() => this.props.toggleSidebar(null, null)}
              >
                <i className="fa fa-close"></i>
              </Button>
            </Col>
          </Row>
          <Row className="p-1">
            <Col className="text-center">{this.props.task.description}</Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">Task Id: {this.props.task.id}</Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Start Date: {this.props.task.startDate.replace("T", " ")}
            </Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              End Date: {this.props.task.endDate.replace("T", " ")}
            </Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Duration:{" "}
              {this.CalcDiff(
                this.props.task.startDate,
                this.props.task.endDate
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar
                variant={progressColor}
                now={this.props.task.progress}
                striped
                label={`${Math.round(this.props.task.progress)}%`}
              />
            </Col>
          </Row>
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
          <Row className="my-2">
            <Col xs={12} className="text-center">
              <CloneTask
                task={this.props.task}
                project={this.props.project}
                setTaskInfo={this.props.setTaskInfo}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {this.props.userPermission["delete"] === true ? (
                <DeleteTask
                  task={this.props.task}
                  setTaskInfo={this.props.setTaskInfo}
                  getProjectInfo={this.props.getProjectInfo}
                  toggleSidebar={this.props.toggleSidebar}
                  viewId={this.props.viewId}
                />
              ) : null}
            </Col>
          </Row>
          <hr />
          <b>Package managers:</b>
          <br />
          <br />
          {this.printUsers(taskPacMans)}
          <br />
          <b>Responsible persons:</b>
          <br />
          <br />
          {this.printUsers(taskResPersons)}
          <br />
          <b>Resources:</b>
          <br />
          <br />
          {this.printUsers(taskResources)}
          <br />
        </Container>
      </React.Fragment>
    );
  }
}

class DependencySidebar extends React.Component {
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), { long: true });
  }

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
            <Col></Col>
            <Col
              className="text-center"
              style={{ wordWrap: "break-word" }}
              xs={8}
            >
              <Row className="m-0">
                <Col className="text-center">
                  <h5>{start}</h5>
                </Col>
              </Row>
              <Row className="m-0">
                <Col className="text-center">
                  <h5>
                    <i className="fa fa-arrow-down"></i>
                  </h5>
                </Col>
              </Row>
              <Row className="m-0">
                <Col className="text-center">
                  <h5>{end}</h5>
                </Col>
              </Row>
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
          <Row className="text-center p-1">
            {this.props.dependency.relationshipType === "fs" ? (
              <Col className="text-center">
                End date of first task:{" "}
                {this.props.dependency.startDate.replace("T", " ")}
              </Col>
            ) : (
              <Col className="text-center">
                Start date of first task:{" "}
                {this.props.dependency.startDate.replace("T", " ")}
              </Col>
            )}
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Start date of second task:{" "}
              {this.props.dependency.endDate.replace("T", " ")}
            </Col>
          </Row>
          <Row className="text-center p-1">
            <Col className="text-center">
              Duration:{" "}
              {this.CalcDiff(
                this.props.dependency.startDate,
                this.props.dependency.endDate
              )}
            </Col>
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
            <Col>
              {this.props.userPermission["delete"] === true ? (
                <DeleteDependency
                  dependency={this.props.dependency}
                  getProjectInfo={this.props.getProjectInfo}
                  setTaskInfo={this.props.setTaskInfo}
                  toggleSidebar={this.props.toggleSidebar}
                  sourceView={this.props.sourceView}
                  targetView={this.props.targetView}
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

export default GraphPage;
