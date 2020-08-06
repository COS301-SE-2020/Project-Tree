import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import User from "./User/User";
import ProjectPage from "./Project/ProjectPage";
import GraphPage from "./Graph/GraphPage";
import { Container, Row, Col, Navbar, Nav, Button  } from "react-bootstrap";
import SideBar from "./SideBar";
import $ from "jquery";
import logo from './Images/Logo.png';
import { Login, Register } from "./User/index";
import Settings from "./User/Settings"
import About from "./About"

function RightSide(props){
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      projects: null,
      project: null, 
      showSideBar: false,
      loggedInStatus: false,
      user: {},
      isLogginActive: true
    };
    this.setProject = this.setProject.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
	  this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount(){
    let token = localStorage.getItem('sessionToken')
    if(localStorage.getItem('sessionToken') != null)
    {
      $.post("/verify", { token: token }, (response) => 
      {
        console.log(response)
        if(response)
        {
            console.log("TRue")
        }
        else{this.handleLogout()}
      })
    console.log(this.rightSide)
    this.setState({
      loggedInStatus: true })
    }
    else
    {
      console.log(this.rightSide)
      if(this.rightSide)
        this.rightSide.classList.add("right");
      //<Redirect to="/"/>
    }
    $.post("/project/get", {creatorID: token}, (response) => {
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
    if(!this.state.loggedInStatus)
    {
      return;
    }
    if(this.state.projects != null) this.setState({showSideBar: !this.state.showSideBar});
    else this.setState({showSideBar: this.state.showSideBar});
  }

  closeSideBar(){
    this.setState({showSideBar: false});
  }

  changeState() {
  const { isLogginActive } = this.state;

  if (isLogginActive) {
    this.rightSide.classList.remove("right");
    this.rightSide.classList.add("left");
  } else {
    this.rightSide.classList.remove("left");
    this.rightSide.classList.add("right");
  }
  this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  handleReg(data){
    this.setState({
      loggedInStatus: data.status,
      user: data.id
    });
   }
  
  handleLogin(data){
    this.setState({
      loggedInStatus: data.status,
      user: data.id
    });
    window.location.reload(false);
   }
   
  handleLogout() {
    window.location.reload(false);
    //localStorage.clear();   
    this._isMounted = false;
    localStorage.clear();
    this.setState({
      loggedInStatus: false,
      user: {}
    });
    console.log(this.rightSide)
    if(!this.rightSide)
        this.rightSide.classList.add("right");
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "  Register" : "Login";
    const currentActive = isLogginActive ? "Login" : "  Register";
    return (
      <React.Fragment>
        <BrowserRouter>
          <Navbar sticky="top" bg="#96BB7C" style={{fontFamily:"Courier New", backgroundColor: "#96BB7C"}}>
            <Nav className="form-inline ">
              {this.state.loggedInStatus === true ?
                this.state.showSideBar === false ?
                  (
                    <Nav.Link href="#" onClick={() => this.toggleSideBar()}>
                      <i className="fa fa-navicon text-dark" style={{fontSize:"30px"}}></i>
                    </Nav.Link>
                  ):
                  (
                    <Nav.Link href="#" onClick={() => this.toggleSideBar()}>
                      <i className="fa fa-navicon text-dark" style={{fontSize:"30px", transform: "rotate(90deg)"}}></i>
                    </Nav.Link>
                  )
                :
                null
                  }              
            </Nav>
            <Nav className="m-auto form-inline">
              <Nav.Link href="/">
                <img src={logo} alt="Logo" style={{width:"80px"}}/>
              </Nav.Link>
            </Nav>
            <Nav className="form-inline">
                <Settings/>
            </Nav>
          </Navbar>
          <Container fluid style={{height: "100%"}}>
            <Row style={{height: "100%"}}>
              {this.state.showSideBar !== false ? 
              (
                <Col  xs={12} sm={12} md={6} lg={4} xl={3} className="border-right border-dark" style={{flex: "1 1 auto", backgroundColor: "#184D47" }}>
                  <SideBar closeSideBar={() => this.closeSideBar()} projects={this.state.projects} setProject={project => this.setProject(project)}/>
                </Col>
              ) : null}              
              <Col>  
                <Switch>
                  <Route path="/project" component={ProjectPage}>
                    {this.state.project != null ? (
                      <ProjectPage project={this.state.project} setProject={project => this.setProject(project)}/>
                    ) : <Redirect to="/"/>}
                  </Route>
                  <Route path="/graph" >
                    {this.state.project != null ? (
                      <GraphPage
                        project={this.state.project}
                      />
                    ) : <Redirect to="/"/>}
                  </Route>
                  <Route path="/user">
                    <User />
                  </Route>
                  <Route path="/home">
                    {this.state.loggedInStatus? (<Home />) : (<Redirect to="/"/>)}
                  </Route>
                  <Route path="/">
                    {this.state.loggedInStatus? (<Redirect to="/home"/>) : ((<Redirect to="/" handleLogin={data => this.handleLogin(data)}/>))}
                    <div class="row">
                    <div class="column" style={{backgroundColor: "white"}}>
                     <div className="login">
                      <div className="container" ref={ref => (this.container = ref)}>
                        {isLogginActive && (<Login containerRef={ref => (this.current = ref)}  handleLogin={data => this.handleLogin(data)}/>)}
                        {!isLogginActive && (<Register containerRef={ref => (this.current = ref)} handleReg={data => this.handleReg(data)}/>)}
                      </div>
                      <RightSide
                          current={current}
                          currentActive={currentActive}
                          containerRef={ref => (this.rightSide = ref)}
                          onClick={this.changeState.bind(this)}
                        /></div>
                        </div>
                        <div class="column">  
                          <div className="carosal">
                           <About/>
                          </div>
                        </div>                   
                     </div>
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
