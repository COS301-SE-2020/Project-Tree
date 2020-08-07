import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";
import ProgressDashboard from "./ProgressDashboard";

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
      <Container fluid className="py-2" style={{height: "40%"}}>
        <Row className="m-2">
          <Col sm={12} md={6} xl={4}><ProjectInfo project={this.state.project} setProject={project => this.props.setProject(project)}/></Col>
          <Col sm={12} md={6} xl={8} style={{border: "black solid 1px"}}> <ProgressDashboard/></Col>
        </Row>
        <Row style={{height: "100%"}} className="m-1" >
          <Col xs={12} sm={12}><TaskInfo project={this.state.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/></Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;