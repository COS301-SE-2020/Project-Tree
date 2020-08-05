import React from "react";
import { Button, Container, Row} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./App.scss";
 

import CreateProject from "./Project/CreateProject";

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: this.props.projects};
  }
  render() {
    if (this.state.projects === undefined) return null;
    const listItems = [];
    this.state.projects.forEach(project => {
      listItems.push(
        <Link to="/project" 
          key={project.id}>
          <Button
            style={{fontFamily:"arial black",color: "black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}
            onClick={
              ()=>{
                  this.props.setProject(project);
                  this.props.closeSideBar(true);
              }
            }
          >
            {project.name}
          </Button>
        </Link>
      );
    });

    return (
      <Container className="py-2">
        <Row> <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/> </Row>
        <Row> {listItems} </Row>
      </Container>
    );
  }
}

export default SideBar;