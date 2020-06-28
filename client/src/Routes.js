import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Home from './Home'
import ProjectPage from './ProjectPage'
import TaskPage from './TaskPage'
import Graph from './Graph'

class Routes extends Component {  
	render() {
		return (
			<Router>
				<div>
					<nav>
					<ul>
						<li>
						<Link to="/">Home</Link>
						</li>
						<li>
						<Link to="/project">Projects</Link>
						</li>
						<li>
						<Link to="/graph">Graph</Link>
						</li>
					</ul>
					</nav>

					{/* A <Switch> looks through its children <Route>s and
						renders the first one that matches the current URL. */}
					<Switch>
					<Route path="/project">
						<ProjectPage />
					</Route>
					<Route path="/graph">
						<Graph />
					</Route>
					<Route path="/">
						<Home />
					</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default Routes;