import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home/Home";
import User from "./User/User";
import ProjectPage from "./Project/ProjectPage";
import GraphPage from "./Graph/GraphPage";
import { Button, Container, Row, Col, Navbar, Nav  } from "react-bootstrap";
import SideBar from "./SideBar";
import $ from "jquery";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { projects: null, showSideBar: false };
    $.post("/project/get", (response) => {
      this.setState({ projects: response.projects });
    }).fail((response) => {
      throw Error(response.message);
    });
  }


  toggleSideBar(){
    this.setState({showSideBar: !this.state.showSideBar});
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <Navbar sticky="top" bg="dark" variant="dark">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              {this.state.showSideBar === false ?
                (
                  <Nav.Link href="#" onClick={() => {this.toggleSideBar();}}>
                    open Projects view
                  </Nav.Link>
                ):
                (
                  <Nav.Link href="#" onClick={() => {this.toggleSideBar();}}>
                    close Projects view
                  </Nav.Link>
                )
              }
            </Nav>
            <Nav>
              <Nav.Link className="form-inline" href="/user">
                Login
              </Nav.Link>
            </Nav>
          </Navbar>
          <Container>
            <Row>
              {this.state.showSideBar !== false ? 
              (
                <Col xs={2}>
                  <SideBar projects={this.state.projects}/>
                </Col>
              ) : null}
              <Col>
                <Switch>
                  {/* <Route exact path="/"> can be used for login and logout
                    {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
                  </Route> */}
                  <Route path="/graph">
                    {this.state.project != null ? (
                      <GraphPage
                        project={this.state.project}
                        toggleGraphPage={this.toggleGraphPage}
                      />
                    ) : null}
                  </Route>
                  <Route path="/project">
                    <ProjectPage toggleGraphPage={this.toggleGraphPage} />
                  </Route>
                  <Route path="/">
                    <Home toggleGraphPage={this.toggleGraphPage} />
                  </Route>
                  <Route path="/user">
                    <User />
                  </Route>
                </Switch>
              </Col>
            </Row>
          </Container>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
