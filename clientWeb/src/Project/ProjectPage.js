import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { project: this.props.project };
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.setState({ project: this.props.project });
    }
  }

  render() {
    return (
      <Container fluid className="py-2">
        <Row>
          <Col sm={12} md={6} xl={4} style={{border: "blue solid 1px"}}><ProjectInfo project={this.state.project} setProject={project => this.props.setProject(project)}/></Col>
          <Col sm={12} md={6} xl={8} style={{border: "blue solid 1px"}}>more project info</Col>
        </Row>
        <Row style={{border: "blue solid 1px"}}>
          <Col xs={12} sm={12} style={{border: "blue solid 1px"}}><TaskInfo project={this.state.project}/></Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;