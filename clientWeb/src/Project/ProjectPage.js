import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";
import ProjectDashboard from "./ProjectDashboard";
import NoticeBoard from "../Notifications/NoticeBoard";


class ProjectPage extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { 
      project: this.props.project, 
      tasks: [], 
      criticalPath: null 
    };
    
  }

  componentDidMount(){
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
      <Container fluid>
        <Row className="m-2">
          <Col>
            <ProjectInfo 
              project={this.props.project} 
              setProject={project => this.props.setProject(project)}
              userPermission={this.props.userPermission}
              user={this.props.user}
            />
          </Col>
          <Col style={{border: "black solid 1px", overflowY: "scroll", height: "366px"}} className="border rounded"> 
            {this.props.project != null && this.props.user != null ? <NoticeBoard project={this.props.project} user={this.props.user}/> : null}
          </Col>
          <Col style={{border: "black solid 1px"}} className="border rounded"> 
            <ProjectDashboard project={this.props.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/>
          </Col>
        </Row>
        <Row  className="m-1" >
          <Col><TaskInfo project={this.props.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/></Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;