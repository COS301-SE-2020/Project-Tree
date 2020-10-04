import React from "react";
import {
  Form,
  Table,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import $ from "jquery";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}

class CreateProject extends React.Component {
  constructor() {
    super();
    let now = new Date();
    now.setTime(now.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    now = now.toISOString().substring(0, 16);
    let project = {};
    project.startDate = now;
    project.endDate = now;
    this.state = {
      show: false,
      token: localStorage.getItem("sessionToken"),
      project: project,
      isloading: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleSubmit(event) {
    this.setState({ isloading: true });
    event.preventDefault();
    let data = stringifyFormData(new FormData(event.target));
    $.post("/project/add", JSON.parse(data), (response) => {
      console.log(response)
      this.setState({ show: false, isloading: false });
      this.props.setProject(response);
    }).fail(() => {
      alert("Unable to create project");
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
    if (endDate < startDate) {
      alert(
        "You cannot make the end date/time before the start date/time."
      );
      project.startDate = value;
      project.endDate = value;
    } else {
      if (type.substring(0,1) === "s") 
        project.startDate = value;
      else
        project.endDate = value;
    }
    this.setState({ project });
    if (type.substring(0,1) === "s") 
      return this.state.project.startDate;
    else
      return this.state.project.endDate;
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="my-2"
          style={{
            borderColor: "#EEBB4D",
            backgroundColor: "#EEBB4D",
            width: "170px",
            color: "black",
          }}
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-plus"></i> Create Project{" "}
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
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Create Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                name="token"
                type="hidden"
                value={this.state.token}
              />
              <Form.Group>
                <Form.Label>Name of project</Form.Label>
                <Form.Control type="text" name="cp_Name" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description of project</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  name="cp_Description"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date of project</Form.Label>
                <Form.Control
                  required
                  name="cp_StartDate"
                  type="date"
                  value={this.state.project.startDate.substring(0, 10)}
                  onChange={(e) => {this.value = this.changeDate(e, "startDate")}}
                />
                <Form.Label>Start Time of task</Form.Label>
                <Form.Control
                  required
                  name="cp_StartTime"
                  type="time"
                  value={this.state.project.startDate.substring(11, 16)}
                  onChange={(e) => {this.value = this.changeDate(e, "startTime")}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>End date of task</Form.Label>
                <Form.Control
                  required
                  name="cp_EndDate"
                  type="date"
                  value={this.state.project.endDate.substring(0, 10)}
                  onChange={(e) => {this.value = this.changeDate(e, "endDate")}}
                />
                <Form.Label>End Time of task</Form.Label>
                <Form.Control
                  required
                  name="cp_EndTime"
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
                      style={{ backgroundColor: "#96BB7C", color: "white" }}
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
                      <input type="checkbox" name="cp_pm_Create" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_pm_Delete" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_pm_Update" />
                    </td>
                  </tr>
                  <tr>
                    <td>Responsible Person</td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_rp_Create" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_rp_Delete" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_rp_Update" />
                    </td>
                  </tr>
                  <tr>
                    <td>Resource</td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_r_Create" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_r_Delete" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" name="cp_r_Update" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  this.hideModal();
                }}
              >
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

export default CreateProject;
