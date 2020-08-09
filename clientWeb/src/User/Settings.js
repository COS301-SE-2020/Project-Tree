import React from "react";
import { Modal, Button, Col, Row, Container, Form} from "react-bootstrap";
import $ from "jquery";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
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
    this.setState({
      toggleEdit: false,
      user: this.props.user
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.user!== prevProps.user) {
      this.setState({ user: this.props.user});
    }
  }
  async handleSubmit(event) {
    event.preventDefault();
    let data = stringifyFormData(new FormData(event.target));
    $.post("/user/edit", JSON.parse(data), (response) => {
      this.setState({ show: false });
      this.props.setUser(response);
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
           <Form><Modal.Header closeButton>
              <Modal.Title > Image </Modal.Title> 
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>Name: &nbsp;
                  {this.state.toggleEdit === false ?
                  this.props.user.name
                  :
                  (
                    <Form.Control
                    required
                    type="text"
                    name="edit"
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
                    this.props.user.sname
                    :
                    (
                      <Form.Control
                      required
                      type="text"
                      name="edit"
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
                    this.props.user.email
                    :
                    (
                      <Form.Control
                      required
                      type="email"
                      name="edit"
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
                              Save changes
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
