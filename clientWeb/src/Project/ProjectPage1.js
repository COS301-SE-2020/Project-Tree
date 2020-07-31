import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import $ from "jquery";

import CreateProject from "./CreateProject";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: null, project: null };
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.setProjectInfo = this.setProjectInfo.bind(this);
  }

  toggleSideBar(newProject) {
    if (this.state.project === newProject) {
      this.setState({ project: null });
    } else {
      this.setState({ project: newProject });
    }
  }

  componentDidMount() {
    $.post("/project/get", (response) => {
      this.setState({ projects: response.nodes });
    }).fail((response) => {
      throw Error(response.message);
    });
  }

  setProjectInfo(project) {
    let projects = this.state.projects;
    if (project.delete === undefined) {
      projects = projects.map((proj) => {
        if (proj.id === project.id) proj = project;
        return proj;
      });
      if (JSON.stringify(projects) === JSON.stringify(this.state.projects))
        projects.push(project);
      this.setState({ projects: projects, project: project });
    } else {
      projects = projects.filter((proj) => proj.id !== project.delete);
      this.setState({ projects: projects });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid>
          <Row className="py-4">
            <Col>
              <ProjectList
                projects={this.state.projects}
                toggleSideBar={this.toggleSideBar}
              />
              <CreateProject
                setProjectInfo={this.setProjectInfo}
                toggleSideBar={this.toggleSideBar}
              />
            </Col>
            <Col xs={6} className="text-center">
              Under construction - JointJS
            </Col>
            <Col className="text-center">
              {this.state.project != null ? (
                <Sidebar
                  toggleSideBar={this.toggleSideBar}
                  setProjectInfo={this.setProjectInfo}
                  toggleGraphPage={this.props.toggleGraphPage}
                  project={this.state.project}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ProjectPage;