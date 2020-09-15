import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./App.scss";
import DeleteProject from "./Project/DeleteProject";
import CreateProject from "./Project/CreateProject";

class SideBar extends React.Component {
  OwnedProjects() {
    const OwnedProjects = [];
    this.props.ownedProjects.forEach((project) => {
      OwnedProjects.push(
        <Row
          noGutters
          className="m-1"
          style={{ width: "100%" }}
          key={project.projectInfo.id}
        >
          <Col>
            <Container
              fluid
              className="block-example rounded border border-dark"
              style={{
                color: "white",
                backgroundColor: "#184D47",
                fontSize: "20px",
              }}
            >
              <Row className="align-items-center py-2">
                <Col className="text-center">{project.projectInfo.name}</Col>
              </Row>
              <Row className="align-items-center py-2">
                <Col className="text-center">
                  <Link to="/project">
                    <Button
                      style={{
                        borderColor: "#EEBB4D",
                        backgroundColor: "#EEBB4D",
                        color: "black",
                        fontSize: "15px",
                        width: "100px",
                      }}
                      onClick={() => {
                        this.props.setProject(project.projectInfo);
                        this.props.closeSideBar(true);
                      }}
                    >
                      <i className="	fa fa-info-circle"></i> Info
                    </Button>
                  </Link>
                </Col>
                <Col className="text-center">
                  <Link to="/graph">
                    <Button
                      style={{
                        borderColor: "#EEBB4D",
                        backgroundColor: "#EEBB4D",
                        color: "black",
                        width: "100px",
                        fontSize: "15px",
                      }}
                      onClick={() => {
                        this.props.setProject(project.projectInfo);
                        this.props.closeSideBar(true);
                      }}
                    >
                      <i className="fa fa-line-chart"></i> Graph
                    </Button>
                  </Link>
                </Col>
                <Col className="text-center">
                  <DeleteProject
                    project={project.projectInfo}
                    setProject={(project) => {
                      this.props.setProject(project);
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      );
    });
    return OwnedProjects;
  }

  OtherProjects() {
    const OtherProjects = [];
    this.props.otherProjects.forEach((project) => {
      OtherProjects.push(
        <Row
          noGutters
          className="m-1"
          style={{ width: "100%" }}
          key={project.projectInfo.id}
        >
          <Col>
            <Container
              fluid
              className="block-example rounded border border-dark"
              style={{
                color: "white",
                backgroundColor: "#184D47",
                fontSize: "20px",
              }}
            >
              <Row className="align-items-center py-2">
                <Col className="text-center">{project.projectInfo.name}</Col>
              </Row>
              <Row className="align-items-center py-2">
                <Col className="text-center">
                  <Link to="/project">
                    <Button
                      size="md"
                      style={{
                        borderColor: "#EEBB4D",
                        backgroundColor: "#EEBB4D",
                        color: "black",
                        fontSize: "15px",
                        width: "90px",
                      }}
                      onClick={() => {
                        this.props.setProject(project.projectInfo);
                        this.props.closeSideBar(true);
                      }}
                    >
                      <i className="	fa fa-info-circle"></i> Info
                    </Button>
                  </Link>
                </Col>
                <Col className="text-center">
                  <Link to="/graph">
                    <Button
                      size="md"
                      style={{
                        borderColor: "#EEBB4D",
                        backgroundColor: "#EEBB4D",
                        color: "black",
                        fontSize: "15px",
                      }}
                      onClick={() => {
                        this.props.setProject(project.projectInfo);
                        this.props.closeSideBar(true);
                      }}
                    >
                      <i className="fa fa-line-chart"></i> Graph
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
    if (
      this.props.ownedProjects === undefined ||
      this.props.otherProjects === undefined
    )
      return null;

    return (
      <Container
        className="py-1"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <CreateProject
          setProject={(project) => {
            this.props.setProject(project);
          }}
          closeSideBar={() => {
            this.props.closeSideBar();
          }}
        />
        <h4 className="text-white">Owned Projects</h4>
        {this.OwnedProjects()}
        <hr style={{ backgroundColor: "white" }}></hr>
        <h4 className="text-white">Other Projects</h4>
        {this.OtherProjects()}
      </Container>
    );
  }
}

export default SideBar;
