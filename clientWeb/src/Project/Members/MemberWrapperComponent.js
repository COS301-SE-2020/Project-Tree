import React from "react";
import { Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import AddProjectManager from "./AddProjectManager";
import GetAccessCode from "./GetAccessCode";
import AuthoriseMembers from "./AuthoriseMembers";

class MemberWrapperComponent extends React.Component {
  constructor() {
    super();
    this.state = { users: null };
  }

  render() {
    if (this.props.display === false) {
      return (
        <Container>
          <Row>
            <Col>
              <Row>
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip style={{ fontSize: "22px" }}>
                      {this.props.getProjectManagers()}
                    </Tooltip>
                  }
                >
                  <i className="fa fa-info-circle"> Project Managers</i>
                </OverlayTrigger>
              </Row>
            </Col>
          </Row>
        </Container>
      );
    }

    return (
      <Container>
        <Row>
          <Col>
            <Row>
              <GetAccessCode project={this.props.project} />
            </Row>
            <Row>
              <AddProjectManager
                project={this.props.project}
                setProjectManagers={this.props.setProjectManagers}
              />
            </Row>
            <Row className="mt-3">
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip style={{ fontSize: "22px" }}>
                    {this.props.getProjectManagers()}
                  </Tooltip>
                }
              >
                <i className="fa fa-info-circle"> Project Managers</i>
              </OverlayTrigger>
            </Row>
          </Col>
          <Col xs="8" className="align-items-center">
            <AuthoriseMembers project={this.props.project} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MemberWrapperComponent;
