import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import $ from "jquery";

import CreateProject from "./CreateProject";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: null, project: this.props.SideBar.state.project };
  }
  render() {
    return (
      <React.Fragment>
        {this.state.project.name}
      </React.Fragment>
    );
  }
}

export default ProjectPage;
