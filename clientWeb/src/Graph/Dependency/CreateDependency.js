import React from "react";
import {
  Form,
  Modal,
  Button,
  Spinner,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import ms from "ms";

class CreateDependency extends React.Component {
  constructor(props) {
    super(props);
    let target = JSON.parse(JSON.stringify(this.props.target));
    let duration = this.CalcDiff(
      this.props.source.startDate,
      this.props.target.startDate
    );
    if (this.props.source.startDate > target.startDate) {
      target.startDate = this.props.source.startDate;
      duration = this.CalcDiff(
        this.props.source.startDate,
        this.props.source.startDate
      );
    }

    this.state = {
      Show: true,
      relationshipType: "ss",
      target: target,
      duration: duration,
      isloading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isloading: true });
    let startDate;
    if (this.state.relationshipType === "ss") {
      startDate = this.props.source.startDate;
    } else {
      startDate = this.props.source.endDate;
    }
    let data = {
      fid: this.props.source.id,
      sid: this.props.target.id,
      relationshipType: this.state.relationshipType,
      sStartDate: this.props.source.startDate,
      sEndDate: this.props.source.endDate,
      startDate: startDate,
      endDate: this.state.target.startDate,
      cd_viewId_source: this.props.viewId_source,
      cd_viewId_target: this.props.viewId_target,
    };
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData.project = this.props.project;
    projectData = JSON.stringify(projectData);

    const response = await fetch("/dependency/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: projectData,
    });
    const body = await response.json();
    if (body.message === "After Project End Date") {
      alert(
        "Making these changes will move the project end Date. Please select a date that does not change the project duration"
      );
      this.setState({ isloading: false });
    } else {
      await this.props.setTaskInfo(
        body.nodes,
        body.rels,
        body.displayNode,
        body.displayRel
      );
      this.props.closeModal();
      this.setState({ isloading: false });
      this.props.clearDependency();
    }
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime(
      startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    let endDate = new Date(ed);
    endDate.setTime(
      endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    return ms(endDate.getTime() - startDate.getTime(), { long: true });
  }

  render() {
    if (this.props.source == null || this.props.target == null) {
      this.props.closeModal();
    }

    return (
      <React.Fragment>
        <Modal show={true} onHide={this.props.closeModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Create Dependency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  Relationship type{" "}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Tooltip className="helpTooltip">
                        Start-Start: The second task can start when the first
                        task starts <br></br>
                        Start-Finish: The second task can only start when the
                        first task has finished
                      </Tooltip>
                    }
                  >
                    <i
                      className="fa fa-info-circle"
                      style={{ color: "black", fontSize: "20px" }}
                    ></i>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="cd_relationshipType"
                  value={this.state.relationshipType}
                  style={{
                    width: "250px",
                    borderColor: "#EEBB4D",
                    backgroundColor: "white",
                    fontSize: "20px",
                  }}
                  onChange={(e) => {
                    if (e.target.value === "ss") {
                      let target = this.state.target;
                      if (this.props.source.startDate > target.startDate)
                        target.startDate = this.props.source.startDate;

                      this.setState({
                        relationshipType: e.target.value,
                        duration: this.CalcDiff(
                          this.props.source.startDate,
                          this.state.target.startDate
                        ),
                      });
                    } else {
                      let target = this.state.target;
                      if (this.props.source.endDate > target.startDate)
                        target.startDate = this.props.source.endDate;

                      this.setState({
                        relationshipType: e.target.value,
                        duration: this.CalcDiff(
                          this.props.source.endDate,
                          this.state.target.startDate
                        ),
                      });
                    }
                    this.value = this.state.relationshipType;
                  }}
                >
                  <option value="ss">Start-Start </option>
                  <option value="fs">Finish-Start </option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  {this.state.relationshipType === "ss"
                    ? "Start Date of first Task"
                    : "End Date of first Task"}
                </Form.Label>
                <Form.Control
                  required
                  readOnly
                  type="text"
                  name="cd_startDate"
                  value={
                    this.state.relationshipType === "ss"
                      ? this.props.source.startDate.replace("T", " ")
                      : this.props.source.endDate.replace("T", " ")
                  }
                  onChange={() => {}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date of second task</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={this.state.target.startDate.substring(0, 10)}
                  onChange={(e) => {
                    if (isNaN(Date.parse(e.target.value))) return;
                    let target = this.state.target;
                    target.startDate = `${
                      e.target.value
                    }T${this.state.target.startDate.substring(11, 16)}`;
                    if (this.state.relationshipType === "ss") {
                      if (target.startDate < this.props.source.startDate) {
                        alert(
                          "Please choose a start date that is after the first task"
                        );
                        target.startDate = this.props.source.startDate;
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.startDate,
                            this.props.source.startDate
                          ),
                        });
                        return;
                      } else {
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.startDate,
                            target.startDate
                          ),
                        });
                      }
                    } else {
                      if (target.startDate < this.props.source.endDate) {
                        alert(
                          "Please choose a start date that is after the first task"
                        );
                        target.startDate = this.props.source.endDate;
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.endDate,
                            this.props.source.endDate
                          ),
                        });
                        return;
                      } else {
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.endDate,
                            target.startDate
                          ),
                        });
                      }
                    }
                    this.value = this.state.target.startDate;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start time of second task</Form.Label>
                <Form.Control
                  required
                  type="time"
                  value={this.state.target.startDate.substring(11, 16)}
                  onChange={(e) => {
                    if (
                      !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(e.target.value)
                    )
                      return;
                    let target = this.state.target;
                    target.startDate = `${this.state.target.startDate.substring(
                      0,
                      10
                    )}T${e.target.value}`;
                    if (this.state.relationshipType === "ss") {
                      if (target.startDate < this.props.source.startDate) {
                        alert(
                          "Please choose a start date that is after the first task"
                        );
                        target.startDate = this.props.source.startDate;
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.startDate,
                            this.props.source.startDate
                          ),
                        });
                        return;
                      } else {
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.startDate,
                            target.startDate
                          ),
                        });
                      }
                    } else {
                      if (target.startDate < this.props.source.endDate) {
                        alert(
                          "Please choose a start date that is after the first task"
                        );
                        target.startDate = this.props.source.endDate;
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.endDate,
                            this.props.source.endDate
                          ),
                        });
                        return;
                      } else {
                        this.setState({
                          target: target,
                          duration: this.CalcDiff(
                            this.props.source.endDate,
                            target.startDate
                          ),
                        });
                      }
                    }
                    this.value = this.state.target.startDate;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label> Duration</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="duration"
                  value={this.state.duration}
                  readOnly
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Button variant="secondary" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark"
                style={{ width: "100px" }}
                disabled={this.state.isloading}
              >
                {this.state.isloading ? (
                  <Spinner
                    animation="border"
                    variant="success"
                    size="sm"
                  ></Spinner>
                ) : (
                  "Create"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateDependency;
