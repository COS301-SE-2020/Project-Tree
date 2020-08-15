import React from "react";
import { ProgressBar, Row, Col } from "react-bootstrap";

class ProjectProgress extends React.Component {
  
  getProjectProgress(){
    let totalDur = 0, completeDur = 0, percentage = 0, color = "success";
    this.props.tasks.forEach(task => {
      if(task.progress === "Complete") completeDur = completeDur + task.duration;
      totalDur += task.duration;
    });
    if(totalDur !== 0) percentage = completeDur / totalDur * 100;

    if (percentage < 33) color = "danger";
    else if (percentage < 66) color = "warning";

    return (<ProgressBar
      striped 
      variant={color}
      now={percentage}
      label={`${Math.round(percentage)}% Complete`}
    />);
  }

  getCPProgress(){
    let totalDur = 0, completeDur = 0, percentage = 0, color = "success";
    if (this.props.criticalPath !== null && this.props.criticalPath.path !== null)
      this.props.criticalPath.path.segments.forEach((el, i) => {
        if(i === 0){
          if(el.start.properties.progress === "Complete") completeDur = completeDur + el.start.properties.duration.low;
          totalDur += el.start.properties.duration.low;
        }
        if(el.end.properties.progress === "Complete") completeDur = completeDur + el.end.properties.duration.low;
        totalDur += el.end.properties.duration.low;
      });
    if(totalDur !== 0) percentage = completeDur / totalDur * 100;

    if (percentage < 33) color = "danger";
    else if (percentage < 66) color = "warning";
    return (<ProgressBar
      striped 
      variant={color}
      now={percentage}
      label={`${Math.round(percentage)}% Complete`}
    />);
  }

  render() {
    

    return (
      <React.Fragment>
        <Row className="align-items-center bg-white">
          <Col md={12} lg={6} style={{fontSize: "20px"}}>
            Total Progress: {this.getProjectProgress()}
          </Col>
          <Col md={12} lg={6} style={{fontSize: "20px"}}>
            Critical Path Progress: {this.getCPProgress()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ProjectProgress;
