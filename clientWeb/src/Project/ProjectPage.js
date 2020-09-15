import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectInfo from "./ProjectInfo";
import TaskInfo from "./TaskInfo";
import $ from "jquery";
import NoticeBoard from "../Notifications/NoticeBoard";
import GanttChart from "./GanttChart";
import ProjectAnalytic from "../ProjectAnalytics/ProjectAnalytic"


class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeBoardRefreshKey: 0,
      messages: null,
    };

    this.updateNoticeBoardRefreshKey = this.updateNoticeBoardRefreshKey.bind(this
    );
  }

  async updateNoticeBoardRefreshKey() {
    let data = {
      projID: this.props.project.projectInfo.id,
      userID: this.props.user.id,
    };

    data = JSON.stringify(data);
    await new Promise(r => setTimeout(r, 4000));

    $.post("/retrieveNotifications", JSON.parse(data), (response) => {
      this.setState({ messages: response.notifications });
    }).fail(() => {
      alert("Unable to fetch notifications");
    });

  }

  componentDidMount() {
    let data = {
      projID: this.props.project.projectInfo.id,
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
      let data = {
        projID: this.props.project.projectInfo.id,
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

        <Row className="mt-3">
          <Col style={{ color: "#EEBB4D" }}>
              <h3>Analytics</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <ProjectAnalytic project={this.props.project} displayProjectName={false}/>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col style={{ color: "#EEBB4D" }}>
              <h3>Tasks</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <TaskInfo
              project={this.props.project}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col style={{ color: "#EEBB4D" }}>
              <h3>Gantt Chart</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <GanttChart 
              project={this.props.project}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;
