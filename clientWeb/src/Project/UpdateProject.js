import React from "react";
import {
  Form,
  Table,
  Modal,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import $ from "jquery";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

class UpdateProject extends React.Component {
  constructor(props) {
    super(props);

    let firstTask = null;
    let lastTask = null;
    this.props.project.tasks.forEach(task => {
      if ( firstTask === null || firstTask.startDate > task.startDate )
        firstTask = task;
      if ( lastTask === null || lastTask.endDate < task.endDate )
        lastTask = task;
    });

    this.state = {
      show: false,
      isloading: false,
      project: this.props.project.projectInfo,
      firstTask: firstTask,
      lastTask: lastTask,
      token: localStorage.getItem("sessionToken"),
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.project.projectInfo !== prevProps.project.projectInfo) {
      let firstTask = null;
      let lastTask = null;
      this.props.project.tasks.forEach(task => {
        if ( firstTask === null || firstTask.startDate > task.startDate )
          firstTask = task;
        if ( lastTask === null || lastTask.endDate < task.endDate )
          lastTask = task;
      });
      this.setState({ 
        firstTask,
        lastTask,
        project: this.props.project.projectInfo });
    }
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isloading: true });
    let data = stringifyFormData(new FormData(event.target));
    $.post("/project/update", JSON.parse(data), (response) => {
      this.setState({ show: false, isloading: false });
      this.props.setProject(response);
    }).fail(() => {
      alert("Unable to update project");
    });
  }

  changeDate(e, type) {
    if(type.substring(type.length-4, type.length) === "Date") {
      if (isNaN(Date.parse(e.target.value))) return;
    } else if (
        !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(e.target.value)
      ) return;
    let project = this.state.project;
    let value = type.substring(0,1) === "s" ? 
      project.startDate : project.endDate;
    if(type.substring(type.length-4, type.length) === "Date") 
    value = `${e.target.value}T${
        type.substring(0,1) === "s" ? 
          project.startDate.substring(11,16) 
        : 
          project.endDate.substring(11,16)}`;
    else value = `${type.substring(0,1) === "s" ? 
        project.startDate.substring(0,10) 
      : 
        project.endDate.substring(0,10)}T${
        e.target.value
      }`;
    let startDate = type.substring(0,1) === "s" ? 
      value : this.state.project.startDate;
    let endDate = type.substring(0,1) === "s" ? 
      this.state.project.endDate : value;

    if (this.state.firstTask !== null && startDate > this.state.firstTask.startDate){
      alert("The start date of the project cannot be any latter then the current date as it would be after the start of a task, if you want it to be any later then change the task first");
      value = this.state.firstTask.startDate;
    }
    if (this.state.lastTask !== null && endDate < this.state.lastTask.endDate){
      alert("The end date of the project cannot be any earlier then the current date as it would be before a end of a task, if you want it to be any earlier then change the task first");
      value = this.state.lastTask.endDate;
    }
    if (endDate < startDate) {
      alert(
        "You cannot make the end date/time before the start date/time."
      );
      project.startDate = value;
      project.endDate = value;
      this.setState({ project: project });
    } else {
      if (type.substring(0,1) === "s") 
        project.startDate = value;
      else
        project.endDate = value;
      this.setState({ project });
    }
    if (type.substring(0,1) === "s") 
      return this.state.project.startDate;
    else
      return this.state.project.endDate;
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-warning"
          style={{ width: "100px" }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-edit"> </i> Edit{" "}
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.hideModal();
          }}
        >
          <Form
            onSubmit={(event) => {
              this.handleSubmit(event);
            }}
          >
            <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
              <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                name="token"
                type="hidden"
                value={this.state.token}
                onChange={() => {}}
              />
              <Form.Control
                type="hidden"
                name="up_id"
                value={this.state.project.id}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Name of project</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="up_name"
                  value={this.state.project.name}
                  onChange={(e) => {
                    let proj = this.state.project;
                    proj.name = e.target.value;
                    this.setState({ project: proj });
                    this.value = this.state.project.name;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description of project</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  name="up_description"
                  rows="3"
                  value={this.state.project.description}
                  onChange={(e) => {
                    let proj = this.state.project;
                    proj.description = e.target.value;
                    this.setState({ project: proj });
                    this.value = this.state.project.description;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date of project</Form.Label>
                <Form.Control
                  required
                  name="up_StartDate"
                  type="date"
                  value={this.state.project.startDate.substring(0, 10)}
                  onChange={(e) => {this.value = this.changeDate(e, "startDate")}}
                />
                <Form.Label>Start Time of task</Form.Label>
                <Form.Control
                  required
                  name="up_StartTime"
                  type="time"
                  value={this.state.project.startDate.substring(11, 16)}
                  onChange={(e) => {this.value = this.changeDate(e, "startTime")}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>End date of task</Form.Label>
                <Form.Control
                  required
                  name="up_EndDate"
                  type="date"
                  value={this.state.project.endDate.substring(0, 10)}
                  onChange={(e) => {this.value = this.changeDate(e, "endDate")}}
                />
                <Form.Label>End Time of task</Form.Label>
                <Form.Control
                  required
                  name="up_EndTime"
                  type="time"
                  value={this.state.project.endDate.substring(11, 16)}
                  onChange={(e) => {this.value = this.changeDate(e, "endTime")}}
                />
              </Form.Group>
              <Table bordered striped hover>
                <thead>
                  <tr>
                    <td
                      className="text-center"
                      colSpan="4"
                      style={{ backgroundColor: "#96BB7C" }}
                    >
                      Project Permisions
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="text-center">
                      Create{" "}
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            Users assigned to the project can create tasks and
                            dependencies for the project
                          </Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle"></i>
                      </OverlayTrigger>
                    </td>
                    <td className="text-center">
                      Delete{" "}
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            Users assigned to the project can delete and it's
                            tasks and dependencies
                          </Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle"></i>
                      </OverlayTrigger>
                    </td>
                    <td className="text-center">
                      Edit{" "}
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            Users assigned to the project can edit it's task's
                            and dependency information{" "}
                          </Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle"></i>
                      </OverlayTrigger>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Package Manager</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Create"
                        checked={this.state.project.permissions[0]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[0] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[0];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Delete"
                        checked={this.state.project.permissions[1]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[1] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[1];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Update"
                        checked={this.state.project.permissions[2]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[2] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[2];
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Responsible Person</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_rp_Create"
                        checked={this.state.project.permissions[3]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[3] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[3];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_rp_Delete"
                        checked={this.state.project.permissions[4]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[4] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[4];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_rp_Update"
                        checked={this.state.project.permissions[5]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[5] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[5];
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Resource</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_r_Create"
                        checked={this.state.project.permissions[6]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[6] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[6];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_r_Delete"
                        checked={this.state.project.permissions[7]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[7] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[7];
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_r_Update"
                        checked={this.state.project.permissions[8]}
                        onChange={(e) => {
                          let proj = this.state.project;
                          proj.permissions[8] = e.target.checked;
                          this.setState({ project: proj });
                          this.checked = this.state.project.permissions[8];
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <br />
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
              <Button variant="secondary" onClick={this.hideModal}>
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
                  "Save"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateProject;
