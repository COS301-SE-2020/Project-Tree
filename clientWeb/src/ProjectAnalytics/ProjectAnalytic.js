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
        <Container fluid className="border mt-4" style={{height:'40em'}}>
          <Row style={{height:"8em"}}>
            {this.props.displayProjectName ?
            <Col>
              <ProjectInfoComponent project={this.props.project.projectInfo}/>
            </Col>
            :null}
            <Col>
              <ProjectProgressComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
            </Col>
          </Row>
          <Row style={{height:"16em"}}>
            <Col xs={8}>
              <DependencyPieChartsComponent />
            </Col>
            <Col>
              <TaskOverviewComponent />
            </Col>
          </Row>
          <Row style={{height:"16em"}}>
            <Col>
              <CriticalPathBarCharts />
            </Col>
          </Row>
        </Container>
    );
  }
}

export default ProjectAnalytic;
