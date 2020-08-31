import React from "react";
import { Redirect } from "react-router-dom";
import CreateProject from "../Project/CreateProject";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button } from "react-bootstrap";

class Home extends React.Component {
  render() {
    if (this.props.projects !== undefined && this.props.projects !== null) {
      if (this.props.projects.length !== 0) {
        this.props.setProject(this.props.projects[0]);
        return <Redirect to="/project" />;
      }
    }
    return (
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
              {this.props.ownedProjects.length !== 0 ||
              this.props.otherProjects.length !== 0 ? (
                <Container className="text-dark">
                  <Row>
                  <Col>
                      <h5>Start Your project planning journey</h5>
                  </Col>
                </Row>
                  <Row>
                    <Col className="text-right">
                      <CreateProject
                        setProject={(project) => {
                          this.props.setProject(project);
                        }}
                        closeSideBar={() => {
                          this.props.closeSideBar();
                        }}
                      />
                    </Col>
                    <Col>
                      {this.props.showSideBar === false ? (
                        <Button
                          className="my-2"
                          style={{
                            borderColor: "#EEBB4D",
                            backgroundColor: "#EEBB4D",
                            width: "170px",
                            color: "black",
                          }}
                          onClick={() => this.props.toggleSideBar()}
                          block
                          size="md"
                        >
                          <i
                            className="fa fa-navicon"
                          ></i> Open Project {" "}
                        </Button>
                      ) : (
                        <Button
                          className="my-2"
                          style={{
                            borderColor: "#EEBB4D",
                            backgroundColor: "#EEBB4D",
                            width: "170px",
                            color: "black",
                          }}
                          onClick={() => this.props.toggleSideBar()}
                          block
                          size="md"
                        >
                          <i
                            className="fa fa-navicon" style={{
                              transform: "rotate(90deg)"
                            }}
                          ></i> Open Project {" "}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Container>
              ) : (
                <Container>
                  <Row>
                    <Col>
                        <h5>Start Your project planning journey</h5>
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
              )}
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
    );
  }
}

export default Home;
