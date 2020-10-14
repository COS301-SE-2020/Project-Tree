import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import ProjectPage from "./Project/ProjectPage";
import GraphPage from "./Graph/GraphPage";
import { Container, Row, Col, Navbar, Nav, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import $ from "jquery";
import logo from "./Images/Logo.png";
import { Login, Register } from "./User/index";
import Settings from "./User/Settings";

function RightSide(props) {
  window.onload = () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  };

  return (
    <div className="wing" ref={props.containerRef} onClick={props.onClick}>
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownedProjects: null,
      otherProjects: null,
      project: null,
      showSideBar: false,
      loggedInStatus: false,
      user: {},
      isLogginActive: true,
      userPermission: {
        create: false,
        update: false,
        delete: false,
        project: false,
      },
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.setProject = this.setProject.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    let token = localStorage.getItem("sessionToken");
    if (token != null) {
      $.post("/project/get", { token }, (response) => {
        let ownedProjects = [];

        response.ownedProjects.forEach(async (project, i) => {
          ownedProjects[i] = {};
          ownedProjects[i].projectInfo = project;
          ownedProjects[i].criticalPath = {};
          ownedProjects[i].tasks = [];
          ownedProjects[i].rels = [];
        });
        let otherProjects = [];
        response.otherProjects.forEach((project, i) => {
          otherProjects[i] = {};
          otherProjects[i].projectInfo = project;
          otherProjects[i].criticalPath = {};
          otherProjects[i].tasks = [];
          otherProjects[i].rels = [];
        });
        this.setState({
          ownedProjects: ownedProjects,
          otherProjects: otherProjects,
        });

        this.state.ownedProjects.forEach((project, i) => {
          $.post("/getProject", { id: project.projectInfo.id }, (response) => {
            let ownedProjects = this.state.ownedProjects;
            ownedProjects[i].tasks = response.tasks;
            ownedProjects[i].rels = response.rels;
            this.setState({ ownedProjects: ownedProjects });
          }).fail((err) => {
            throw Error(err);
          });
          $.post(
            "/project/criticalpath",
            { projId: project.projectInfo.id },
            (response) => {
              let ownedProjects = this.state.ownedProjects;
              ownedProjects[i].criticalPath = response;
              this.setState({ ownedProjects: ownedProjects });
            }
          ).fail(() => {
            alert("Unable to get Critical Path");
          });
        });

        this.state.otherProjects.forEach((project, i) => {
          $.post("/getProject", { id: project.projectInfo.id }, (response) => {
            let otherProjects = this.state.otherProjects;
            otherProjects[i].tasks = response.tasks;
            otherProjects[i].rels = response.rels;
            this.setState({ otherProjects: otherProjects });
          }).fail((err) => {
            throw Error(err);
          });
          $.post(
            "/project/criticalpath",
            { projId: project.projectInfo.id },
            (response) => {
              let otherProjects = this.state.otherProjects;
              otherProjects[i].criticalPath = response;
              this.setState({ otherProjects: otherProjects });
            }
          ).fail((err) => {
            console.log(err);
            alert("Unable to get Critical Path");
          });
        });
      }).fail((response) => {
        localStorage.removeItem("sessionToken");
        window.location.reload(false);
      });

      $.post("/user/get", { token }, (response) => {
        this.setState({ user: response.user });
      }).fail((response) => {
        localStorage.removeItem("sessionToken");
        window.location.reload(false);
      });

      this.setState({ loggedInStatus: true });
    } else {
      if (this.rightSide) this.rightSide.classList.add("right");
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight - 87 + "px" });
  }

  setProject(proj) {
    this.setState({
      userPermission: {
        create: false,
        update: false,
        delete: false,
        project: false,
      },
    });
    if (proj.delete != null) {
      let ownedProjects = [];
      for (let i = 0; i < this.state.ownedProjects.length; i++) {
        if (this.state.ownedProjects[i].projectInfo.id !== proj.delete)
          ownedProjects.push(this.state.ownedProjects[i]);
      }
      this.setState({
        ownedProjects: ownedProjects,
        project: null,
        userPermission: {
          create: false,
          update: false,
          delete: false,
          project: false,
        },
      });
    } else {
      let owned = false;
      this.state.ownedProjects.forEach((project) => {
        if (project.projectInfo.id === proj.id) owned = true;
      });
      let other = false;
      this.state.otherProjects.forEach((project) => {
        if (project.projectInfo.id === proj.id) other = true;
      });
      if (!owned && !other) {
        let ownedProjects = this.state.ownedProjects;
        let project = {};
        project.projectInfo = proj;
        project.criticalPath = {};
        project.tasks = [];
        project.rels = [];
        ownedProjects.push(project);
        this.setState({ ownedProjects: ownedProjects });
      }

      let project = {};
      this.state.ownedProjects.forEach((p) => {
        if (p.projectInfo.id === proj.id) {
          p.projectInfo = proj;
          project = p;
        }
      });
      this.state.otherProjects.forEach((p) => {
        if (p.projectInfo.id === proj.id) {
          p.projectInfo = proj;
          project = p;
        }
      });
      this.setState({ project: project });
      let data = {};
      data.token = localStorage.getItem("sessionToken");
      data.project = proj;
      $.post(
        "/user/checkpermission",
        { data: JSON.stringify(data) },
        (response) => {
          this.setState({
            userPermission: {
              create: response.create,
              update: response.update,
              delete: response.delete,
              project: response.project,
            },
          });
        }
      ).fail((response) => {
        console.log(response.message);
      });
    }
  }

  setUser(usr) {
    this.setState({ user: usr });
  }

  toggleSideBar() {
    if (this.state.ownedProjects != null && this.state.otherProjects != null)
      this.setState({ showSideBar: !this.state.showSideBar });
    else this.setState({ showSideBar: this.state.showSideBar });
  }

  closeSideBar() {
    this.setState({ showSideBar: false });
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
    this.setState((prevState) => ({
      isLogginActive: !prevState.isLogginActive,
    }));
  }

  handleReg(data) {
    this.setState({
      loggedInStatus: data.status,
      user: data.id,
    });
    window.location.reload(false);
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: data.status,
      user: data.id,
    });
    window.location.reload(false);
  }

  handleLogout() {
    localStorage.clear();
    this._isMounted = false;
    this.setState({
      loggedInStatus: false,
      user: {},
    });
    if (this.rightSide) this.rightSide.classList.add("right");
    window.location.reload(false);
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "Login" : "Register";
    return (
      <React.Fragment>
        <BrowserRouter>
          <Navbar
            bg="#96BB7C"
            style={{
              fontFamily: "Courier New",
              backgroundColor: "#96BB7C",
              position: "fixed",
              height: "87px",
              width: "100%",
              zIndex: "9",
            }}
          >
            <Nav className="form-inline ">
              {this.state.loggedInStatus === true ? (
                this.state.showSideBar === false ? (
                  <Nav.Link href="#" onClick={() => this.toggleSideBar()}>
                    <i
                      className="fa fa-navicon text-dark"
                      style={{ fontSize: "30px" }}
                    ></i>
                  </Nav.Link>
                ) : (
                  <Nav.Link href="#" onClick={() => this.toggleSideBar()}>
                    <i
                      className="fa fa-navicon text-dark"
                      style={{ fontSize: "30px", transform: "rotate(90deg)" }}
                    ></i>
                  </Nav.Link>
                )
              ) : null}
            </Nav>
            <Nav className="m-auto form-inline">
              <Nav.Link href="/">
                <img src={logo} alt="Logo" style={{ width: "110px" }} />
              </Nav.Link>
            </Nav>
            <Nav className="form-inline">
              {this.state.loggedInStatus === true ? (
                <Settings user={this.state.user} />
              ) : null}
            </Nav>
          </Navbar>
          <Container fluid style={{ paddingTop: "87px", height: "100%" }}>
            <Row style={{}}>
              {this.state.showSideBar !== false ? (
                <Col
                  sm={12}
                  md={7}
                  lg={5}
                  xl={5}
                  className="border-right border-dark"
                  style={{
                    height: this.state.height,
                    backgroundColor: "#303030",
                    position: "fixed",
                    zIndex: "9",
                  }}
                >
                  <SideBar
                    closeSideBar={() => this.closeSideBar()}
                    ownedProjects={this.state.ownedProjects}
                    otherProjects={this.state.otherProjects}
                    setProject={(project) => this.setProject(project)}
                    user={this.state.user}
                  />
                </Col>
              ) : null}
              <Col style={{ height: this.state.height, overflowY: "auto" }}>
                <Switch>
                  <Route path="/home">
                    {this.state.loggedInStatus ? (
                      <Home
                        showSideBar={this.state.showSideBar}
                        toggleSideBar={() => this.toggleSideBar()}
                        closeSideBar={() => this.closeSideBar()}
                        ownedProjects={this.state.ownedProjects}
                        otherProjects={this.state.otherProjects}
                        setProject={(project) => this.setProject(project)}
                        user={this.state.user}
                      />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>
                  <Route path="/project">
                    {this.state.project != null ? (
                      <ProjectPage
                        project={this.state.project}
                        setProject={(project) => this.setProject(project)}
                        userPermission={this.state.userPermission}
                        user={this.state.user}
                      />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>
                  <Route path="/graph">
                    {this.state.project != null ? (
                      <GraphPage
                        height={this.state.height}
                        project={this.state.project.projectInfo}
                        userPermission={this.state.userPermission}
                        user={this.state.user}
                      />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>
                  <Route path="/">
                    {this.state.loggedInStatus ? (
                      this.state.ownedProjects === null &&
                      this.state.otherProjects === null ? (
                        <Row>
                          <Col></Col>
                          <Col className="d-flex justify-content-center">
                            <Spinner
                              className="my-3"
                              animation="border"
                              variant="success"
                            ></Spinner>
                          </Col>
                          <Col></Col>
                        </Row>
                      ) : (
                        <Redirect to="/home" />
                      )
                    ) : (
                      <div class="screenC">
                        <div className="login">
                          <div
                            className="container"
                            ref={(ref) => (this.container = ref)}
                          >
                            {isLogginActive && (
                              <Login
                                containerRef={(ref) => (this.current = ref)}
                                handleLogin={(data) => this.handleLogin(data)}
                              />
                            )}
                            {!isLogginActive && (
                              <Register
                                containerRef={(ref) => (this.current = ref)}
                                handleReg={(data) => this.handleReg(data)}
                              />
                            )}
                          </div>
                          <RightSide
                            current={current}
                            currentActive={currentActive}
                            containerRef={(ref) => (this.rightSide = ref)}
                            onClick={this.changeState.bind(this)}
                          />
                        </div>
                      </div>
                    )}
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
