import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Home from './Home/Home'
import User from './User/User'
import ProjectPage from './Project/ProjectPage'
import GraphPage from './Graph/GraphPage'
import {Navbar, Nav} from 'react-bootstrap'


class Routes extends Component {  
	constructor(props) {
		super(props);
		this.state = {project:null}
		this.toggleGraphPage = this.toggleGraphPage.bind(this);
	}

	toggleGraphPage(newProject){
		this.setState({project:newProject});
	}

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
					<Route path="/graph">
						<GraphPage project={this.state.project} toggleGraphPage={this.toggleGraphPage}/>
					</Route>
					<Route path="/project">
						<ProjectPage toggleGraphPage={this.toggleGraphPage}/>
					</Route>
					<Route path="/graph">
						<Graph />
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