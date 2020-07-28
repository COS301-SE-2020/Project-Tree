import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Home from './Home/Home'
import ProjectPage from './Project/ProjectPage'
import GraphPage from './Graph/GraphPage'
import {Navbar, Nav} from 'react-bootstrap'
import Login  from './User/login';


class Routes extends Component {  
	constructor(props) {
		super(props);
		this.state = {project:JSON.parse(sessionStorage.getItem("project"))}
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
							<Nav.Link className="form-inline" href="/login">login</Nav.Link>
						</Nav>
					</Navbar>

					<Switch>
						<Route path="/graph">
							{this.state.project != null ? <GraphPage project={this.state.project} toggleGraphPage={this.toggleGraphPage}/> : null}
						</Route>
						<Route path="/project">
							<ProjectPage toggleGraphPage={this.toggleGraphPage}/>
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/">
							<Home toggleGraphPage={this.toggleGraphPage}/>
						</Route>
					</Switch>
			</Router>
		);
	}
}

export default Routes;

