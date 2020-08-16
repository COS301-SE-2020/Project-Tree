import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";
import ProjectProgress from "./ProjectProgress";
import NoticeBoard from "../Notifications/NoticeBoard";


class ProjectPage extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      tasks: [], 
      criticalPath: null,
      noticeBoardRefreshKey:0
    };

    this.updateNoticeBoardRefreshKey = this.updateNoticeBoardRefreshKey.bind(this);
    
  }

  updateNoticeBoardRefreshKey(){
    this.setState({noticeBoardRefreshKey:this.state.noticeBoardRefreshKey+1})
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
        <Row className="my-1">
          <Col> 
            <ProjectProgress project={this.props.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/>
          </Col>
        </Row>
        <Row className="my-1">
          <Col sm={12} md={12} lg={6} xl={6}>
            <ProjectInfo 
              project={this.props.project} 
              setProject={project => this.props.setProject(project)}
              userPermission={this.props.userPermission}
              user={this.props.user}
              updateNoticeBoardRefreshKey={this.updateNoticeBoardRefreshKey}
            />
          </Col>
          <Col sm={12} md={12} lg={6} xl={6} style={{ overflowY: "auto"}}> 
            {this.props.project != null && this.props.user != null ? <NoticeBoard project={this.props.project} user={this.props.user} refreshKey={this.state.noticeBoardRefreshKey}/> : null}
          </Col>
        </Row>
        <Row className="my-1">
          <Col>
            <TaskInfo project={this.props.project} tasks={this.state.tasks} criticalPath={this.state.criticalPath}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;