import React from "react";
import { Button, Container, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";

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
        <Row 
          noGutters
          className="m-1"
          style={{width: "100%", border: "1px solid blue"}}
          key={project.id}>
          <Col>
            <Container fluid>
              <Row className="align-items-center bg-dark py-2">
                <Col  className="text-white">
                  {project.name}
                </Col>
              </Row>
              <Row className="align-items-center bg-dark py-2">
                <Col>
                  <Link to="/project">
                    <Button
                      style={{fontFamily:"arial black",color: "black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}
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
                    <Button
                      style={{fontFamily:"arial black",color: "black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}
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

    return (
      <Container className="py-2">
        <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/> 
        {listItems} 
      </Container>
    );
  }
}

export default SideBar;