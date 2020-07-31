import React from "react";
import { Button, Container, Row} from "react-bootstrap";
import { Redirect } from "react-router-dom";

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: this.props.projects};
    this.handleClick = this.handleClick.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
  }

  handleClick(project){
    this.setState({redirect: project});
  }

  closeSideBar(){
    this.props.closeSideBar();
  }

  render() {
    if (this.state.redirect != null) {
      sessionStorage.setItem("project", JSON.stringify({project: this.state.redirect}));
      this.closeSideBar();
      return(<Redirect to="/project"/>)
    }
    if (this.state.projects === undefined) return null;
    const listItems = [];
    this.state.projects.forEach(project => {
      listItems.push(
        <Button
          key={project.id}
          onClick={() => {this.handleClick(project);}}
          style={{fontFamily:"arial black", backgroundColor: "#EEBB4D", borderColor:"#EEBB4D"}}
          size="sm"
          block
        >
          {project.name}
        </Button>
      );
    });

    return (
      <Container className="py-2">
        <Row> {listItems} </Row>
      </Container>
    );
  }
}

export default SideBar;