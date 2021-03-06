import React from "react";
import { Container, Row, Col, ProgressBar } from "react-bootstrap";

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
        label={`${Math.round(percentage)}%`}
        striped
      />
    );
  }

  getCPProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0,
      color = "info";
    if (
      this.props.criticalPath !== null &&
      this.props.criticalPath.path !== null &&
      this.props.criticalPath.path !== undefined
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

    return (
      <ProgressBar
        variant={color}
        now={percentage}
        label={`${Math.round(percentage)}%`}
        striped
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="align-items-center bg-white">
            <Col>
              <h4>Project Progress</h4>
            </Col>
          </Row>
          <Row className="align-items-center bg-white">
            <Col sm={12} style={{ fontSize: "20px" }}>
              Total Progress: {this.getProjectProgress()}
            </Col>
            <Col sm={12} style={{ fontSize: "20px" }}>
              Critical Path Progress: {this.getCPProgress()}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
