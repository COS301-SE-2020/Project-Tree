import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectInfoComponent from "./ProjectInfoComponet";
import ProjectProgressComponent from "./ProjectProgressComponent";
import DependencyPieChartsComponent from "./DependencyPieChartsComponent";
import TaskOverviewComponent from "./TaskOverviewComponent";
import CriticalPathBarCharts from "./CriticalPathBarCharts";

class ProjectAnalytic extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          {this.props.displayProjectName ?
          <Col xs={12} sm={12} md={6} lg={4} xl={4} className="m-0 p-2 border">
            <ProjectInfoComponent project={this.props.project.projectInfo} setProject={this.props.setProject}/>
          </Col>
          :null}
          <Col xs={12} sm={12} md={6} lg={8} xl={4} className="m-0 p-2 border">
            <ProjectProgressComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={4} className="m-0 p-2 border">
            <TaskOverviewComponent />
          </Col>
          <Col xs={12} sm={12} md={6} lg={8} xl={5} className="m-0 p-2 border">
            <DependencyPieChartsComponent />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={7} className="m-0 p-2 border">
            <CriticalPathBarCharts />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectAnalytic;
