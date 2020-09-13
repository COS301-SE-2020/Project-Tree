import React, { Component } from "react";
import { Modal, Button, Col, Row, Container, Form, Spinner } from "react-bootstrap";
import $ from "jquery";
import loginImg from "../Images/LoginImg.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import About from "../About";


function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginErrors: "",
      webToken: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    let data = stringifyFormData(new FormData(event.target));
    $.post("/login", JSON.parse(data), (response) => {
      if (response.status === true) {
        console.log("LOGGED IN")
        localStorage.setItem("sessionToken", response.sessionToken);
        this.props.handleLogin(response);
      } else alert("Email or Password is incorrect");
    })
    .fail(() => {
      alert("Email or Password is incorrect.");
    })
    event.preventDefault();
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <Form onSubmit={this.handleSubmit}>
          <div className="content">
            <div className="image">
              <img alt="Login" src={loginImg} />
            </div>
            <div className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <input
                hidden
                type="text"
                name="type"
                id="type"
                value={"webToken"}
                onChange={() => {}}
         />
        <div className="footer">
              <Button type="submit" className=".btn">
                Login
              </Button>  
           <Row>
            <Col>
              <About/>
            </Col>
            </Row>          
          </div>
        </Form>
      </div>
    );
  }
}
