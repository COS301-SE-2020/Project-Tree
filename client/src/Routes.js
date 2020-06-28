import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Home from './Home'
import User from './User'
import ProjectPage from './ProjectPage'
import {Navbar, Nav} from 'react-bootstrap'


class Routes extends Component {  
	render() {
		return (
			<Router>
					<Navbar sticky="top" bg="dark" variant="dark">
						<Nav className="mr-auto" >
						<Nav.Link href="/">Home</Nav.Link>
						<Nav.Link href="/project">Projects</Nav.Link>
						</Nav>
						<Nav>
						<Nav.Link className="form-inline"  href="/user">Login</Nav.Link>
						</Nav>
					</Navbar>

					{/* A <Switch> looks through its children <Route>s and
						renders the first one that matches the current URL. */}
					<Switch>
					<Route path="/project">
						<ProjectPage />
					</Route>
					<Route path="/">
						<Home />
					</Route>
					<Route path="/user">
						<User />
					</Route>
					</Switch>
			</Router>
		);
	}
}

export default Routes;