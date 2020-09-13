import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SendProjectNotification from "../Notifications/SendProjectNotification";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";
import ProjectProgress from "./ProjectProgress";

class ProjectInfo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container className="block-example border rounded border-secondary">
          <Row className="align-items-center bg-secondary py-2">
            <Col>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  className="text-center my-1"
                >
                  {this.props.userPermission["project"] === true ? (
                    <DeleteProject
                      project={this.props.project}
                      setProject={(project) => {
                        this.props.setProject(project);
                      }}
                    />
                  ) : null}
                </Col>
                <Col 
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  className="text-center my-1"
                >
                  {this.props.userPermission["project"] === true ? (
                    <UpdateProject
                      project={this.props.project}
                      setProject={(project) => {
                        this.props.setProject(project);
                      }}
                    />
                  ) : null}
                </Col>
              </Row>
            </Col>
            
            <Col
              className="text-white text-center"
              style={{ fontSize: "22px" }}
              xs={4}
            >
              {this.props.project.name}
            </Col>
            <Col>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  className="text-center my-1"
                >
                  <Link to="/graph">
                    <Button
                      variant="warning"
                      style={{width: "100px"}}
                    >
                      <i className="fa fa-line-chart"></i> Graph{" "}
                    </Button>
                  </Link>
                </Col>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  xl={6}
                  className="text-center my-1"
                >
                  <SendProjectNotification
                    project={this.props.project}
                    user={this.props.user}
                    updateNoticeBoardRefreshKey={
                      this.props.updateNoticeBoardRefreshKey
                    }
                  />
                </Col>
              </Row>
            </Col>
            
          </Row>
          <Row className="align-items-center py-2">
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px", wordWrap: "break-word" }}
            >
              {this.props.project.description}
            </Col>
          </Row>
          <Row className="align-items-center py-2">
            <Col className="text-center">
              <Table
                className="mt-2"
                striped
                bordered
                size="sm"
                variant="light"
              >
                <tbody>
                  <tr>
                    <th colSpan="4">Project permissions</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Create</td>
                    <td>Delete</td>
                    <td>Update</td>
                  </tr>
                  <tr>
                    <td>Package Manager</td>
                    <td>
                      {this.props.project.permissions[0] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[1] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[2] === true ? "X" : null}
                    </td>
                  </tr>
                  <tr>
                    <td>Responsible Person</td>
                    <td>
                      {this.props.project.permissions[3] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[4] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[5] === true ? "X" : null}
                    </td>
                  </tr>
                  <tr>
                    <td>Resource</td>
                    <td>
                      {this.props.project.permissions[6] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[7] === true ? "X" : null}
                    </td>
                    <td>
                      {this.props.project.permissions[8] === true ? "X" : null}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="align-items-center py-1">
          <Col>
            <ProjectProgress
              project={this.props.project}
              tasks={this.props.tasks}
              criticalPath={this.props.criticalPath}
            />
          </Col>
        </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ProjectInfo;
