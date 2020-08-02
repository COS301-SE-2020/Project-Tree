import React, { Component } from "react";
import './App.css';
import Registration from "./User/Register";
import Login from "./User/Login";
import axios from 'axios';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleSuccessfulAuth(data) {
    console.log(data)
    this.props.handleLogin(data);
    this.props.history.push("/home");
  }

  handleLogoutClick() {
    // axios
    //   .delete("http://localhost:3001/logout", { withCredentials: true })
    //   .then(response => {
    //     this.props.handleLogout();
    //   })
    //   .catch(error => {
    //     console.log("logout error", error);
    //   });
    this.props.handleLogout();
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <Login handleSuccessfulAuth={this.handleSuccessfulAuth} />
      </div>
    );
  }
}