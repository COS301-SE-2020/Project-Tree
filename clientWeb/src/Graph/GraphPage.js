import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";
import Graph from "./Graph";
import DeleteTask from "./Task/DeleteTask";
import UpdateTask from "./Task/UpdateTask";
import UpdateProgress from "./Task/UpdateProgress";
import UpdateDependency from "./Dependency/UpdateDependency";
import DeleteDependency from "./Dependency/DeleteDependency";
import $ from "jquery";

class GraphPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = { project: this.props.project, task:null, dependency:null, nodes:null, links:null};
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.setTaskInfo = this.setTaskInfo.bind(this);
    this.getProjectInfo = this.getProjectInfo.bind(this);
  }

  componentDidMount() {
    $.post( "/getProject", {id: this.state.project.id} , response => {
      this.setState({ nodes: response.tasks, links: response.rels });
    })
    .fail(err => {
      throw Error(err);
    });
  }

  componentDidUpdate(prevProps){
    if (this.props.project !== prevProps.project) {
      $.post( "/getProject", {id: this.props.project.id} , response => {
        this.setState({ project: this.props.project, nodes: response.tasks, links: response.rels });
      })
      .fail(err => {
        throw Error(err);
      })
    }
  }

  getProjectInfo() {
    return { nodes: this.state.nodes, rels: this.state.links };
  }

  setTaskInfo(nodes, rels, displayNode, displayRel) {
    if (nodes !== undefined && rels !== undefined) {
      this.setState({ nodes: nodes, links: rels });

      if (displayNode !== undefined || displayRel !== undefined) {
        this.toggleSidebar(displayNode, displayRel);
      }

      return;
    }
    $.post( "/getProject", { id: this.state.project.id } , response => {
      this.setState({ nodes: response.tasks, links: response.rels });
    })
    .fail(err => {
      throw Error(err);
    })    
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
        <Container fluid style={{height:"100%", width: "100%"}}>
          <Row className="h-100">
            <Col className="text-center block-example border-right border-secondary bg-light">
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
                  project={this.state.project}
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
        <Container className="text-dark text-center bg-light py-2">
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
            <Col></Col>
            <Col xs={8}>{this.props.task.description}</Col> 
            <Col></Col>
              
          </Row>
          <Row className="text-center p-1" >
            <Col></Col>
            <Col xs={8}>Start Date: {startDate}</Col> 
            <Col></Col>
          </Row>
          <Row className="text-center p-1">
            <Col></Col>
            <Col xs={8}>End Date: {endDate}</Col> 
            <Col></Col>
          </Row>
          <Row className="text-center p-1">
            <Col></Col>
            <Col xs={8}>Duration: {this.props.task.duration}</Col> 
            <Col></Col>
              
          </Row>
          <Row>
              <UpdateTask
                task={this.props.task}
                setTaskInfo={this.props.setTaskInfo}
                getProjectInfo={this.props.getProjectInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
              <UpdateProgress
                task={this.props.task}
                setTaskInfo={this.props.setTaskInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
          </Row>
          <hr/>
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
        <Container className="text-black text-center py-2">
          <Row>
            <Col>
              <DeleteDependency
                dependency={this.props.dependency}
                getProjectInfo={this.props.getProjectInfo}
                setTaskInfo={this.props.setTaskInfo}
                toggleSidebar={this.props.toggleSidebar}
              />
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
            <Col xs={8}>
              Duration: {this.props.dependency.duration}
            </Col>
            <Col></Col>
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
          <hr/>
        </Container>
      </React.Fragment>
    );
  }
}

export default GraphPage;
