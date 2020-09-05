import React from "react";
import { Modal, Button, Col, Row, Container, Form } from "react-bootstrap";
import $ from "jquery";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

function getBase64(file) {
  console.log(file)
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    return (reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, toggleEdit: false, user: this.props.user };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({ user: this.props.user });
    }
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleLogout() {
    localStorage.clear();
    this.setState({
      loggedInStatus: false,
      user: {},
    });
    this._isMounted = false;
    window.location.reload(false);
  }

  openEdit() {
    this.setState({
      toggleEdit: true,
    });
  }

  closeEdit() {
    $.post(
      "/user/get",
      { token: localStorage.getItem("sessionToken") },
      (response) => {
        this.setState({ toggleEdit: false, user: response.user });
      }
    )
    .fail((response) => {
      throw Error(response.message);
    });
  }

  async handleSubmit(event) {
    console.log((this.state.user.profilepicture))
    event.preventDefault();
    let data = new FormData();
    data.append("name", this.state.user.name);
    data.append("sname", this.state.user.sname);
    data.append("email", this.state.user.email);
    data.append("bday", this.state.user.birthday);
    data.append("profilePicture", getBase64(this.state.user.profilepicture)
    );
    data.append("token", localStorage.getItem("sessionToken"));
    data = await stringifyFormData(data);
    $.post("/user/edit", data, (response) => {
      this.setState({ user: response.user, prevUser: response.user });
      this.closeEdit();
    }).fail(() => {
      alert("Unable to update user preferences");
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="my-2"
          style={{ borderColor: "#96BB7C", backgroundColor: "#96BB7C" }}
          onClick={() => {
            this.showModal();
          }}
          size="sm"
        >
          <i className="fa fa-cogs text-dark" style={{ fontSize: "30px" }}></i>
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.hideModal();
          }}
        >
          <Form onSubmit={this.handleSubmit} type="multipart/form-data">
            <Modal.Header closeButton>
              <Modal.Title>
                <img
                  src="storage/default.png"
                  alt="Profile"
                  height="80"
                  width="80"
                />
                {this.state.toggleEdit === false ? (
                  "   " + this.state.user.name + " " + this.state.user.sname
                ) : (
                  <input
                    type="file"
                    id="myFile"
                    name="profilePic"
                    onChange={(e) => {
                      let usr = this.state.user;
                      usr.profilepicture = e.target.files[0];
                      this.setState({ user: usr });
                    }}
                  />
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row className="mb-2">
                {this.state.toggleEdit === false ?
                    "First Name: " :
                    "First Name*: "}
                  {this.state.toggleEdit === false ? (
                    this.state.user.name
                  ) : (
                    <Form.Control
                      required
                      type="text"
                      name="name"
                      value={this.state.user.name}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.name = e.target.value;
                        this.setState({ user: usr });
                        this.value = this.state.user.name;
                      }}
                    />
                  )}
                </Row>
                <Row className="mb-2">
                {this.state.toggleEdit === false ?
                    "Surname: " :
                    "Surname*: "}
                  {this.state.toggleEdit === false ? (
                    this.state.user.sname
                  ) : (
                    <Form.Control
                      required
                      type="text"
                      name="sname"
                      value={this.state.user.sname}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.sname = e.target.value;
                        this.setState({ user: usr });
                        this.value = this.state.user.sname;
                      }}
                    />
                  )}
                </Row>
                <Row className="mb-2">
                  {this.state.toggleEdit === false ?
                    "Email: " :
                    "Email*: "}
                  {this.state.toggleEdit === false ?  (
                    this.state.user.email
                  ) : (
                    <Form.Control
                      required
                      type="email"
                      name="email"
                      value={this.state.user.email}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.email = e.target.value;
                        this.setState({ user: usr });
                        this.value = this.state.user.email;
                      }}
                    />
                  )}
                </Row>
                <Row className="mb-2">
                    {"Birthdate: "}
                  {this.state.toggleEdit === false ? 
                    this.state.user.birthday === "" ?
                      "None"
                    :
                      this.state.user.birthday
                   : (
                    <Form.Control
                      type="date"
                      name="bday"
                      id="bday"
                      value={this.state.user.birthday}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.birthday = e.target.value;
                        this.setState({ user: usr });
                        this.value = this.state.user.birthday;
                      }}
                    />
                  )}
                </Row>
              </Container>
            </Modal.Body>
            <Container>
              {this.state.toggleEdit === true ? (
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <Button
                          block
                          variant="secondary"
                          className="mb-2"
                          onClick={() => {
                            this.closeEdit();
                          }}
                        >
                          <i className="fa fa-remove"> </i> Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="submit"
                          block
                          variant="secondary"
                          className="mb-2"
                        >
                          <i className="fa fa-save"> </i> Save Changes{" "}
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          block
                          variant="dark"
                          className="mb-2"
                          onClick={() => this.handleLogout()}
                        >
                          <i className="fa fa-sign-out"> </i> Logout{" "}
                        </Button>
                      </Col>
                  </Row>
                </Col>
              </Row>
              ) : (
                <Row>
                  <Col>
                    <Button
                      block
                      variant="secondary"
                      className="mb-2"
                      onClick={() => {
                        this.openEdit();
                      }}
                    >
                      <i className="fa fa-edit"> </i> Edit details{" "}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      variant="dark"
                      className="mb-2"
                      onClick={() => this.handleLogout()}
                    >
                      <i className="fa fa-sign-out"> </i> Logout{" "}
                    </Button>
                  </Col>
                </Row>
              )}

            </Container>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Settings;
