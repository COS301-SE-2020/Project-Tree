import React from "react";
import { Redirect } from "react-router-dom";
import Calendar from "./Calendar";
import ProjectAnalytic from "./ProjectAnalytic";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button } from "react-bootstrap";

class Dashboard extends React.Component {

  ProjectAnalyticList(){
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
