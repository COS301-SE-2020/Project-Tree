import React from "react";
import { Redirect } from "react-router-dom";
import CreateProject from "../Project/CreateProject";
import image from "../Images/BigTree.png";
import { Container, Row, Col, Button } from "react-bootstrap";

class Home extends React.Component {
  render() {
    if(this.props.projects !== undefined && this.props.projects !== null){
      if(this.props.projects.length !== 0){
        this.props.setProject(this.props.projects[0]);
        return (
          <Redirect to="/project"/>
        )
      }
    }
    return (
      <React.Fragment>
        <Container fluid style={{height:"100%", width: "100%"}}>
          <Row>
            <Col md={1} lg={2} xl={3}></Col>
            <Col md={10} lg={8} xl={6} className="text-center">
              <img src={image} style={{width: "90%"}} alt="Logo"/>
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
              {this.props.ownedProjects.length !== 0 || this.props.otherProjects.length !== 0 ? 
                <Container>
                  <Row>
                    <Col>
                    <h5>Create Another Project</h5>
                    </Col>
                    <Col>
                    <h5>Open a Project</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/>
                    </Col>
                    <Col>
                      {this.props.showSideBar === false ?
                      (
                        <Button
                          className="my-2"
                          style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D"}}
                          onClick={() => this.props.toggleSideBar()}
                          block
                          size="sm"
                        >
                          <i className="fa fa-navicon text-dark" style={{fontSize:"30px"}}></i>
                        </Button>
                      )
                      :
                      (
                        <Button
                          className="my-2"
                          style={{borderColor:"#EEBB4D", backgroundColor:"#EEBB4D"}}
                          onClick={() => this.props.toggleSideBar()}
                          block
                          size="sm"
                        >
                          <i className="fa fa-navicon text-dark" style={{fontSize:"30px", transform: "rotate(90deg)"}}></i>
                        </Button>
                      )}
                      
                    </Col>
                  </Row>
                </Container>
              :
                <Container>
                  <Row>
                    <Col>
                      <h5>Start Your Project planning journey</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/>
                    </Col>
                  </Row>
                </Container>
              }
              
            </Col>
            <Col md={1} lg={2} xl={3}></Col>
          </Row>
          <Row>
            <Col sm={4}></Col>
            <Col sm={4} className="text-center">
            </Col>
            <Col sm={4}></Col>
          </Row>
        </Container>
        
      </React.Fragment>
    );
  }
}

export default Home;