import React from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import SendProjectNotification from "../Notifications/SendProjectNotification";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";

class ProjectInfo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container
          className="block-example border rounded border-secondary"
          style={{ height: "27em" }}
        >
          <Row className="align-items-center bg-secondary py-2">
            <Col>
              <Row>
                <Col
                  className="text-white text-center"
                  style={{ fontSize: "22px" }}
                  xs={12}
                >
                  {this.props.project.projectInfo.name}
                </Col>
              </Row>
              <Row>
                {this.props.userPermission["project"] === true ? (
                  <Col className="text-center my-1">
                    <DeleteProject
                      project={this.props.project.projectInfo}
                      setProject={(project) => {
                        this.props.setProject(project);
                      }}
                    />
                  </Col>
                ) : null}
                {this.props.userPermission["project"] === true ? (
                  <Col className="text-center my-1">
                    <UpdateProject
                      project={this.props.project.projectInfo}
                      setProject={(project) => {
                        this.props.setProject(project);
                      }}
                    />
                  </Col>
                ) : null}
                <Col className="text-center my-1">
                  <Link to="/graph">
                    <Button variant="warning" style={{ width: "100px" }}>
                      <i className="fa fa-line-chart"></i> Graph{" "}
                    </Button>
                  </Link>
                </Col>
                <Col className="text-center my-1">
                  <SendProjectNotification
                    project={this.props.project.projectInfo}
                    user={this.props.user}
                    updateNoticeBoardRefreshKey={
                      this.props.updateNoticeBoardRefreshKey
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="align-items-center pt-1">
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px", }}
            >
              Start Date and Time
            </Col>
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px", }}
            >
              End Date and Time
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px" }}
            >
              {`${this.props.project.projectInfo.startDate.substring(0, 10)} ${this.props.project.projectInfo.startDate.substring(11, 16)}`}
            </Col>
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px" }}
            >
              {`${this.props.project.projectInfo.endDate.substring(0, 10)} ${this.props.project.projectInfo.endDate.substring(11, 16)}`}
            </Col>
          </Row>
          <Row className="align-items-center py-1">
            <Col
              className="align-items-center text-center"
              style={{ fontSize: "20px", wordWrap: "break-word" }}
            >
              {this.props.project.projectInfo.description}
            </Col>
          </Row>
          <Row className="align-items-center py-2">
            <Col className="text-center">
              <Table
                className="mt-2"
                striped
                bordered
                size="md"
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
                    <td>Edit</td>
                  </tr>
                  <tr>
                    <td>Package Manager</td>
                    <td>
                      {this.props.project.projectInfo.permissions[0] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[1] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[2] === true
                        ? "X"
                        : null}
                    </td>
                  </tr>
                  <tr>
                    <td>Responsible Person</td>
                    <td>
                      {this.props.project.projectInfo.permissions[3] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[4] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[5] === true
                        ? "X"
                        : null}
                    </td>
                  </tr>
                  <tr>
                    <td>Resource</td>
                    <td>
                      {this.props.project.projectInfo.permissions[6] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[7] === true
                        ? "X"
                        : null}
                    </td>
                    <td>
                      {this.props.project.projectInfo.permissions[8] === true
                        ? "X"
                        : null}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ProjectInfo;
