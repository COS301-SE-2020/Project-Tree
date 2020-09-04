import React from "react";
import { Redirect } from "react-router-dom";
import Calendar from "./Calendar";
import ProjectAnalytic from "./ProjectAnalytic";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button } from "react-bootstrap";
import $ from "jquery";

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
    console.log(this.state.ownedProjects);
    return (
      <ProjectAnalytic />
    )
  }

  render() {
    return (
      <React.Fragment>
          {this.ProjectAnalyticList()}
          <Calendar />
      </React.Fragment>
    );
  }
}

export default Dashboard;
