import React, { Component } from "react";
import ProgressDashboard from "./ProgressDashboard";
import '.././App.scss';

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <ProgressDashboard toggleGraphPage={this.props.toggleGraphPage} />
      </React.Fragment>
    );
  }
}

export default Home;
