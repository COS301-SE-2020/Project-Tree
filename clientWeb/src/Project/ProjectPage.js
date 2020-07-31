import React from "react";
import { Table, Button, Container, Row, Col, ButtonGroup } from "react-bootstrap";
import $ from "jquery";
import { Redirect } from "react-router-dom";

import CreateProject from "./CreateProject";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { project: JSON.parse(sessionStorage.getItem("project")).project };
    this.handleClick = this.handleClick.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
  }

  handleClick(){
    this.setState({redirect: true});
  }

  closeSideBar(){
    this.props.closeSideBar();
  }

  render() {
    if (this.state.redirect != null) {
      this.closeSideBar();
      return(<Redirect to="/graph"/>)
    }

    return (
      <Container className="py-2">
        <Row>
        <Button
          onClick={() => {this.handleClick();}}
          style={{fontFamily:"arial black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}          
          size="sm"
          block
        >
          {this.state.project.name}
        </Button>
        </Row>
      </Container>
    );
  }
}

export default ProjectPage;
