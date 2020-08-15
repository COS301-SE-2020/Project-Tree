import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import User from "./User/User";
import ProjectPage from "./Project/ProjectPage";
import GraphPage from "./Graph/GraphPage";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
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
      ownedProjects: null,
      otherProjects: null,
      project: null, 
      showSideBar: false,
      loggedInStatus: false,
      user: null,
      isLogginActive: true,
      userPermission: {
        create: false,
        update: false,
        delete: false,
        project: false
      }
    };
    this.setProject = this.setProject.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.setUser = this.setUser.bind(this);

  }

  componentDidMount(){
    let token = localStorage.getItem('sessionToken')
    if(token != null){
      $.post("/project/get", {token}, (response) => {
        this.setState({ownedProjects: response.ownedProjects, otherProjects: response.otherProjects });
      })
      .fail((response) => {
          throw Error(response.message);
      });

      $.post("/user/get", {token}, (response) => {
        this.setState({user: response.user});
      })
      .fail((response) => {
          throw Error(response.message);
      });

      this.setState({loggedInStatus: true });
    }else{
      if(this.rightSide) this.rightSide.classList.add("right");
      //<Redirect to="/"/>
    }
  }
  
  setProject(proj){
    if(proj.delete != null){
      let ownedProjects = [];
      for (let i = 0; i < this.state.ownedProjects.length; i++) {
        if(this.state.ownedProjects[i].id !== proj.delete) ownedProjects.push(this.state.ownedProjects[i]);
      }
      this.setState({ownedProjects: ownedProjects})
      this.setState({
        project: null, 
        userPermission: {
          create: false,
          update: false,
          delete: false,
          project: false
        }
      });
    }else{
      if(!this.state.ownedProjects.includes(proj) && !this.state.otherProjects.includes(proj)){
        let ownedProjects = this.state.ownedProjects;
        ownedProjects.push(proj);
        this.setState({ownedProjects: ownedProjects});
      }
      let data = {};
      data.token = localStorage.getItem('sessionToken');
      data.project = proj;
      $.post("/user/checkpermission", {data:JSON.stringify(data)}, response => {
        console.log(response);
        this.setState({
          project: proj,
          userPermission: {
            create: response.create,
            update: response.update,
            delete: response.delete,
            project: response.project
          }})
      })
      .fail((response) => {
          console.log(response.error);
      });
    }
  }

  setUser(usr){
    this.setState({user: usr})
  }

  toggleSideBar(){
    if(!this.state.loggedInStatus)
    {
      return;
    }
    if(this.state.ownedProjects != null && this.state.otherProjects != null) this.setState({showSideBar: !this.state.showSideBar});
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
    localStorage.clear();   
    this._isMounted = false;
    localStorage.clear();
    this.setState({
      loggedInStatus: false,
      user: {}
    });
    if(!this.rightSide)
        this.rightSide.classList.add("right");
    window.location.reload(false);
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "  Register" : "Login";
    const currentActive = isLogginActive ? "Login" : "  Register";
    return (
      <React.Fragment>
        <BrowserRouter>
          <Navbar sticky="top" bg="#96BB7C" style={{fontFamily:"Courier New", backgroundColor: "#96BB7C", maxHeight: "10%"}}>
            <Nav className="form-inline ">
              {this.state.loggedInStatus === true ?
                this.state.showSideBar === false ?
                  (
                    <Nav.Link href="#" onClick={() => this.toggleSideBar()}>
                      <i className="fa fa-navicon text-dark" style={{fontSize:"30px"}}></i>
                    </Nav.Link>
                  )
                  :
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
                <img src={logo} alt="Logo" style={{width:"110px"}}/>
              </Nav.Link>
            </Nav>
            <Nav className="form-inline">
              {this.state.loggedInStatus === true ?
                <Settings user={this.state.user}/>
                :
                null
              }
            </Nav>
          </Navbar>
          <Container fluid style={{height: "100%"}}>
            <Row style={{height: "100%"}}>
              {this.state.showSideBar !== false ? 
              (
                <Col  xs={12} sm={12} md={6} lg={4} xl={3} className="border-right border-dark" style={{flex: "1 1 auto", backgroundColor: "#303030" }}>
                  <SideBar closeSideBar={() => this.closeSideBar()} ownedProjects={this.state.ownedProjects} otherProjects={this.state.otherProjects} setProject={project => this.setProject(project)}/>
                </Col>
              ) : null}
              <Col>  
                <Switch>
                  <Route path="/project" component={ProjectPage}>
                    {this.state.project != null ? (
                      <ProjectPage 
                        project={this.state.project} 
                        setProject={project => this.setProject(project)}
                        userPermission={this.state.userPermission}
                        user={this.state.user}
                      />
                    ) : <Redirect to="/"/>}
                  </Route>
                  <Route path="/graph" >
                    {this.state.project != null ? 
                      <GraphPage
                        project={this.state.project}
                        userPermission={this.state.userPermission}
                        user={this.state.user}
                      />
                     : <Redirect to="/"/>}
                  </Route>
                  <Route path="/user">
                    <User />
                  </Route>
                  <Route path="/home">
                    {this.state.loggedInStatus? 
                    <Home ownedProjects={this.state.ownedProjects} otherProjects={this.state.otherProjects} setProject={project => this.setProject(project)}/>
                     : <Redirect to="/"/>}
                  </Route>
                  <Route path="/">
                    {this.state.loggedInStatus? (<Redirect to="/home"/>) : ((<Redirect to="/" handleLogin={data => this.handleLogin(data)}/>))}
                    <div className="row">
                      <div className="column" style={{backgroundColor: "white"}}>
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
                            />
                        </div>
                      </div>
                      <div className="column">
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
