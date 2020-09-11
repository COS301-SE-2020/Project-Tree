import React from "react";
import { Form, Table, Modal, Button, OverlayTrigger,Tooltip } from "react-bootstrap";
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
    this.state = { show: false, token: localStorage.getItem("sessionToken") };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = stringifyFormData(new FormData(event.target));
    $.post("/project/add", JSON.parse(data), (response) => {
      this.setState({ show: false });
      this.props.setProject(response);
    }).fail(() => {
      alert("Unable to create project");
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="my-2"
          style={{ borderColor: "#EEBB4D", backgroundColor: "#EEBB4D", width: "170px", color: "black"}}
          onClick={() => {
            this.showModal();
          }}
        >
          <i
            className="fa fa-plus" 
          ></i>  Create Project{" "}
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
                    <td className="text-center">Create <OverlayTrigger overlay={<Tooltip>Users assigned to the project can create tasks for the project</Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
                    <td className="text-center">Delete <OverlayTrigger overlay={<Tooltip>Users assigned to the project can delete the project and its tasks</Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
                    <td className="text-center">Edit <OverlayTrigger overlay={<Tooltip>Users assigned to the project can edit the project information and its task's information</Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
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
              <Button type="submit" variant="dark">
                Create 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateProject;
