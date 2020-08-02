import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { project: this.props.project };
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.setState({ project: this.props.project });
    }
  }

  render() {
    return (
      <Container fluid className="py-2">
        <Row>
          <Col xs={4} style={{border: "blue solid 1px"}}><ProjectInfo project={this.state.project} setProject={project => this.props.setProject(project)}/></Col>
          <Col style={{border: "blue solid 1px"}}>more project info</Col>
        </Row>
        <Row style={{border: "blue solid 1px"}}>
          <Col style={{border: "blue solid 1px"}}>tasks area really cool thing</Col>
        </Row>
      </Container>
    );
  }
}

class ProjectInfo extends React.Component{
  constructor(props){
      super(props);
      this.state = { project: this.props.project };
      this.setProject = this.setProject.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.setState({ project: this.props.project });
    }
  }

  setProject(project){
    if(project.delete != null){
      this.props.setProject(project)
      this.setState({project: null})
    }else{
      this.setState({project: project})
    }
  }

  render(){

    if(this.state.project == null){
      return (<Redirect to="/"/>);
    }

    return(
        <React.Fragment>
            <Container className="block-example border border-secondary bg-light">
                <Row className="align-items-center bg-dark py-2">
                    <Col className="text-left"> 
                        <DeleteProject project={this.state.project} setProject={project => {this.setProject(project)}}/>
                    </Col>
                    <Col className="text-white">
                        {this.state.project.name}
                    </Col>
                    <Col className="text-right" >
                      <Link to="/graph">
                          <Button variant="warning" size="md">View Project</Button>
                      </Link>
                    </Col>
                </Row> 
                <Row className="align-items-center py-2">
                  <Col>
                    <p>{this.state.project.description}</p>
                  </Col>
                </Row> 
                <Row className="align-items-center py-2" >
                  <Col className="text-center" >
                  <Table className="mt-2" striped bordered size="sm" variant="light">
                    <tbody>
                      <tr>
                        <td></td>
                        <td>Create </td>
                        <td>Delete </td>
                        <td>Update </td>
                      </tr>
                      <tr>
                        <td>Package Manager</td>
                        <td>{this.state.project.permissions[0] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[1] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[2] === true ? "X" : null}</td>
                      </tr>
                      <tr>
                        <td>Responsible Person</td>
                        <td>{this.state.project.permissions[3] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[4] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[5] === true ? "X" : null}</td>
                      </tr>
                      <tr>
                        <td>Resource</td>
                        <td>{this.state.project.permissions[6] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[7] === true ? "X" : null}</td>
                        <td>{this.state.project.permissions[8] === true ? "X" : null}</td>
                      </tr>
                    </tbody>
                  </Table>
                  </Col>
                </Row>
                <Row className="align-items-center py-2">
                  <Col></Col>
                  <Col xs={6} className="text-center">
                    <UpdateProject project={this.state.project} setProject={project => {this.setProject(project)}}/>
                  </Col>
                  <Col></Col>
                </Row>
            </Container>
        </React.Fragment>
    )
  }
}
export default ProjectPage;
