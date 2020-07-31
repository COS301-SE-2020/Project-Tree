import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Graph from "./Graph";
import DeleteTask from "./Task/DeleteTask";
import UpdateTask from "./Task/UpdateTask";
import UpdateProgress from "./Task/UpdateProgress";
import UpdateDependency from "./Dependency/UpdateDependency";
import DeleteDependency from "./Dependency/DeleteDependency";

class GraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { task: null, dependency: null, nodes: null, links: null };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.setTaskInfo = this.setTaskInfo.bind(this);
    this.getProjectInfo = this.getProjectInfo.bind(this);
  }

  async componentDidMount() {
    const response = await fetch("/getProject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.project.id }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body.tasks);
    console.log(body.rels);
    this.setState({ nodes: body.tasks, links: body.rels });
  }

  async getProjectInfo() {
    return { nodes: this.state.nodes, rels: this.state.links };
  }

  async setTaskInfo(nodes, rels, displayNode, displayRel) {
    if (nodes !== undefined && rels !== undefined) {
      this.setState({ nodes: nodes, links: rels });

      if (displayNode !== undefined || displayRel !== undefined) {
        this.toggleSidebar(displayNode, displayRel);
      }

      return;
    }

    const response = await fetch("/getProject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.project.id }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    this.setState({ nodes: body.tasks, links: body.rels });
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
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col className="text-center block-example border border-secondary bg-light">
              <br />
              <ProjectDetails
                toggleGraphPage={this.props.toggleGraphPage}
                project={this.props.project}
              />
              {this.state.source != null ? (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => this.toggleCreateDependency(null)}
                >
                  X
                </Button>
              ) : null}
              <Button size="sm" variant="secondary" block>
                Display Critical Path - Under Construction
              </Button>
              <br />{" "}
              {this.state.task !== null ? (
                <TaskSidebar
                  task={this.state.task}
                  toggleSidebar={this.toggleSidebar}
                  setTaskInfo={this.setTaskInfo}
                  getProjectInfo={this.getProjectInfo}
                />
              ) : null}
              {this.state.dependency !== null ? (
                <DependencySidebar
                  project={this.props.project}
                  dependency={this.state.dependency}
                  nodes={this.state.nodes}
                  setTaskInfo={this.setTaskInfo}
                  toggleSidebar={this.toggleSidebar}
                  getProjectInfo={this.getProjectInfo}
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
                  project={this.props.project}
                  nodes={this.state.nodes}
                  links={this.state.links}
                  setTaskInfo={this.setTaskInfo}
                  toggleSidebar={this.toggleSidebar}
                  getProjectInfo={this.getProjectInfo}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { permissions: false };
    this.togglePermissions = this.togglePermissions.bind(this);
    this.permissionsTable = this.permissionsTable.bind(this);
  }

  togglePermissions() {
    this.setState({ permissions: !this.state.permissions });
  }

  permissionsTable() {
    return (
      <Table className="mt-2" striped bordered size="sm" variant="light">
        <tbody>
          <tr>
            <td></td>
            <td>Create </td>
            <td>Delete </td>
            <td>Update </td>
          </tr>
          <tr>
            <td>Package Manager</td>
            <td>{this.props.project.permissions[0] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[1] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[2] === true ? "X" : null}</td>
          </tr>
          <tr>
            <td>Responsible Person</td>
            <td>{this.props.project.permissions[3] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[4] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[5] === true ? "X" : null}</td>
          </tr>
          <tr>
            <td>Resource</td>
            <td>{this.props.project.permissions[6] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[7] === true ? "X" : null}</td>
            <td>{this.props.project.permissions[8] === true ? "X" : null}</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <br />{" "}
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
              <p>{this.props.project.description}</p>
            </Col>
            <Col></Col>
          </Row>
        </Container>

        <Button variant="dark" block size="sm" onClick={this.togglePermissions}>
          Permissions {this.state.permissions ? "\u25B4" : "\u25BE"}
        </Button>
        {this.state.permissions ? <this.permissionsTable /> : null}
        <hr></hr>
      </React.Fragment>
    );
  }
}

class TaskSidebar extends React.Component {
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

    return (
      <React.Fragment>
        <Container className="text-white text-center rounded mb-0 border border-secondary bg-dark py-2">
          <Row className="text-center">
            <Col>
              {" "}
              <DeleteTask
                task={this.props.task}
                setTaskInfo={this.props.setTaskInfo}
                getProjectInfo={this.props.getProjectInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
            </Col>
            <Col xs={6}>
              <h1>{this.props.task.name}</h1>
            </Col>
            <Col className="text-right">
              <Button
                className="btn-dark"
                onClick={() => this.props.toggleSidebar(null, null)}
              >
                <i className="fa fa-close"></i>
              </Button>
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <p>{this.props.task.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Start Date: {startDate}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>End Date: {endDate}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Duration: {this.props.task.duration}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <UpdateTask
                task={this.props.task}
                setTaskInfo={this.props.setTaskInfo}
                getProjectInfo={this.props.getProjectInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
            </Col>
            <Col>
              <UpdateProgress
                task={this.props.task}
                setTaskInfo={this.props.setTaskInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
            </Col>
          </Row>
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
        <Container className="text-white text-center rounded mb-0 border border-secondary bg-dark py-2">
          <Row>
            <Col>
              <DeleteDependency
                dependency={this.props.dependency}
                getProjectInfo={this.props.getProjectInfo}
                setTaskInfo={this.props.setTaskInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
            </Col>
            <Col xs={6}>
              <h3>{start + "→" + end}</h3>
            </Col>
            <Col className="text-right">
              <Button
                className="btn-dark"
                onClick={() => this.props.toggleSidebar(null, null)}
              >
                <i className="fa fa-close"></i>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                {this.props.dependency.relationshipType === "fs"
                  ? "Finish-Start"
                  : "Start-Start"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Duration: {this.props.dependency.duration}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <UpdateDependency
                project={this.props.project}
                dependency={this.props.dependency}
                getProjectInfo={this.props.getProjectInfo}
                setTaskInfo={this.props.setTaskInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default GraphPage;
