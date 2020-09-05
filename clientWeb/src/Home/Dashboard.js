import React from "react";
import { Redirect } from "react-router-dom";
import Calendar from "./Calendar";
import ProjectAnalytic from "../ProjectAnalytics/ProjectAnalytic";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import $ from "jquery";
import * as Scroll from 'react-scroll';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    let ownedProjects = [];
    let otherProjects = [];
    this.props.ownedProjects.forEach((project, i) => {
      ownedProjects[i] = {}
      ownedProjects[i].projectInfo = project;
      ownedProjects[i].criticalPath = {};
      ownedProjects[i].tasks = [];
      ownedProjects[i].rels = [];
    });
    this.props.otherProjects.forEach((project, i) => {
      otherProjects[i] = {}
      otherProjects[i].projectInfo = project;
      otherProjects[i].criticalPath = {};
      otherProjects[i].tasks = [];
      ownedProjects[i].rels = [];
    });
    this.state = {
      ownedProjects:ownedProjects,
      otherProjects:otherProjects
    };
  }

  componentDidMount() {
    this.state.ownedProjects.forEach((project, i) => {
      $.post("/getProject", { id: project.projectInfo.id }, (response) => {
        let ownedProjects = this.state.ownedProjects;
        ownedProjects[i].tasks = response.tasks;
        ownedProjects[i].rels = response.rels;
        this.setState({ ownedProjects: ownedProjects });
      }).fail((err) => {
        throw Error(err);
      });
      $.post(
        "/project/criticalpath",
        { projId: project.projectInfo.id },
        (response) => {
          let ownedProjects = this.state.ownedProjects;
          ownedProjects[i].criticalPath = response;
          this.setState({ ownedProjects: ownedProjects });
        }
      ).fail(() => {
        alert("Unable to get Critical Path");
      });
    });
    this.state.otherProjects.forEach((project, i) => {
      $.post("/getProject", { id: project.projectInfo.id }, (response) => {
        let otherProjects = this.state.otherProjects;
        otherProjects[i].tasks = response.tasks;
        otherProjects[i].rels = response.rels;
        this.setState({ otherProjects: otherProjects });
      }).fail((err) => {
        throw Error(err);
      });
      $.post(
        "/project/criticalpath",
        { projId: project.projectInfo.id },
        (response) => {
          let otherProjects = this.state.otherProjects;
          otherProjects[i].criticalPath = response;
          this.setState({ otherProjects: otherProjects });
        }
      ).fail(() => {
        alert("Unable to get Critical Path");
      });
    });
  }

  ProjectAnalyticList(){
    let items = []
    this.state.ownedProjects.forEach(project => {
      items.push(
        <Col xl={12} lg={12} className="m-2" style={{width:'100%'}}>
          <Scroll.Element name={project.projectInfo.id} className="element m-0 p-0">
            <ProjectAnalytic project={project} displayProjectName={true} />
          </Scroll.Element>
        </Col>
      )
    });
    this.state.otherProjects.forEach(project => {
      items.push(
        <Col xl={12} lg={12} className="m-2" style={{width:'100%'}}>
          <Scroll.Element name={project.projectInfo.id} className="element m-0 p-0">
            <ProjectAnalytic project={project} displayProjectName={true} />
          </Scroll.Element>
        </Col>
      )
    })
    return items;
  }

  scroll(scrollValue){
    Scroll.scroller.scrollTo(scrollValue, {
      duration: 1000,
      delay: 100,
      smooth: true,
    })
  }

  MakeDropdown(){
    let ownedProjects = [];
    this.state.ownedProjects.forEach(project => {
      ownedProjects.push(
        <Dropdown.Item onClick={()=>this.scroll(project.projectInfo.id)}>{project.projectInfo.name}</Dropdown.Item>
      )
    });

    let otherProjects = [];
    this.state.otherProjects.forEach(project => {
      otherProjects.push(
        <Dropdown.Item onClick={()=>this.scroll(project.projectInfo.id)}>{project.projectInfo.name}</Dropdown.Item>
      )
    });

    return(
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Jump To Project
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Header>Owned Projects</Dropdown.Header>
          {ownedProjects}
          <Dropdown.Header>Other Projects</Dropdown.Header>
          {otherProjects}
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid className="mt-2">
          <Row>
            <Col>
              <h1>Project Dashboard</h1>
            </Col>
            <Col>
              {this.MakeDropdown()}
            </Col>
            <Col>
              <Button onClick={()=>this.scroll("calendar")}>
                Jump To Calendar
              </Button>
            </Col>
          </Row>
          <Row>
            <Container fluid className="p-0">
              <Row>
                {this.ProjectAnalyticList()}
              </Row>
              <Row style={{marginBottom:'10em', marginTop:'5em'}}>
                <Col>
                  <Scroll.Element name="calendar" className="element">
                    <Calendar ownedProjects={this.state.ownedProjects} otherProjects={this.state.otherProjects}/>
                  </Scroll.Element>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Dashboard;
