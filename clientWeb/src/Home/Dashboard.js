import React from "react";
import Calendar from "./Calendar";
import ProjectAnalytic from "../ProjectAnalytics/ProjectAnalytic";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.ProjectAnalyticList = this.ProjectAnalyticList.bind(this);
  }

  ProjectAnalyticList() {
    let items = [];
    this.props.ownedProjects.forEach((project) => {
      items.push(
        <Col
          key={project.projectInfo.id.toString()}
          id={project.projectInfo.id.toString()}
          xl={12}
          lg={12}
          className="m-2"
          style={{ width: "100%" }}
        >
          <ProjectAnalytic
            project={project}
            displayProjectName={true}
            setProject={this.props.setProject}
            owned={true}
          />
          <hr style={{ backgroundColor: "#EEBB4D", height: "4px" }} />
        </Col>
      );
    });
    this.props.otherProjects.forEach((project) => {
      items.push(
        <Col
          key={project.projectInfo.id.toString()}
          id={project.projectInfo.id.toString()}
          xl={12}
          lg={12}
          className="m-2"
          style={{ width: "100%" }}
        >
          <ProjectAnalytic
            project={project}
            displayProjectName={true}
            setProject={this.props.setProject}
          />
          <hr style={{ backgroundColor: "#EEBB4D", height: "4px" }} />
        </Col>
      );
    });
    return items;
  }

  MakeDropdown() {
    let ownedProjects = [];
    this.props.ownedProjects.forEach((project) => {
      ownedProjects.push(
        <Dropdown.Item
          key={project.projectInfo.id.toString()}
          href={"#" + project.projectInfo.id.toString()}
        >
          {project.projectInfo.name}
        </Dropdown.Item>
      );
    });

    let otherProjects = [];
    this.props.otherProjects.forEach((project) => {
      otherProjects.push(
        <Dropdown.Item
          key={project.projectInfo.id.toString()}
          href={"#" + project.projectInfo.id.toString()}
        >
          {project.projectInfo.name}
        </Dropdown.Item>
      );
    });

    return (
      <Dropdown>
        <Dropdown.Toggle variant="warning" id="dropdown-basic">
          Jump To Project
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Header>Owned Projects</Dropdown.Header>
          {ownedProjects}
          <Dropdown.Header>Other Projects</Dropdown.Header>
          {otherProjects}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid className="mt-2" id="top">
          <Row>
            <Col className="p-1" style={{position:"fixed", zIndex:"8"}}>
              <a href="#top">
                <Button variant="warning">Jump To Top</Button>
              </a>
            </Col>
            <Col sm={0}></Col>
            <Col sm={12} md={4} className="text-center">
              <h1 style={{ fontWeight: "bold" }}>Project Dashboard</h1>
            </Col>
            <Col sm={12} md={4}>
              <Row>
                <Col sm={12} xl={6} className="text-center p-1" style={{ zIndex:"90"}}>
                  {this.MakeDropdown()}
                </Col>
                <Col sm={12} xl={6} className="text-center p-1" style={{ zIndex:"90"}}>
                  <a href="#calendar">
                    <Button variant="warning">Jump To Calendar</Button>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{width:"100%"}}>
            <Container fluid className="p-0">
              <Row>{this.ProjectAnalyticList()}</Row>
              <Row style={{ marginTop: "2em", marginBottom: "2em" }}>
                <Col className="text-center">
                  <h1 id="calendar">Calendar</h1>
                  <hr style={{ backgroundColor: "#EEBB4D", width: "50%" }} />
                  <Calendar
                    ownedProjects={this.props.ownedProjects}
                    otherProjects={this.props.otherProjects}
                  />
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Dashboard;
