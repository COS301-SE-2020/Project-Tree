import React from "react";
import { Button, Container, Row} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

import CreateProject from "./Project/CreateProject";
import { identity } from "lodash";

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: this.props.projects, redirect: null};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(project){
    this.setState({redirect: project});
  }

  render() {
    if (this.state.redirect != null) {
      return <Redirect to={{
        pathname: '/project',
        state: { projects: null, project: this.state.redirect }
      }}/>;
    }
    if (this.state.projects === undefined) return null;
    const listItems = [];
    this.state.projects.forEach(project => {
      listItems.push(
        <Button
          key={project.id}
          onClick={() => {this.handleClick(project);}}
          style={{fontFamily:"arial black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}
          size="sm"
          block
        >
          {project.name}
        </Button>
      );
    });

    return (
      <Container className="py-2">
        <Row> {listItems} </Row>
      </Container>
    );
  }
}

export default SideBar;