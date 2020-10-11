import React from "react";
import {
  Modal,
  Button,
  Col,
  Row,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import $ from "jquery";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

let global_pfp = "";
function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

/* function getBase64(file, onLoadCallback) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = onLoadCallback;
  reader.onerror = function (error) {
    console.log("Error when converting PDF file to base64: ", error);
  };
} */

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);

  const handleOnClickUpload = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <React.Fragment>
      <Button
        variant="dark"
        className="mb-1"
        onClick={() => handleOnClickUpload()}
      >
        Upload File
      </Button>
      <input
        type="file"
        id="input_img"
        onChange={(e) => {
          props.fileChange(e);
        }}
        accept="image/x-png,image/gif,image/jpeg"
        style={{ display: "none" }}
        ref={hiddenFileInput}
      />
    </React.Fragment>
  );
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      toggleEdit: false,
      user: this.props.user,
      pfp: "",
      isloading: false,
      togglePass: false,
      password: "",
      secureTextEntry: true,
      confirm_secureTextEntry: true,
      confirmPassword: "",
      passwordError: "",
      passwordError2: "",
      passwordError3: "",
      passwordError4: "",
      hidden: true,
      deleteUserCheck: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.togglePass = this.togglePass.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.password_validate = this.password_validate.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  password_validate(p) {
    //let str = "";
    let arr = [];
    // let p = d.password;
    /[A-Z]/.test(p) === false
      ? arr.push("Must contain at least one Capital Letter \n")
      : arr.push("Must contain at least one Capital Letter ✓");
    /[0-9]/.test(p) === false
      ? arr.push("Must contain at least one number \n")
      : arr.push("Must contain at least one number ✓");
    /[~`!#$@%^&*_+=\-[\]\\';,/{}|\\":<>?]/g.test(p) === false
      ? arr.push("Must contain at least one special character eg. #!@$ \n")
      : arr.push("Must contain at least one special character eg. #!@$ ✓");
    /^.{8,22}$/.test(p) === false
      ? arr.push("Must be between 8 and 22 characters ")
      : arr.push("Must be between 8 and 22 characters  ✓");
    return arr;
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({ user: this.props.user });
    }
  }

  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }

  showModal() {
    this.setState({ show: true });
  }

  async fileChange() {
    var file = document.getElementById("input_img");
    var form = new FormData();
    console.log(file.files[0])
    form.append("image", file.files[0]);
    var settings = {
      url:
        "https://api.imgbb.com/1/upload?key=0a77a57b5cf30dc09fd33f608fcb318c",
      method: "POST",
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: form,
    };
    await $.ajax(settings).done(function (response) {
      var jx = JSON.parse(response);
      global_pfp = jx.data.url;
    });
    console.log(global_pfp)
    this.setState({ pfp: global_pfp });
  }

  hideModal() {
    this.setState({ show: false, deleteUserCheck:false });
  }

  handlePasswordChange(val) {
    this.setState({
      password: val,
    });
  }

  handleNewPasswordChange(val) {
    let arr = this.password_validate(val);
    this.setState({
      passwordError: arr[0],
      passwordError2: arr[1],
      passwordError3: arr[2],
      passwordError4: arr[3],
      isValidPassword: false,
    });

    if (
      arr[0].indexOf("✓") !== -1 &&
      arr[1].indexOf("✓") !== -1 &&
      arr[2].indexOf("✓") !== -1 &&
      arr[3].indexOf("✓") !== -1
    ) {
      console.log("POP");
      this.setState({
        confirmPassword: val,
        confirmNewPass: true,
      });
    } else {
      this.setState({
        confirmNewPass: false,
      });
    }
  }

  handleLogout() {
    localStorage.clear();
    this.setState({
      loggedInStatus: false,
    });
    this._isMounted = false;
    window.location.reload(false);
  }

  deleteUser() {
    if(this.state.deleteUserCheck === false){
      this.setState({deleteUserCheck:true})
      return;
    }

    $.post(
      "/user/delete",
      { token: localStorage.getItem("sessionToken") },
      (response) => {
        if(response.status)
        {
          this.handleLogout()
        }
      }
    ).fail((response) => {
      throw Error(response.message);
    });
  }

 

  openEdit() {
    this.setState({
      toggleEdit: true,
    });
  }

  togglePass() {
    this.setState({
      togglePass: !this.state.togglePass,
    });
  }

  closeEdit() {
    $.post(
      "/user/get",
      { token: localStorage.getItem("sessionToken") },
      (response) => {
        this.setState({ toggleEdit: false, user: response.user, pfp: "", deleteUserCheck:false });
      }
    ).fail((response) => {
      throw Error(response.message);
    });
  }

  async handlePass(oldPass, newPass) {
    this.setState({ isloading: true });
    if (oldPass.trim().length < 1) {
      alert("Please enter your password you wish to change");
      return;
    }

    if (newPass.trim().length < 1) {
      alert("Please ensure all password criteria are met");
      return;
    }

    if (this.state.confirmNewPass) {
      let data = {
        token: localStorage.getItem("sessionToken"),
        testPass: oldPass,
        newPass: newPass,
      };
      data = JSON.stringify(data);
      $.post("/user/pass", JSON.parse(data), (response) => {
        if (response.message === "wrong") {
          alert(
            "Password entered does not match password registered with this account."
          );
        } else if (response.message === "success") {
          alert("Success");
          this.togglePass();
          this.setState({ isloading: false, pfp: "" });
        }
      }).fail(() => {
        alert("Unable to change password");
      });
    } else {
      alert("Unable to change password");
    }
  }

  async handleSubmit(event) {
    this.setState({ isloading: true });
    event.preventDefault();
    let data = new FormData();
    data.append("name", this.state.user.name);
    data.append("sname", this.state.user.sname);
    data.append("email", this.state.user.email);
    data.append("bday", this.state.user.birthday);
    await data.append("profilepicture", this.state.pfp);
    await data.append("oldprofile", this.state.user.profilepicture);
    data.append("token", localStorage.getItem("sessionToken"));
    data = await stringifyFormData(data);
    $.post("/user/edit", data, (response) => {
      this.setState({ user: response.user, prevUser: response.user });
      this.closeEdit();
      this.setState({ isloading: false, pfp: "" });
    }).fail(() => {
      alert("Unable to update user preferences");
    });
  }

  render() {
    let deleteColor = 'dark';
    let deleteString = 'Delete User ';
    if(this.state.deleteUserCheck){
      deleteColor = 'danger';
      deleteString = 'Are you sure? '
    }

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
            this.setState({ pfp: "" });
          }}
        >
          <Form onSubmit={this.handleSubmit} type="multipart/form-data">
            <Modal.Header closeButton>
              <Modal.Title>
                <div className="circular--portrait">
                  <img
                    // src="storage/default.png"
                    src={this.state.user.profilepicture}
                    alt="Profile"
                    // height="80"
                    // width="80"
                  />
                </div>
                {this.state.toggleEdit === false ? (
                  "       " + this.state.user.name + " " + this.state.user.sname
                ) : (
                  <React.Fragment>
                    <Row>
                      <Col>
                        <FileUploader fileChange={this.fileChange} />
                      </Col>
                    </Row>
                    <Row>
                      {this.state.pfp !== "" ? (
                        <Col style={{ fontSize: "18px" }}>
                          {" "}
                          Save changes to save photo!{" "}
                        </Col>
                      ) : null}
                    </Row>
                  </React.Fragment>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.togglePass === true ? (
                <Container>
                  <Row className="mb-2 align-items-center">
                    <Col xs={5}>
                      {this.state.toggleEdit === false
                        ? "Current Password: "
                        : "Current Password*: "}
                    </Col>
                    <Col>
                      <Form.Control
                        required
                        type={this.state.hidden ? "password" : "text"}
                        id="password"
                        name="password"
                        value={this.state.password}
                        onChange={(e) => {
                          this.setState({ password: e.target.value });
                          this.value = this.state.password;
                        }}
                      />
                    </Col>
                    <Col xs={1}>
                      <i onClick={this.toggleShow}>{eye}</i>
                    </Col>
                  </Row>
                  <Row className="mb-2 align-items-center">
                    <Col xs={5}>
                      {this.state.toggleEdit === false
                        ? "New Password: "
                        : "New Password*: "}
                    </Col>
                    <Col>
                      <Form.Control
                        required
                        type={this.state.hidden ? "password" : "text"}
                        id="newPass"
                        name="newPass"
                        value={this.state.confirmPassword}
                        onChange={(e) => {
                          this.handleNewPasswordChange(e.target.value);
                          this.setState({ confirmPassword: e.target.value });
                          this.value = this.state.confirmPassword;
                          console.log(this.state.confirmPassword);
                        }}
                      />
                    </Col>
                    <Col xs={1}>
                      <i onClick={this.toggleShow}>{eye}</i>
                    </Col>
                  </Row>
                  <Row>
                    <div>
                      <p></p>
                      <p></p>
                      <p
                        style={
                          this.state.passwordError.indexOf("✓") !== -1
                            ? { color: "green" }
                            : { color: "red" }
                        }
                      >
                        {" "}
                        {this.state.passwordError}
                      </p>
                      <p
                        style={
                          this.state.passwordError2.indexOf("✓") !== -1
                            ? { color: "green" }
                            : { color: "red" }
                        }
                      >
                        {" "}
                        {this.state.passwordError2}
                      </p>
                      <p
                        style={
                          this.state.passwordError3.indexOf("✓") !== -1
                            ? { color: "green" }
                            : { color: "red" }
                        }
                      >
                        {" "}
                        {this.state.passwordError3}
                      </p>
                      <p
                        style={
                          this.state.passwordError4.indexOf("✓") !== -1
                            ? { color: "green" }
                            : { color: "red" }
                        }
                      >
                        {" "}
                        {this.state.passwordError4}
                      </p>
                    </div>
                  </Row>
                </Container>
              ) : (
                <Container>
                  <Row className="mb-2">
                    {this.state.toggleEdit === false
                      ? "First Name: "
                      : "First Name*: "}
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
                    {this.state.toggleEdit === false
                      ? "Surname: "
                      : "Surname*: "}
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
                    {this.state.toggleEdit === false ? "Email: " : "Email*: "}
                    {this.state.toggleEdit === false ? (
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
                    {this.state.toggleEdit === false ? (
                      this.state.user.birthday === "" ? (
                        "None"
                      ) : (
                        this.state.user.birthday
                      )
                    ) : (
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
              )}
            </Modal.Body>
            {this.state.togglePass === true ? (
              <Container>
                <Row>
                  <Col>
                    <Button
                      block
                      variant="secondary"
                      className="mb-2"
                      onClick={() => {
                        this.togglePass();
                      }}
                    >
                      <i className="fa fa-remove"> </i> Cancel{" "}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      variant="dark"
                      className="mb-2"
                      onClick={() => {
                        this.handlePass(
                          this.state.password,
                          this.state.confirmPassword
                        );
                      }}
                    >
                      <i className="fa fa-edit"> </i> Submit
                    </Button>
                  </Col>
                </Row>
              </Container>
            ) : (
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
                            variant="secondary"
                            disabled={this.state.isloading}
                            className="mb-2"
                            block
                          >
                            {this.state.isloading ? (
                              <Spinner
                                animation="border"
                                variant="success"
                                size="sm"
                              ></Spinner>
                            ) : (
                              <React.Fragment>
                                <i className="fa fa-save"> </i> {"Save Changes"}{" "}
                              </React.Fragment>
                            )}
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Button
                            block
                            variant={deleteColor}
                            className="mb-2"
                            onClick={() => this.deleteUser()}
                          >
                            <i className="fa fa-sign-out"> </i> {deleteString}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col className="pr-1 pt-1 pb-1">
                      <Button
                        block
                        variant="secondary"
                        className="mr-1 mt-1 mb-1"
                        onClick={() => {
                          this.openEdit();
                        }}
                      >
                        <i className="fa fa-edit"> </i> Edit{" "}
                      </Button>
                    </Col>
                    <Col xs={6} className="pr-1 pt-1 pl-1 pb-1">
                      <Button
                        block
                        variant="dark"
                        className="mr-1 mt-1 mb-1"
                        onClick={() => this.togglePass()}
                      >
                        <i className="fa fa-key"> </i> Change Password{" "}
                      </Button>
                    </Col>
                    <Col className="pl-1 pt-1 pb-1">
                      <Button
                        block
                        variant="dark"
                        className="mr-1 mt-1 mb-1"
                        onClick={() => this.handleLogout()}
                      >
                        <i className="fa fa-sign-out"> </i> Logout{" "}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Container>
            )}
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Settings;
