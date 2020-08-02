import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import Home from './Home/Home'
import Register from './User/Register'
import ProjectPage from './Project/ProjectPage'
import GraphPage from './Graph/GraphPage'
import {Navbar, Nav} from 'react-bootstrap'
import Login  from './User/Login';
import Def  from './Def';


class Routes extends Component {  
	constructor(props) {
		super(props);
		this.state = {project:JSON.parse(sessionStorage.getItem("project"))}
		this.state.id = sessionStorage.getItem("id");
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
							<Nav.Link href="/home">Home</Nav.Link>
							<Nav.Link href="/project">Projects</Nav.Link>
						</Nav>
						<Nav>
							<Nav.Link className="form-inline"  href="/register">register</Nav.Link>
							<Nav.Link className="form-inline" href="/login">login</Nav.Link>
						</Nav>
					</Navbar>
					<Switch>
						<Route path="/home">
							<Home toggleGraphPage={this.toggleGraphPage}/>
						</Route>
						<Route path="/graph">
							{this.state.project != null ? <GraphPage project={this.state.project} toggleGraphPage={this.toggleGraphPage}/> : null}
						</Route>
						<Route path="/project">
							<ProjectPage toggleGraphPage={this.toggleGraphPage}/>
						</Route>
						<Route path="/register">
							<Register />
                    	</Route>
						<Route path="/login">
							<Login handleSuccessfulAuth={this.handleSuccessfulAuth}/>
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
			</Router>
		);
	}
}

export default Routes;

