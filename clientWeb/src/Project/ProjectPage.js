import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";
import NoticeBoard from "../Notifications/NoticeBoard";
import GanttChart from "./GanttChart";


class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      criticalPath: null,
      noticeBoardRefreshKey: 0,
      messages: null,
    };

    this.updateNoticeBoardRefreshKey = this.updateNoticeBoardRefreshKey.bind(this
    );
  }

  async updateNoticeBoardRefreshKey() {
    let data = {
      projID: this.props.project.id,
      userID: this.props.user.id,
    };

    data = JSON.stringify(data);
    await new Promise(r => setTimeout(r, 2000));

    $.post("/retrieveNotifications", JSON.parse(data), (response) => {
      this.setState({ messages: response.notifications });
    }).fail(() => {
      alert("Unable to fetch notifications");
    });

  }

  componentDidMount() {
    $.post(
      "/project/projecttasks",
      { projId: this.props.project.id },
      (response) => {
        this.setState({ tasks: response.tasks });
      }
    ).fail(() => {
      alert("Unable to get tasks");
    });
    $.post(
      "/project/criticalpath",
      { projId: this.props.project.id },
      (response) => {
        this.setState({ criticalPath: response });
      }
    ).fail(() => {
      alert("Unable to get Critical Path");
    });
    let data = {
      projID: this.props.project.id,
      userID: this.props.user.id,
    };

    data = JSON.stringify(data);

    $.post("/retrieveNotifications", JSON.parse(data), (response) => {
      this.setState({ messages: response.notifications });
    }).fail(() => {
      alert("Unable to fetch notifications");
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      $.post(
        "/project/projecttasks",
        { projId: this.props.project.id },
        (response) => {
          this.setState({ tasks: response.tasks });
        }
      ).fail(() => {
        alert("Unable to get tasks");
      });
      $.post(
        "/project/criticalpath",
        { projId: this.props.project.id },
        (response) => {
          this.setState({ criticalPath: response });
        }
      ).fail(() => {
        alert("Unable to get Critical Path");
      });
      let data = {
        projID: this.props.project.id,
        userID: this.props.user.id,
      };
  
      data = JSON.stringify(data);
  
      $.post("/retrieveNotifications", JSON.parse(data), (response) => {
        this.setState({ messages: response.notifications });
      }).fail(() => {
        alert("Unable to fetch notifications");
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row className="my-1">
          <Col 
            sm={12}
            md={12}
            lg={6}
            xl={6}
          >
            <ProjectInfo
              project={this.props.project}
              setProject={(project) => this.props.setProject(project)}
              userPermission={this.props.userPermission}
              user={this.props.user}
              updateNoticeBoardRefreshKey={this.updateNoticeBoardRefreshKey}
              tasks={this.state.tasks}
              criticalPath={this.state.criticalPath}
            />
          </Col>
          <Col
            sm={12}
            md={12}
            lg={6}
            xl={6}
          >
            {this.props.project != null && this.props.user != null ? (
              <NoticeBoard
                messages={this.state.messages}
                refreshKey={this.state.noticeBoardRefreshKey}
              />
            ) : null}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col style={{ color: "#EEBB4D" }}>
              <h3>Tasks</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <TaskInfo
              project={this.props.project}
              tasks={this.state.tasks}
              criticalPath={this.state.criticalPath}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col style={{ color: "#EEBB4D" }}>
              <h3>Gant Chart</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <GanttChart project={this.props.project} criticalPathTasks={this.state.criticalPath}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;
