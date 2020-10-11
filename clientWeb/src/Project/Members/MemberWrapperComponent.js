import React from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import AddProjectManager from "./AddProjectManager"
import GetAccessCode from "./GetAccessCode"
import AuthoriseMembers from "./AuthoriseMembers"

class MemberWrapperComponent extends React.Component {
    constructor() {
        super();
        this.state = {users: null};
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Row>
                            <GetAccessCode project={this.props.project}/>
                        </Row>
                        <Row>
                            <AddProjectManager project={this.props.project} setProjectManagers={this.props.setProjectManagers}/>
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