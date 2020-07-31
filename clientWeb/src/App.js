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
import logo from './Images/Logo.png';

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
          <Navbar sticky="top" bg="#96BB7C" style={{fontFamily:"arial black", backgroundColor: "#96BB7C"}}>
            <Nav className="mr-auto">
              <Nav.Link href="/">
                <img src={logo} alt="Logo" />
              </Nav.Link>
              {this.state.showSideBar === false ?
                (
                  <Nav.Link href="#" variant="dark" onClick={() => {this.toggleSideBar();}}>
                    Project List
                  </Nav.Link>
                ):
                (
                  <Nav.Link href="#" variant="dark" onClick={() => {this.toggleSideBar();}}>
                    Close Project List
                  </Nav.Link>
                )
              }
            </Nav>
            <Nav>
              <Nav.Link className="form-inline" href="/user">
                <i className="fa fa-cogs" style={{fontSize:"30px"}}></i>
              </Nav.Link>
            </Nav>
          </Navbar>
          <Container fluid>
            <Row>
              {this.state.showSideBar !== false ? 
              (
                <Col xs={2} className="border-right border-dark" style={{height: "100vh"}}>
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
