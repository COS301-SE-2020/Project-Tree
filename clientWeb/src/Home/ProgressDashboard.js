import React from "react";
import { ProgressBar, Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import $ from "jquery";

class ProgressDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { progressInfo: null, projects: null };
    this.getProjectProgress = this.getProjectProgress.bind(this);
  }

  async getProjectProgress(info, projects) {
    var currentId = info[0].projectId;
    var totalDuartion = 0;
    var completeDuration = 0;
    var projectName = info[0].projectName;
    var projectProgress = [];

    for (var x = 0; x < info.length; x++) {
      if (info[x].projectId !== currentId) {
        projectProgress.push({
          name: projectName,
          id: currentId,
          progress: Math.round((completeDuration / totalDuartion) * 100),
        });

        currentId = info[x].projectId;
        projectName = info[x].projectName;
        totalDuartion = 0;
        completeDuration = 0;
      }

      completeDuration +=
        info[x].progress === "Complete" ? info[x].duration : 0;
      totalDuartion += info[x].duration;
    }

    projectProgress.push({
      name: projectName,
      id: currentId,
      progress: (completeDuration / totalDuartion) * 100,
    });

    this.setState({ progressInfo: projectProgress, projects: projects });
  }

  async componentDidMount() {
    $.post( "/project/progress", progress => {
      $.post( "/project/get", projects => {
        this.getProjectProgress(progress.response, projects.projects);
      })
      .fail(err => {
        throw Error(err);
      })
    })
    .fail(err => {
      throw Error(err);
    })
    
  }

  render() {
    console.log(this.state.progressInfo);
    console.log(this.state.projects );
    return (
      <ProgressList
        progressInfo={this.state.progressInfo}
        projects={this.state.projects}
      />
    );
  }
}

class ProgressList extends React.Component {
  constructor(props) {
    super(props);
    this.getColor = this.getColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    var id = parseInt(event.currentTarget.dataset.id);
    var project = null;

    for (var x = 0; x < this.props.projects.length; x++) {
      if (id === this.props.projects[x].id) {
        project = this.props.projects[x];
        break;
      }
    }

    if (project === null) {
      event.preventDefault();
      return;
    }

    sessionStorage.setItem("project", JSON.stringify(project));
    this.props.toggleGraphPage(project);
  }

  getColor(value) {
    if (value < 33) {
      return "danger";
    } else if (value < 66) {
      return "warning";
    } else {
      return "success";
    }
  }

  render() {
    if (this.props.progressInfo === null) {
      return null;
    }

    var listItems = [];
    var projects = this.props.progressInfo;

    for (var x = 0; x < projects.length; x++) {
      var currentVariant = this.getColor(projects[x].progress);
      listItems.push(
        <React.Fragment key={projects[x].id}>
          <Container className="block  bg-light">
            <Row className="align-items-center bg-white py-2">
              <Col className="text-left">
                <Link to="/graph">
                  <Button block style={{fontFamily:"Courier New", color: "#184D47", backgroundColor: "white", borderColor:"#EEBB4D"}} size="sm">
                    <h6
                      key={projects[x].id}
                      data-id={projects[x].id}
                      onClick={this.handleClick}
                    >
                      {projects[x].name}
                    </h6>
                  </Button>
                </Link>
              </Col>
              <Col className="text-left" xs={10}>
                <ProgressBar
                  variant={currentVariant}
                  now={projects[x].progress}
                  label={`${projects[x].progress}%`}
                />
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    }

    return listItems;
  }
}

export default ProgressDashboard;
