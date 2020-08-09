import React from "react";
import { Modal, Button, Col, Row, Container, Form} from "react-bootstrap";
import $ from "jquery";

function formData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  console.log("formdata", data);
  return data;
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, toggleEdit: false, user: {}};
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    $.post("/user/get", {token: localStorage.getItem('sessionToken')}, (response) => {
      this.setState({user: response.user});
    })
    .fail((response) => {
        throw Error(response.message);
    });
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
      user: {}
    });
    this._isMounted = false;
    window.location.reload(false);
  }

  openEdit() {
    this.setState({
      toggleEdit: true
    })
  }

  closeEdit() {
    $.post("/user/get", {token: localStorage.getItem('sessionToken')}, (response) => {
      this.setState({toggleEdit: false, user: response.user });
    })
    .fail((response) => {
        throw Error(response.message);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(event.target);
    let data = new FormData(event.target);
    data = await formData(data);
    console.log(data.name);
    $.post("/user/edit", {user: data, token: localStorage.getItem('sessionToken')} , (response) => {
      this.setState({user: response.user, prevUser: response.user });
      this.closeEdit();
    })
    .fail(() => {
      alert("Unable to update user preferences");
    })
  }

  render() {
    return ( 
      <React.Fragment>
        <Button
          className="my-2"
          style={{borderColor:"#96BB7C", backgroundColor:"#96BB7C"}}
          onClick={() => {this.showModal()}}
          size="sm"
        >
          <i className="fa fa-cogs text-dark" style={{fontSize:"30px"}}></i>
        </Button>
        <Modal show={this.state.show} onHide={() => {this.hideModal()}}>
          <Form onSubmit={this.handleSubmit}>
             <Modal.Header closeButton>
              <Modal.Title > Image </Modal.Title> 
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>Name: &nbsp;
                  {this.state.toggleEdit === false ?
                  this.state.user.name
                  :
                  (
                    <Form.Control
                    required
                    type="text"
                    name="name"
                    value={this.state.user.name}
                    onChange={(e) => {
                      let usr = this.state.user;
                      usr.name = e.target.value;
                      this.setState({user: usr });
                      this.value = this.state.user.name;
                    }}
                    />
                   )}
                </Row>
                <Row>Surname: &nbsp;
                  {this.state.toggleEdit === false ?
                    this.state.user.sname
                    :
                    (
                      <Form.Control
                      required
                      type="text"
                      name="sname"
                      value={this.state.user.sname}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.sname = e.target.value;
                        this.setState({user: usr });
                        this.value = this.state.user.sname;
                    }}
                      />
                    )}
                </Row>
                <Row>Email: &nbsp;
                {this.state.toggleEdit === false ?
                    this.state.user.email
                    :
                    (
                      <Form.Control
                      required
                      type="email"
                      name="email"
                      value={this.state.user.email}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.email = e.target.value;
                        this.setState({user: usr });
                        this.value = this.state.user.email;
                    }}
                      />
                    )}
                </Row>
                <Row>Birthdate: &nbsp;
                {this.state.toggleEdit === false ?
                    this.state.user.birthday
                    :
                    (
                      <Form.Control
                      required
                      type="date"
                      name="bday"
                      id="bday"
                      value={this.state.user.birthday}
                      onChange={(e) => {
                        let usr = this.state.user;
                        usr.birthday = e.target.value;
                        this.setState({user: usr });
                        this.value = this.state.user.birthday;
                    }}
                      />
                    )}
                </Row>
                <input
                  hidden
                  type="number"
                  id="userId"
                  name="userId"
                  value={this.state.user.id}
                />
              </Container>
            </Modal.Body>
              <Container>
                  {
                    this.state.toggleEdit === true?
                      (
                        <Row>
                          <Col>
                            <Button block variant="secondary" className="m-2" onClick={() => {this.closeEdit()}}>
                              Cancel
                            </Button> 
                          </Col>
                          <Col>
                            <Button type="submit" block variant="secondary" className="m-2">
                              Save Changes
                            </Button> 
                          </Col>
                        </Row>
                      )
                    :
                      (
                        <Row>
                          <Col>
                            <Button block variant="secondary" className="m-2" onClick={() => {this.openEdit()}}>
                              Edit Details
                            </Button> 
                          </Col>
                        </Row>
                      )
                  }
                <Row>
                  <Col>
                    <Button block  variant="dark" className="m-2" onClick={() => this.handleLogout()}>Logout</Button>
                  </Col>
                </Row>
              </Container>
              </Form> 
        </Modal>
      </React.Fragment>
    );
  }
}

export default Settings;
