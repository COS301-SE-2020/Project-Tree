import React from "react";
import { ProgressBar, Row, Col } from "react-bootstrap";

class ProjectProgress extends React.Component {
  getProjectProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0,
      color = "info";
    this.props.project.tasks.forEach((task) => {
      completeDur += task.progress;
      totalDur += 100;
    });
    if (totalDur !== 0) percentage = (completeDur / totalDur) * 100;

    return (
      <ProgressBar
        striped
        variant={color}
        now={percentage}
        label={`${Math.round(percentage)}%`}
      />
    );
  }

  getCPProgress() {
    let totalDur = 0,
      completeDur = 0,
      percentage = 0,
      color = "info";
    if (
      this.props.project.criticalPath !== {} &&
      this.props.project.criticalPath.path !== null &&
      this.props.project.criticalPath.path !== undefined
    )
      this.props.project.criticalPath.path.segments.forEach((el, i) => {
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
        <Row className="align-items-center bg-white mb-2 mt-2" style={{ fontSize: "20px" }}>
            <Col>
              Total Progress: 
            </Col>
            <Col xs={8}>
             {this.getProjectProgress()}
            </Col>
        </Row>
        <Row className="align-items-center bg-white mb-2 mt-2" style={{ fontSize: "20px" }}>
            <Col>
              Critical Path Progress: 
            </Col>
            <Col xs={8}>
              {this.getCPProgress()}
            </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ProjectProgress;
