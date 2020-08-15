import React from "react";
import { Redirect } from "react-router-dom";
import CreateProject from "../Project/CreateProject";

class Home extends React.Component {
  render() {
    if(this.props.projects !== undefined && this.props.projects !== null){
      if(this.props.projects.length !== 0){
        this.props.setProject(this.props.projects[0]);
        return (
          <Redirect to="/project"/>
        )
      }
    }
    return (
      <CreateProject setProject={project => {this.props.setProject(project)}} closeSideBar={() => {this.props.closeSideBar()}}/>
    );
  }
}

export default Home;