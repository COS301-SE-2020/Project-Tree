import React from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import $ from "jquery";
import register from "../Images/Register.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import About from "../About";
const eye = <FontAwesomeIcon icon={faEye} />;

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

export class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
      sname: "",
      passwordError: "",
      passwordError2: "",
      passwordError3: "",
      passwordError4: "",
      hidden: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  password_validate(d) {
    let str = "";
    let arr = [];
    let p = d.password;
    /[A-Z]/.test(p) === false
      ? arr.push("Must contain at least one Capital Letter \n")
      : (str += "");
    /[0-9]/.test(p) === false
      ? arr.push("Must contain at least one number \n")
      : (str += "");
    /[~`!#$@%^&*_+=\-[\]\\';,/{}|\\":<>?]/g.test(p) === false
      ? arr.push("Must contain at least one special character eg. #!@$ \n")
      : (str += "");
    /^.{8,22}$/.test(p) === false
      ? arr.push("Must be between 8 and 22 characters  ")
      : (str += "");
    return arr;
  }

  validateEmail(text) {
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text.email) === false) {
      return false;
    } else {
      return true;
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = stringifyFormData(new FormData(event.target));
    let x = JSON.parse(data);
    let arr = this.password_validate(x);
    let p = this.validateEmail(x);
    if (arr.length === 0 && p) {
      $.post("/register", JSON.parse(data), (response) => {
        if (
          response.message ===
          "An account with that email has already been registered."
        ) {
          alert(
            "User with this email already exists. Try with a different email."
          );
        } else {
          localStorage.setItem("sessionToken", response.sessionToken);
          this.props.handleReg(response);
        }
      }).fail(() => {
        alert("Unable to create User");
      });
    } else if (p !== true) {
      alert("Email format is not valid. Please check again.");
    } else {
      this.setState({ passwordError: arr[0] });
      this.setState({ passwordError2: arr[1] });
      this.setState({ passwordError3: arr[2] });
      this.setState({ passwordError4: arr[3] });
    }
  }

  toggleShow() {
    this.setState({ hidden: !this.state.hidden });
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, name, sname } = this.state;
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header"> Register </div>
        <Form onSubmit={this.handleSubmit}>
          <div className="content">
            <div className="image">
              <img alt="Registration" src={register} />
            </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="name">Name </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sname">Surname </label>
                <input
                  type="text"
                  name="sname"
                  value={sname}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-groupPass">
                <label htmlFor="password">Password</label>
                <div className="form-line">
                  <input
                    type={this.state.hidden ? "password" : "text"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    required
                  />
                  <i onClick={this.toggleShow}>{eye}</i>
                </div>
              </div>
              <input
                hidden
                type="date"
                name="um_date"
                id="um_date"
                value={" "}
                onChange={() => {}}
              />
              <input
                hidden
                type="text"
                name="type"
                id="type"
                value={"webToken"}
                onChange={() => {}}
              />
              <div style={{ fontSize: 12, color: "red" }}>
                <p>{this.state.passwordError}</p>
                <p>{this.state.passwordError2}</p>
                <p>{this.state.passwordError3}</p>
                <p>{this.state.passwordError4}</p>
              </div>
            </div>
          </div>
          <div className="footer">
            <Row>
              <Col>
                <Button type="submit" className=".btn">
                  Register
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <About />
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}
