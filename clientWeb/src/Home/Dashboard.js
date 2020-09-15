import React from "react";
import Calendar from "./Calendar";
import ProjectAnalytic from "../ProjectAnalytics/ProjectAnalytic";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import $ from "jquery";
import * as Scroll from 'react-scroll';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    /* this.props.ownedProjects.forEach((project, i) => {
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
      otherProjects[i].rels = [];
    });
    this.state = {
      ownedProjects:ownedProjects,
      otherProjects:otherProjects
    }; */

    this.ProjectAnalyticList = this.ProjectAnalyticList.bind(this);
  }

  /* componentDidMount() {
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
  } */

  ProjectAnalyticList(){
    let items = []
    this.props.ownedProjects.forEach(project => {
      items.push(
        <Col key={project.projectInfo.id.toString()} xl={12} lg={12} className="m-2" style={{width:'100%'}}>
          <Scroll.Element name={project.projectInfo.id.toString()} className="element m-0 p-0">
            <ProjectAnalytic project={project} displayProjectName={true} setProject={this.props.setProject} owned={true}/>
            <hr style={{ backgroundColor: "#EEBB4D",  height:"4px"  }} />
          </Scroll.Element>
        </Col>
      )
    });
    this.props.otherProjects.forEach(project => {
      items.push(
        <Col key={project.projectInfo.id.toString()} xl={12} lg={12} className="m-2" style={{width:'100%'}}>
          <Scroll.Element name={project.projectInfo.id.toString()} className="element m-0 p-0">
            <ProjectAnalytic project={project} displayProjectName={true} setProject={this.props.setProject}/>
            <hr style={{ backgroundColor: "#EEBB4D", height:"4px"  }} />
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
    this.props.ownedProjects.forEach(project => {
      ownedProjects.push(
        <Dropdown.Item key={project.projectInfo.id.toString()} onClick={()=>this.scroll(project.projectInfo.id.toString())}>{project.projectInfo.name}</Dropdown.Item>
      )
    });

    let otherProjects = [];
    this.props.otherProjects.forEach(project => {
      otherProjects.push(
        <Dropdown.Item key={project.projectInfo.id.toString()} onClick={()=>this.scroll(project.projectInfo.id.toString())}>{project.projectInfo.name}</Dropdown.Item>
      )
    });

    return(
      <Dropdown>
        <Dropdown.Toggle variant="warning" id="dropdown-basic">
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
            </Col>
            <Col xl={4} xs={3} className="text-center">
              <h1 style={{fontWeight: "bold"}}>Project Dashboard</h1>
            </Col>
            <Col>
              <Row>
                <Col 
                  sm={12}
                  xl={6}
                  className="text-center p-1"
                >
                  {this.MakeDropdown()}
                </Col>
                <Col
                  sm={12}
                  xl={6}
                  className="text-center p-1"
                >
                  <a href="#calendar"><Button variant="warning">   {/* onClick={()=>this.scroll("calendar")} >*/}
                    Jump To Calendar
                  </Button></a>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Container fluid className="p-0">
              <Row>
                {this.ProjectAnalyticList()}
              </Row>
              <Row style={{marginBottom:'10em', marginTop:'2em'}}>
                <Col className="text-center">
                  {/* <Scroll.Element name="calendar" className="element"> */}
                    <h1 id="calendar">Calendar</h1> 
                    <hr style={{ backgroundColor: "#EEBB4D", width:"50%"}} />
                    <Calendar ownedProjects={this.props.ownedProjects} otherProjects={this.props.otherProjects}/>
                  {/* </Scroll.Element> */}
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
