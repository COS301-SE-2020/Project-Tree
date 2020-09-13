import React from "react";
import { Modal, Button, Col, Row, Container, Form } from "react-bootstrap";
import $ from "jquery";
import "./style.scss";

let global_pfp = "";
function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function getBase64(file, onLoadCallback) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = onLoadCallback;
  reader.onerror = function(error) {
      console.log('Error when converting PDF file to base64: ', error);
  };
}

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);
  
  const handleOnClickUpload = event => {
    hiddenFileInput.current.click();
  };

  return (
    <React.Fragment>
      <Button onClick={()=>handleOnClickUpload()}>Upload File</Button>
      <input 
        type="file" 
        id="input_img" 
        onChange={(e) => { props.fileChange(e) }} 
        accept="image/x-png,image/gif,image/jpeg" 
        style={{display: 'none'}}
        ref={hiddenFileInput}
      />
    </React.Fragment>
  );
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, toggleEdit: false, user: this.props.user, pfp: null};
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getB64 = this.getB64.bind(this);
    this.fileChange = this.fileChange.bind(this);
  }

  

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({ user: this.props.user });
    }
  }

  showModal() {
    this.setState({ show: true });
  }

  async fileChange(){
    var file = document.getElementById('input_img');
    var form = new FormData();
    form.append("image", file.files[0])
    var settings = {
      "url": "https://api.imgbb.com/1/upload?key=0a77a57b5cf30dc09fd33f608fcb318c",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    }; 
    await $.ajax(settings).done(function (response) {
      console.log(response);
      var jx = JSON.parse(response);
      console.log(jx.data.url); 
      global_pfp = jx.data.url;
    });
    this.setState({ pfp: global_pfp });
  }

  async getB64(file) {
    let document = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        document = reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };

    return document;
}

  // async getBase64(file) {
  //   return new Promise(function (resolve, reject) {
  //     let reader = new FileReader();
  //     reader.onload = function () { resolve(reader.result); };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file.files[0]);
  // });
  // }

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
    sleep(6500);
    console.log("OLD PFP", this.state.user.profilepicture)
    console.log("PFP", )
    console.log("GLOBAL", global_pfp)
    event.preventDefault();
    let data = new FormData();
    data.append("name", this.state.user.name);
    data.append("sname", this.state.user.sname);
    data.append("email", this.state.user.email);
    data.append("bday", this.state.user.birthday);
    await data.append("profilepicture", this.state.pfp);
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
              <div className="circular--portrait">
                <img
                 // src="storage/default.png"
                  src = {this.state.user.profilepicture}
                  alt="Profile"
                  // height="80"
                  // width="80"
                />
                </div>
                {this.state.toggleEdit === false ? (
                  "       " + this.state.user.name + " " + this.state.user.sname
                ) : (
                  <Row>
                    <FileUploader fileChange={this.fileChange} />
                    {this.state.pfp !== null ? <p>Save changes to save photo!</p> : null}
                  </Row>
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
