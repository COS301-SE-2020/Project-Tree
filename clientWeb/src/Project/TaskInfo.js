import React from "react";
import { ProgressBar, Form, Container, Row, Col } from "react-bootstrap";
import "./Project.css";
import ms from "ms";

class TaskInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskType: "CriticalPath",
    };
  }

  datetimeToString(datetime){
    let obj = {
      year: datetime.year.low,
      month: datetime.month.low < 10 ? `0${datetime.month.low}` : datetime.month.low,
      day: datetime.day.low < 10 ? `0${datetime.day.low}` : datetime.day.low,
      hour: datetime.hour.low < 10 ? `0${datetime.hour.low}` : datetime.hour.low,
      min: datetime.minute.low < 10 ? `0${datetime.minute.low}` : datetime.minute.low,
    }
    return `${obj.year}-${obj.month}-${obj.day}T${obj.hour}:${obj.min}`
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  createCriticalPath() {
    let list = [];
    if (
      this.props.criticalPath !== null &&
      this.props.criticalPath.path !== null
    ) {
      this.props.criticalPath.path.segments.forEach((el, index) => {
        if (index === 0) {
          list.push({
            name: el.start.properties.name,
            description: el.start.properties.description,
            type: el.start.properties.type,
            progress: el.start.properties.progress.low,
            startDate: this.datetimeToString(el.start.properties.startDate),
            endDate: this.datetimeToString(el.start.properties.endDate),
            duration: el.start.properties.duration.low,
          });
        }
        list.push({
          name: el.end.properties.name,
          description: el.end.properties.description,
          type: el.end.properties.type,
          progress: el.end.properties.progress.low,
          startDate: this.datetimeToString(el.end.properties.startDate),
          endDate: this.datetimeToString(el.end.properties.endDate),
          duration: el.end.properties.duration.low,
        });
      });
    } else {
      list.push("No Critical Path to display");
    }
    return list;
  }

  createLateList() {
    let list = [];
    if (this.props.tasks !== []) {
      this.props.tasks.forEach((el) => {
        if (el.type !== "Complete") {
          let today = new Date();
          if (today > new Date(el.endDate)) list.push(el);
        }
      });
    }
    if (list.length === 0) list.push("No Late tasks to display");
    return list;
  }

  createTaskList() {
    let list = [`No ${this.state.taskType} tasks to display`];
    if (this.props.tasks.length !== 0 && this.props.criticalPath !== null) {
      if (this.state.taskType === "CriticalPath")
        list = this.createCriticalPath();
      else if (this.state.taskType === "Late") list = this.createLateList();
      else {
        list = [];
        this.props.tasks.forEach((el) => {
          switch (this.state.taskType) {
            case "Complete":
              if (el.type === "Complete") {
                list.push(el);
              }
              break;
            case "Issue":
              if (el.type === "Issue") {
                list.push(el);
              }
              break;
            case "Incomplete":
              if (el.type === "Incomplete") {
                list.push(el);
              }
              if (el.type === "Issue") {
                list.push(el);
              }
              break;
            default:
              list.push(el);
              break;
          }
        });
        if (list.length === 0)
          return [`No ${this.state.taskType} tasks to display`];
      }
      if (
        list[0] === "No Critical Path to Display" ||
        list[0] === "No Late tasks to display"
      ) {
        return list[0];
      } else {
        list.forEach((el, i) => {
          let color;
          switch (el.type) {
            case "Complete":
              color = "#77dd77";
              break;
            case "Issue":
              color = "#ffae42";
              break;
            default:
              color = "#fff";
              if (el.type === "Incomplete") {
                let today = new Date();
                if (today > new Date(el.endDate)) color = "#ff6961";
              } else if (el.type === "Complete") {
                color = "#77dd77";
              } else if (el.type === "Issue") {
                color = "#ffae42";
              }
              break;
          }
          let progressColor = "info"
          list[i] = (
            <Col
              key={i}
              style={{
                fontFamily: "Courier New",
                fontSize: "18px",
                maxWidth: "300px",
                minWidth: "250px",
                fontWeight: "bold",
              }}
              className="rounded border border-dark mr-2 align-items-center"
            >
              <Row>
                <Col className="text-center">
                  {el.name} <hr />
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  {el.description} <hr />
                </Col>
              </Row>
              <Row>
                <Col className="text-center">Start:</Col>
                <Col className="text-center">End:</Col>
              </Row>
              <Row>
                <Col className="text-center">{el.startDate.replace("T", " ")}</Col>
                <Col className="text-center">{el.endDate.replace("T", " ")}</Col>
              </Row>
              <Row>
                <Col className="text-center">Duration: {this.CalcDiff(el.startDate, el.endDate)}</Col>
              </Row>
              <hr/>
              <Row className="mb-2">
                <Col>
                  <ProgressBar
                    striped
                    variant={progressColor}
                    now={el.progress}
                    label={`${Math.round(el.progress)}%`}
                  />
                </Col>
              </Row>
            </Col>
          );
        });
      }
    } else {
      return list[0];
    }

    return list;
  }

  render() {
    return (
      <React.Fragment>
        <Container fluid style={{ fontSize: "20px", wordWrap: "break-word" }}>
          <Row>
            <Form.Control
              as="select"
              id="taskType"
              value={this.state.taskType}
              style={{
                width: "250px",
                borderColor: "#EEBB4D",
                backgroundColor: "white",
                fontSize: "20px",
              }}
              onChange={(e) => {
                this.setState({ taskType: e.target.value });
                this.value = this.state.taskType;
              }}
            >
              <option value="CriticalPath">Critical Path Tasks</option>
              <option value="Incomplete">Incomplete tasks</option>
              <option value="Complete">Complete tasks</option>
              <option value="Issue">Issue Tasks</option>
              <option value="Late">Late Tasks</option>
              <option value="All">All Tasks</option>
            </Form.Control>
          </Row>
          <Row
            className="d-flex flex-nowrap flex-row my-1"
            style={{ overflowX: "auto" }}
          >
            {this.createTaskList()}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default TaskInfo;
