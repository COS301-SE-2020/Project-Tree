import React from "react";
import { Redirect } from "react-router-dom";

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
      <h4>Home</h4>
    );
  }
}

export default Home;