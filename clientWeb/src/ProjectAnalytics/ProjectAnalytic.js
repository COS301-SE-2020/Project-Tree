import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProjectInfoComponent from "./ProjectInfoComponet";
import ProjectProgressComponent from "./ProjectProgressComponent";
import DependencyPieChartsComponent from "./DependencyPieChartsComponent";
import TaskOverviewComponent from "./TaskOverviewComponent";
import CriticalPathBarCharts from "./CriticalPathBarCharts";
import ScheduleTrackingComponent from "./ScheduleTrackingComponent";

class ProjectAnalytic extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          {this.props.displayProjectName ?
          <Col xs={12} sm={12} md={6} lg={4} xl={4} className="m-0 p-2 border">
            <ProjectInfoComponent project={this.props.project} setProject={this.props.setProject}/>
          </Col>
          :null}
          <Col xs={12} sm={12} md={6} lg={8} xl={4} className="m-0 p-2 border">
            <ProjectProgressComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={4} className="m-0 p-2 border">
            <TaskOverviewComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
          </Col>
         <Col xs={12} sm={12} md={6} lg={8} xl={5} className="m-0 p-2 border">
            <DependencyPieChartsComponent tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath} rels={this.props.project.rels}/>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={7} className="m-0 p-2 border">
            <CriticalPathBarCharts tasks={this.props.project.tasks} criticalPath={this.props.project.criticalPath}/>
          </Col>
          <Col className="m-0 p-2 border">
            <ScheduleTrackingComponent tasks={this.props.project.tasks} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectAnalytic;
