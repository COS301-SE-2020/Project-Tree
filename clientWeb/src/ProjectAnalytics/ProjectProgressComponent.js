import React from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";

export default class ProjectProgressComponent extends React.Component {
  getProjectProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0,
      color = "info";
    this.props.tasks.forEach((task) => {
      completeDur += task.progress;
      totalDur += 100;
    });
    if (totalDur !== 0) percentage = (completeDur / totalDur) * 100;

    return (
      <ProgressBar
        variant={color}
        now={percentage}
        label={`${Math.round(percentage)}% Complete`}
      />
    );
  }

  getCPProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0,
      color = "success";
    if (
      this.props.criticalPath !== null &&
      this.props.criticalPath.path !== null
    )
      this.props.criticalPath.path.segments.forEach((el, i) => {
        if (i === 0) {
          completeDur += el.start.properties.progress.low;
          totalDur += 100;
        }
        completeDur += el.end.properties.progress.low;
        totalDur += 100;
      });
    if (totalDur !== 0) percentage = (completeDur / totalDur) * 100;

    if (percentage < 33) color = "danger";
    else if (percentage < 66) color = "warning";
    return (
      <ProgressBar
        striped
        variant={color}
        now={percentage}
        label={`${Math.round(percentage)}%`}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row className="align-items-center bg-white">
            <h4>Project Progress</h4>
        </Row>
        <Row className="align-items-center bg-white">
          <Col sm={12} style={{ fontSize: "20px" }}>
            Total Progress: {this.getProjectProgress()}
          </Col>
          <Col sm={12} style={{ fontSize: "20px" }}>
            Critical Path Progress: {this.getProjectProgress()}
            {/* Critical Path Progress: {this.getCPProgress()} */}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}