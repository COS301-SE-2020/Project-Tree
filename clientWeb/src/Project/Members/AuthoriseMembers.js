import React from "react";
import {
  Button,
  Container,
  Spinner,
  Row,
  Col,
  Carousel,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import $ from "jquery";

class JoinProject extends React.Component {
  constructor() {
    super();
    this.state = { users: null };
    this.setUsers = this.setUsers.bind(this);
  }

  setUsers() {
    let users = [...this.state.users];
    users.shift();
    this.setState({ users: users });
  }

  componentDidMount() {
    $.post(
      "/people/getpendingmembers",
      { projId: this.props.project.id },
      (response) => {
        this.setState({ users: response.users });
      }
    ).fail(() => {
      alert("Unable to get pending members");
    });
  }

  render() {
    if (this.state.users === null) {
      return (
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="success" size="sm"></Spinner>
          </Col>
        </Row>
      );
    } else if (this.state.users.length === 0) {
      return (
        <Row>
          <Col className="text-center">
            <h4>No pending members</h4>
          </Col>
        </Row>
      );
    }

    return (
      <React.Fragment>
        <PendingMember
          user={this.state.users}
          project={this.props.project}
          setUsers={this.setUsers}
        />
      </React.Fragment>
    );
  }
}

class PendingMember extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick(value, user) {
    let data = {
      user: JSON.stringify(user),
      project: JSON.stringify(this.props.project),
      check: value,
    };

    $.post("/people/authorisemember", data, (response) => {
      return;
    }).fail(() => {
      alert("Unable to authorise member");
      return;
    });

    this.props.setUsers();
  }

  pendingMemberViews(user, index) {
    let pfp = "https://i.ibb.co/MRpbpHN/default.png";
    if (user.profilePicture !== "undefined") {
      pfp = user.profilePicture;
    }
    return (
      <Carousel.Item key={index}>
        <Row>
          <Col>{user.name + " " + user.surname}</Col>
        </Row>

        <Row className="align-items-center p-2">
          <Col>
            <img class="circular" src={pfp} alt="user" width="40" height="40" />
          </Col>
          <Col className="align-items-center p-1">
            <Button
              variant="success"
              onClick={() => this.handleClick(true, user)}
            >
              Accept
            </Button>
          </Col>
          <Col className="align-items-center p-1">
            <Button
              variant="danger"
              onClick={() => this.handleClick(false, user)}
            >
              Decline
            </Button>
          </Col>
        </Row>
      </Carousel.Item>
    );
  }
  render() {
    return (
      <Container className="align-items-center">
        <Row className="p-0 m-0">
          <Col className="text-center">
            <h4>
              Pending Members{" "}
              <OverlayTrigger
                placement="auto"
                style={{ fontSize: "20px" }}
                overlay={
                  <Tooltip className="helpTooltip">
                    Acccept or decline members that have used the access code to
                    join your project
                  </Tooltip>
                }
              >
                <i className="fa fa-question-circle"></i>
              </OverlayTrigger>
            </h4>
          </Col>
        </Row>
        <Carousel
          interval={1000000}
          pauseOnHover={true}
          style={{ width: "100%", height: "100%", padding: "5px", margin: 0 }}
        >
          {this.props.user.map((user, index) =>
            this.pendingMemberViews(user, index)
          )}
        </Carousel>
      </Container>
    );
  }
}

export default JoinProject;
