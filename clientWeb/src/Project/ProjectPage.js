import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { project: this.props.project, tasks: [], criticalPath: null };
    
  }

  componentDidMount(){
    $.post( "/project/projecttasks", {projId: this.state.project.id} , response => {
      this.setState({tasks: response.tasks})
    })
    .fail(() => {
        alert( "Unable to get tasks" );
    })
    $.post( "/project/criticalpath", {projId: this.state.project.id} , response => {
      this.setState({criticalPath: response})
    })
    .fail(() => {
        alert( "Unable to get Critical Path" );
    })
    
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      console.log("Here");
      this.setState({ project: this.props.project });
      $.post( "/project/projecttasks", {projId: this.props.project.id} , response => {
        this.setState({tasks: response.tasks})
      })
      .fail(() => {
          alert( "Unable to get tasks" );
      })
      $.post( "/project/criticalpath", {projId: this.props.project.id} , response => {
        this.setState({criticalPath: response})
      })
      .fail(() => {
          alert( "Unable to get Critical Path" );
      })
    }
    
  }

  render() {
    return (
      <Container fluid className="py-2" style={{height: "50%"}}>
        <Row className="m-2">
          <Col sm={12} md={6} xl={4}><ProjectInfo project={this.state.project} setProject={project => this.props.setProject(project)}/></Col>
          <Col sm={12} md={6} xl={8} style={{border: "blue solid 1px"}}>more project info</Col>
        </Row>
        <Row style={{height: "100%",border: "blue solid 1px"}}>
          <Col xs={12} sm={12} style={{border: "blue solid 1px"}}><TaskInfo project={this.state.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/></Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;