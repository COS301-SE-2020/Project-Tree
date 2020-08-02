import React, { Component } from 'react';
import './App.css';
import Routes from './Routes'
import {Navbar, Nav} from 'react-bootstrap'

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from 'axios';
import Home from './Home/Home';
import Def from './Def';

export default class App extends Component {
	_isMounted = false;

	constructor() {
	  super();
  
	  this.state = {
		loggedInStatus: false,
		user: {}
	  };
  
	  this.handleLogin = this.handleLogin.bind(this);
	  this.handleLogout = this.handleLogout.bind(this);
	}

	checkLoginStatus() {
		console.log(this.state)
		//Check logged In 
			if (!this.state.loggedInStatus) 
			{
			  this.setState({
				loggedInStatus: false,
				user: {}
			  });
			} 
	  }
	
	  componentDidMount() {
		this._isMounted = true;
		this.checkLoginStatus();
	  }
	  

	  handleLogoutClick() {
		console.log(this.state)
		this.props.handleLogout();
		console.log(this.state)
	  }

	handleLogout() {
	console.log(this.state)
	this.setState({
		loggedInStatus: false,
		user: "000"
	});
	console.log(this.state)
	this._isMounted = false;
	}

	handleLogin(data) 
	{
		this.setState({
			loggedInStatus: data.status,
			user: data.id
		});
		console.log(this.state)
	}

	render() {
		return (
		  <div className="app">
			  	<Navbar sticky="top" bg="dark" variant="dark">
					<Nav className="mr-auto" >
						<Nav>				
							<Nav.Link className="form-inline" href="/register">Register</Nav.Link>
							<Nav.Link className="form-inline" href="/register">Logout</Nav.Link>
						</Nav>	
					</Nav>
				</Navbar>
			<button onClick={() => this.handleLogout()}>Logout</button>
			<BrowserRouter>
			  <Switch>
				<Route
				  exact path={"/"} render={props => (
					<Def
					  {...props}
					  handleLogin={this.handleLogin}
					  handleLogout={this.handleLogout}
					  loggedInStatus={this.state.loggedInStatus}
					/>
				  )}
				/>
				<Route path="/home" exact strict render={props=>
				(
					this.state.loggedInStatus ? ( <Home {...props} 
					loggedInStatus={this.state.loggedInStatus}
					id={this.state.id} />) 
					: (<Redirect to='/' />)
      			)}/>
			  </Switch>
			</BrowserRouter>
		  </div>
		//<Routes />
		);
	  }
}
