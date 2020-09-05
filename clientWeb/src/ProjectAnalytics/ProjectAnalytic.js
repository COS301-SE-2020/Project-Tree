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
    console.log(this.props.project)
    return (
        <Container className="border primary">
          <Row>
            <br></br>
          </Row>
          <Row>
            {this.props.displayProjectName ?
            <Col>
              <ProjectInfoComponent project={this.props.project.projectInfo}/>
            </Col>
            :null}
            <Col>
              <ProjectProgressComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <DependencyPieChartsComponent />
            </Col>
            <Col>
              <TaskOverviewComponent />
            </Col>
          </Row>
          <Row>
            <Col>
              <CriticalPathBarCharts />
            </Col>
          </Row>
        </Container>
    );
  }
}

export default ProjectAnalytic;
