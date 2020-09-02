import React from "react";
import { ProgressBar, Form, Container, Row, Col } from "react-bootstrap";
import "./Project.css";

class TaskInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskType: "CriticalPath",
    };
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
            startDate: el.start.properties.startDate,
            endDate: el.start.properties.endDate,
            duration: el.start.properties.duration.low,
          });
        }
        list.push({
          name: el.end.properties.name,
          description: el.end.properties.description,
          type: el.end.properties.type,
          progress: el.end.properties.progress.low,
          startDate: el.end.properties.startDate,
          endDate: el.end.properties.endDate,
          duration: el.end.properties.duration.low,
        });
      });
    } else {
      list.push("no critical path to Display");
    }
    return list;
  }

  createLateList() {
    let list = [];
    if (this.props.tasks !== []) {
      this.props.tasks.forEach((el) => {
        if (el.type !== "Complete") {
          let today = new Date();
          if (parseInt(today.getFullYear()) <= parseInt(el.endDate.year.low)) {
            if (
              parseInt(today.getFullYear()) === parseInt(el.endDate.year.low)
            ) {
              if (
                parseInt(today.getMonth() + 1) <= parseInt(el.endDate.month.low)
              ) {
                if (
                  parseInt(today.getMonth() + 1) ===
                  parseInt(el.endDate.month.low)
                ) {
                  if (
                    parseInt(today.getDate()) > parseInt(el.endDate.day.low)
                  ) {
                    list.push(el);
                  }
                }
              } else list.push(el);
            }
          } else list.push(el);
        }
      });
    }
    if (list.length === 0) list.push("no late tasks to display");
    return list;
  }

  createTaskList() {
    let list = [`no ${this.state.taskType} tasks to display`];
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
            default:
              if (el.type === "Incomplete") {
                list.push(el);
              }
              if (el.type === "Issue") {
                list.push(el);
              }
              break;
          }
        });
        if (list.length === 0)
          return [`no ${this.state.taskType} tasks to display`];
      }
      if (
        list[0] === "no critical path to Display" ||
        list[0] === "no late tasks to display"
      ) {
        return list[0];
      } else {
        list.forEach((el, i) => {
          let syear = `${el.startDate.year.low}`;
          let smonth = el.startDate.month.low;
          smonth = smonth < 10 ? `0${smonth}` : `${smonth}`;
          let sday = el.startDate.day.low;
          sday = sday < 10 ? `0${sday}` : `${sday}`;
          let eyear = `${el.endDate.year.low}`;
          let emonth = el.endDate.month.low;
          emonth = emonth < 10 ? `0${emonth}` : `${emonth}`;
          let eday = el.endDate.day.low;
          eday = eday < 10 ? `0${eday}` : `${eday}`;

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
              let today = new Date();
              if (
                parseInt(today.getFullYear()) <= parseInt(el.endDate.year.low)
              ) {
                if (
                  parseInt(today.getFullYear()) ===
                  parseInt(el.endDate.year.low)
                ) {
                  if (
                    parseInt(today.getMonth() + 1) <=
                    parseInt(el.endDate.month.low)
                  ) {
                    if (
                      parseInt(today.getMonth() + 1) ===
                      parseInt(el.endDate.month.low)
                    ) {
                      if (
                        parseInt(today.getDate()) > parseInt(el.endDate.day.low)
                      ) {
                        color = "#ff6961";
                      }
                    }
                  } else color = "#ff6961";
                }
              } else color = "#ff6961";
              break;
          }
          let progressColor = "success"
          if (el.progress < 33) progressColor = "danger";
          else if (el.progress < 66) progressColor = "warning";
          list[i] = (
            <Col
              key={i}
              style={{
                fontFamily: "Courier New",
                fontSize: "18px",
                backgroundColor: `${color}`,
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
                <Col className="text-center">{`${syear}-${smonth}-${sday}`}</Col>
                <Col className="text-center">{`${eyear}-${emonth}-${eday}`}</Col>
              </Row>
              <Row>
                <Col className="text-center">Duration: {el.duration}</Col>
              </Row>
              <Row>
                <Col>
                  <ProgressBar
                    variant={progressColor}
                    now={el.progress}
                    label={`${Math.round(el.progress)}% Complete`}
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
