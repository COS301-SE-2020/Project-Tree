import React from "react";
import { ProgressBar, Container, Row, Col } from "react-bootstrap";

class ProjectDashboard extends React.Component {
  render() {
    let totalDur = 0, completeDur = 0, percentage = 0, color = "success";
    this.props.tasks.forEach(task => {
      if(task.progress === "Complete") completeDur = completeDur + task.duration;
      totalDur += task.duration;
    });
    if(totalDur !== 0) percentage = completeDur / totalDur * 100;

    if (percentage < 33) color = "danger";
    else if (percentage < 66) color = "warning";

    return (
      <React.Fragment>
        <Container className="block  bg-light">
          <Row className="align-items-center bg-white py-2">
            <Col>
              <ProgressBar
                striped 
                variant={color}
                now={percentage}
                label={`${percentage}% Complete`}
              />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ProjectDashboard;
