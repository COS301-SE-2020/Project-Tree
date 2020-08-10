import React from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
//import $ from "jquery";
import './Project.css'

class TaskInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = { project: this.props.project, tasks: this.props.tasks, criticalpath: this.props.criticalpath};
        console.log(this.state.criticalpath);
    }
  
    componentDidUpdate(prevProps) {
      if (this.props.project !== prevProps.project) {
        this.setState({ project: this.props.project });
      }
      if (this.props.tasks !== prevProps.tasks) {
        this.setState({ tasks: this.props.tasks });
      }
      if (this.props.criticalpath !== prevProps.criticalpath) {
        this.setState({ criticalpath: this.props.criticalpath });
      }
    }

    /* createCriticalPath(){
      let list = [];
      if (this.state.criticalpath.path !== undefined && this.state.criticalpath.path !== null) {
      console.log(this.state.criticalpath.path.segments);
        this.state.criticalpath.path.segments.forEach((el,index) => {
          //if(index === 0){
            list.push(
              <svg 
                width="100" 
                height="100"
                key={el.start.identity.low}
              >
                <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
              </svg>
            );
          /*}
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
        console.log(list);
      }else{
        list.push(
        <Col
          key={0}
        >
          {`can not display critical path `}
        </Col>)
      }
      return list;
    } */

    render(){
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
                        {/* this.createCriticalPath() */}
                      </Row>
                  </Container>
                </Row> 
              </Container>
          </React.Fragment>
      )
    }
  }

export default TaskInfo;