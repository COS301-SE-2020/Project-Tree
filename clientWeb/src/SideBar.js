import React from "react";
import { Button, Container, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./App.scss";
 

import CreateProject from "./Project/CreateProject";

class SideBar extends React.Component {

  OwnedProjects(){
    const OwnedProjects = [];
    this.props.projects.forEach(project => {
      OwnedProjects.push(
        <Row 
          noGutters
          className="m-1"
          style={{width: "100%"}}
          key={project.id}>
          <Col>
            <Container fluid className="block-example rounded border border-dark" style={{color: "white", backgroundColor: "#184D47"}}>
              <Row className="align-items-center py-2">
                <Col className="text-center">
                  {project.name}
                </Col>
              </Row>
              <Row className="align-items-center py-2">
                <Col>
                  <Link to="/project">
                    <Button size="sm" style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D", color: "black"}}
                      onClick={
                        ()=>{
                            this.props.setProject(project);
                            this.props.closeSideBar(true);
                        }
                      }
                    >
                      Project Info
                    </Button>
                  </Link>
                </Col>
                <Col>
                  <Link to="/graph">
                    <Button size="sm" style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D", color: "black"}}
                      onClick={
                        ()=>{
                            this.props.setProject(project);
                            this.props.closeSideBar(true);
                        }
                      }
                    >
                      Project Graph
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      );
    });
    return OwnedProjects;
  }

  OtherProjects(){
    const OtherProjects = [];
    this.props.projects.forEach(project => {
      OtherProjects.push(
        <Row 
          noGutters
          className="m-1"
          style={{width: "100%"}}
          key={project.id}>
          <Col>
            <Container fluid className="block-example rounded border border-dark" style={{color: "white", backgroundColor: "#184D47"}}>
              <Row className="align-items-center py-2">
                <Col className="text-center">
                  {project.name}
                </Col>
              </Row>
              <Row className="align-items-center py-2">
                <Col>
                  <Link to="/project">
                    <Button size="sm" style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D", color: "black"}}
                      onClick={
                        ()=>{
                            this.props.setProject(project);
                            this.props.closeSideBar(true);
                        }
                      }
                    >
                      Project Info
                    </Button>
                  </Link>
                </Col>
                <Col>
                  <Link to="/graph">
                    <Button size="sm" style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D", color: "black"}}
                      onClick={
                        ()=>{
                            this.props.setProject(project);
                            this.props.closeSideBar(true);
                        }
                      }
                    >
                      Project Graph
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      );
    });
    return OtherProjects;
  }

  render() {
    if (this.props.projects === undefined) return null;
    

    return (
      <Container className="py-1" style={{ maxHeight:'90vh', overflowY: 'auto'}}>
        <h4 className="text-white">Owned Projects</h4>
        <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/>
        {this.OwnedProjects()} 
        <hr></hr>
        <h4 className="text-white" >Other Projects</h4>
        {this.OtherProjects()} 
      </Container>
    );
  }
}

export default SideBar;