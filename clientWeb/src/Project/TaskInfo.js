import React from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import $ from "jquery";
import './Project.css'

class TaskInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = { project: this.props.project, tasks: [] };
    }

    componentDidMount(){
      $.post( "/project/criticalpath", {projId: this.state.project.id} , response => {
        this.setState({tasks: response})
      })
      .fail(() => {
          alert( "Unable to get Critical Path" );
      })
    }
  
    componentDidUpdate(prevProps) {
      if (this.props.project !== prevProps.project) {
        this.setState({ project: this.props.project });
        $.post( "/project/criticalpath", {projId: this.state.project.id} , response => {
          this.setState({tasks: response})
        })
        .fail(() => {
            alert( "Unable to get Critical Path" );
        })
      }
    }

    setTasks(type){
      switch (type) {
        case "Critical Path":
          type = "criticalpath";
          break;
      
        default:
          break;
      }
      $.post( `/project/${type}`, {projId: this.state.project.id} , response => {
        this.setState({tasks: response})
      })
      .fail(() => {
          alert( "Unable to get new Task layout" );
      })
    }

    render(){
      let tasks = [];
      if (this.state.tasks.path !== undefined && this.state.tasks.path !== null) {
      console.log(this.state.tasks.path.segments);
        this.state.tasks.path.segments.forEach((el,index) => {
          
          console.log(index);
          if(index === 0){
            tasks.push(
              <Col
                key={el.start.identity.low}
              >
                <Container style={{border: "1 solid black"}}>
                  <Row>
                    <Col>
                    {el.start.properties.name}
                    </Col>
                  </Row>
                </Container>
              </Col>
            );
          }
          console.log(el);
          tasks.push(
            <Col
              xs={4}
              key={el.end.identity.low}
            >
              <Container>
                <Row>
                  <Col>
                    {el.end.properties.name}
                  </Col>
                </Row>
              </Container>
            </Col>
          );
        });
        console.log(tasks);
      }else{
        tasks.push(
        <Col
          key={0}
        >
          {`cant display ${this.state.taskType} tasks`}
        </Col>)
      }

      return(
          <React.Fragment>
              <Container fluid>
                <Row>
                  <Col xs={12} sm={12} md={3} lg={2} xl={2}>
                    <Form.Label>Select type of tasks to display</Form.Label>
                  </Col>
                  <Col  xs={12} sm={12} md={6} lg={4} xl={3}>
                    <Form.Control
                      as="select"
                      id="taskType"
                      value={this.state.taskType}
                      onChange={(e) => {
                        this.setTasks(e.target.value);
                        this.setState({ taskType: e.target.value });
                        this.value = this.state.taskType;
                      }}
                    >
                      <option value="Critical Path">Crititcal Path</option>
                      <option value="Complete">Complete</option>
                      <option value="Incomplete">Incomplete</option>
                      <option value="Issue">Issue</option>
                      <option value="Late">Late</option>
                    </Form.Control>
                  </Col>
                </Row>
                <Row>
                  <Container className="horizontal-scrollable">
                      <Row>
                        {tasks}
                      </Row>
                  </Container>
                </Row> 
              </Container>
          </React.Fragment>
      )
    }
  }

export default TaskInfo;