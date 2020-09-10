import React from "react";
import { Redirect } from "react-router-dom";
import CreateProject from "../Project/CreateProject";
import Dashboard from "./Dashboard";
import image from "../Images/BigTree.svg";
import { Container, Row, Col, Button } from "react-bootstrap";

class Home extends React.Component {
  render() {
    return (
      this.props.ownedProjects.length === 0 && this.props.otherProjects.length === 0 ? 
        <React.Fragment>
          <Container fluid style={{ height: "100%", width: "100%" }}>
            <Row>
              <Col md={1} lg={2} xl={3}></Col>
              <Col md={10} lg={8} xl={6} className="text-center">
                <img src={image} style={{ width: "90%" }} alt="Logo" />
              </Col>
              <Col md={1} lg={2} xl={3}></Col>
            </Row>
            <Row>
              <Col md={1} lg={2} xl={3}></Col>
              <Col md={10} lg={8} xl={6} className="text-center">
                <h1>Project Tree</h1>
              </Col>
              <Col md={1} lg={2} xl={3}></Col>
            </Row>
            <Row>
              <Col md={1} lg={2} xl={3}></Col>
              <Col md={10} lg={8} xl={6} className="text-center">
                  <Container>
                    <Row>
                      <Col>
                        <h5>Start Your Project planning journey</h5>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <CreateProject
                          setProject={(project) => {
                            this.props.setProject(project);
                          }}
                          closeSideBar={() => {
                            this.props.closeSideBar();
                          }}
                        />
                      </Col>
                    </Row>
                  </Container>
              </Col>
              <Col md={1} lg={2} xl={3}></Col>
            </Row>
            <Row>
              <Col sm={4}></Col>
              <Col sm={4} className="text-center"></Col>
              <Col sm={4}></Col>
            </Row>
          </Container>
        </React.Fragment>
      :
        <Dashboard 
          ownedProjects={this.props.ownedProjects}
          otherProjects={this.props.otherProjects}
          setProject={this.props.setProject}
        />
    );
  }
}

export default Home;
