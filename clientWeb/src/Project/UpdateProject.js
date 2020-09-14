import React from "react";
import { Form, Table, Modal, Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
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
    this.state = {
      show: false,
      isloading: false,
      project: this.props.project,
      token: localStorage.getItem("sessionToken"),
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.setState({ project: this.props.project });
    }
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false});
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({isloading: true});
    let data = stringifyFormData(new FormData(event.target));
    $.post("/project/update", JSON.parse(data), (response) => {
      this.setState({ show: false, isloading: false });
      this.props.setProject(response);
    }).fail(() => {
      alert("Unable to update project");
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-warning"
          style={{width: "100px"}}
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
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C" }}
            >
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
                    <td className="text-center">Create <OverlayTrigger overlay={<Tooltip>Users assigned to the project can create tasks and dependencies for the project</Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
                    <td className="text-center">Delete <OverlayTrigger overlay={<Tooltip>Users assigned to the project can delete and it's tasks and dependencies</Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
                    <td className="text-center">Edit <OverlayTrigger overlay={<Tooltip>Users assigned to the project can edit it's task's and dependency information </Tooltip>}><i className="fa fa-info-circle"></i></OverlayTrigger></td>
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
            <Modal.Footer
              style={{ backgroundColor: "#96BB7C" }}
            >
              <Button variant="secondary" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark" style={{width: "100px"}}
              disabled={this.state.isloading}
              >
                {this.state.isloading ? 
                  <Spinner
                    animation="border"
                    variant="success"
                    size="sm"
                  ></Spinner> 
                : "Save" } 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateProject;
