import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SendProjectNotification from "../Notifications/SendProjectNotification";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectInfo extends React.Component{
  render(){
    return(
      <React.Fragment>
        <Container className="block-example border rounded border-secondary">
          <Row className="align-items-center bg-secondary py-2">
            <Col className="text-left"> 
              <DeleteProject project={this.props.project} setProject={project => {this.props.setProject(project)}}/>
            </Col>
            <Col className="text-white">
              {this.props.project.name}
            </Col>
            <Col className="text-right" >
              <Link to="/graph">
                <Button variant="warning" size="md">View Graph</Button>
              </Link>
            </Col>
          </Row> 
          <Row className="align-items-center py-2">
            <Col className="align-items-center text-center">
              {this.props.project.description}
            </Col>
          </Row> 
          <Row className="align-items-center py-2" >
            <Col className="text-center" >
              <Table className="mt-2" striped bordered size="sm" variant="light">
                <tbody>
                  <tr>
                    <th colSpan="4">Project permissions</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Create </td>
                    <td>Delete </td>
                    <td>Update </td>
                  </tr>
                  <tr>
                    <td>Package Manager</td>
                    <td>{this.props.project.permissions[0] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[1] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[2] === true ? "X" : null}</td>
                  </tr>
                  <tr>
                    <td>Responsible Person</td>
                    <td>{this.props.project.permissions[3] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[4] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[5] === true ? "X" : null}</td>
                  </tr>
                  <tr>
                    <td>Resource</td>
                    <td>{this.props.project.permissions[6] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[7] === true ? "X" : null}</td>
                    <td>{this.props.project.permissions[8] === true ? "X" : null}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="align-items-center py-2">
            <Col xs={6} className="text-center">
              <UpdateProject project={this.props.project} setProject={project => {this.props.setProject(project)}}/>
            </Col>
            <Col> <SendProjectNotification/> </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default ProjectInfo;