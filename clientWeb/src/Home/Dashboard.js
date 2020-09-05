import React from "react";
import { Redirect } from "react-router-dom";
import Calendar from "./Calendar";
import ProjectAnalytic from "../ProjectAnalytics/ProjectAnalytic";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button } from "react-bootstrap";
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
    return (
      <ProjectAnalytic />
    )
  }

  render() {
    return (
      <React.Fragment>
          {/* {this.ProjectAnalyticList()} */}
          <br></br><br></br>
          <Scroll.Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500}>
          Test 1
          </Scroll.Link>
          <Button onClick={()=>{
            Scroll.scroller.scrollTo('test1', {
              duration: 1500,
              delay: 100,
              smooth: true,
              // containerId: 'ContainerElementID',
              offset: 50, // Scrolls to element + 50 pixels down the page
              // ...
            })
          }}></Button>
          <ProjectAnalytic project={this.state.ownedProjects[0]} displayProjectName={true}/>
          <ProjectAnalytic project={this.state.ownedProjects[0]} displayProjectName={true}/>
          <ProjectAnalytic id="three" project={this.state.ownedProjects[0]} displayProjectName={true}/>
          <Calendar />
          <Scroll.Element name="test1" className="element">
          test 1
          </Scroll.Element>
      </React.Fragment>
    );
  }
}

export default Dashboard;
