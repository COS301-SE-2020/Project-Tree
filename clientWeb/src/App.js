import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import User from "./User/User";
import ProjectPage from "./Project/ProjectPage";
import GraphPage from "./Graph/GraphPage";
import { Container, Row, Col, Navbar, Nav  } from "react-bootstrap";
import SideBar from "./SideBar";
import $ from "jquery";
import logo from './Images/Logo.png';
import Login from './User/login'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      projects: null,
      project: null, 
      showSideBar: false,
      loggedInStatus: false,
      user: {}
    };
    this.setProject = this.setProject.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
	  this.handleLogin = this.handleLogin.bind(this);
	  this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(){
    $.post("/project/get", (response) => {
      this.setState({projects: response.projects });
    }).fail((response) => {
      throw Error(response.message);
    });
    
  }

  setProject(proj){
    if(proj.delete != null){
      let projects = [];
      for (let i = 0; i < this.state.projects.length; i++) {
        if(this.state.projects[i].id !== proj.delete) projects.push(this.state.projects[i]);
      }
      this.setState({projects: projects})
      this.setState({project: null});
    }else{
      if(!this.state.projects.includes(proj)){
        let projects = this.state.projects;
        projects.push(proj);
        this.setState({projects: projects, redirect: "project"});
      }
      this.setState({project: proj})
    }
  }

  toggleSideBar(){
    if(this.state.projects != null) this.setState({showSideBar: !this.state.showSideBar});
    else this.setState({showSideBar: this.state.showSideBar});
  }

  closeSideBar(){
    this.setState({showSideBar: false});
  }

  handleLogin(data){
    this.setState({
      loggedInStatus: data.status,
      user: data.id
    });
    console.log(this.state)
   }
   
  handleLogout() {
    console.log(this.state)
    this.setState({
      loggedInStatus: false,
      user: {}
    });
    console.log(this.state)
    this._isMounted = false;
  }

  render() {
  
    return (
      <React.Fragment>
        <BrowserRouter>
          <button onClick={() => this.handleLogout()}>Logout</button>
          <Navbar sticky="top" bg="#96BB7C" style={{fontFamily:"arial black", backgroundColor: "#96BB7C"}}>
            <Nav className="mr-auto form-inline ">
              <Nav.Link href="/">
                <img src={logo} alt="Logo" style={{width:"80px"}}/>
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
                  <SideBar closeSideBar={() => {this.closeSideBar()}} projects={this.state.projects} setProject={project => {this.setProject(project)}}/>
                </Col>
              ) : null}
              <Col>
                <Switch>
                  <Route path="/project">
                    {this.state.project != null ? (
                      <ProjectPage project={this.state.project} setProject={project => this.setProject(project)}/>
                    ) : <Redirect to="/"/>}
                  </Route>
                  <Route path="/graph">
                    {this.state.project != null ? (
                      <GraphPage
                        project={this.state.project}
                      />
                    ) : <Redirect to="/"/>}
                  </Route>
                  <Route path="/user">
                    <User />
                  </Route>
                  <Route path="/">
                    {this.state.loggedInStatus? (<Home />) : (<Login handleLogin={data => this.handleLogin(data)}/>)}
                  </Route>
                </Switch>
              </Col>
            </Row>
          </Container>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
