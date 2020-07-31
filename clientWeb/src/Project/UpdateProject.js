import React from "react";
import { Form, Table, Modal, Button } from "react-bootstrap";
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
      id: this.props.project.id,
      name: this.props.project.name,
      description: this.props.project.description,
      up_pm_Create: this.props.project.permissions[0] === true,
      up_pm_Delete: this.props.project.permissions[1] === true,
      up_pm_Update: this.props.project.permissions[2] === true,
      up_rp_Create: this.props.project.permissions[3] === true,
      up_rp_Delete: this.props.project.permissions[4] === true,
      up_rp_Update: this.props.project.permissions[5] === true,
      up_r_Create: this.props.project.permissions[6] === true,
      up_r_Delete: this.props.project.permissions[7] === true,
      up_r_Update: this.props.project.permissions[8] === true,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshState = this.refreshState.bind(this);
  }

  refreshState() {
    this.setState({
      id: this.props.project.id,
      name: this.props.project.name,
      description: this.props.project.description,
      up_pm_Create: this.props.project.permissions[0] === true,
      up_pm_Delete: this.props.project.permissions[1] === true,
      up_pm_Update: this.props.project.permissions[2] === true,
      up_rp_Create: this.props.project.permissions[3] === true,
      up_rp_Delete: this.props.project.permissions[4] === true,
      up_rp_Update: this.props.project.permissions[5] === true,
      up_r_Create: this.props.project.permissions[6] === true,
      up_r_Delete: this.props.project.permissions[7] === true,
      up_r_Update: this.props.project.permissions[8] === true,
    });
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = stringifyFormData(new FormData(event.target));
    $.post("/project/update", JSON.parse(data), (response) => {
      this.props.setProjectInfo(response);
    })
      .done(() => {
        this.setState({ show: false });
      })
      .fail(() => {
        alert("Unable to uodate project");
      })
      .always(() => {
        //alert( "finished" );
      });
  }

  render() {
    if (this.state.id !== this.props.project.id) this.refreshState();

    return (
      <React.Fragment>
        <Button className="btn-dark" onClick={this.showModal}>
          <i className="fa fa-edit"> </i> Edit{" "}
        </Button>
        <Modal show={this.state.show} onHide={this.hideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Update Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                hidden
                type="number"
                id="up_id"
                name="up_id"
                value={this.state.id}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Name of project</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="up_name"
                  value={this.state.name}
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                    this.value = this.state.name;
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
                  value={this.state.description}
                  onChange={(e) => {
                    this.setState({ description: e.target.value });
                    this.value = this.state.description;
                  }}
                />
              </Form.Group>
              <Table bordered hover>
                <thead>
                  <tr>
                    <td className="text-center" colSpan="4">
                      Project Permisions
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="text-center">Create</td>
                    <td className="text-center">Delete</td>
                    <td className="text-center">Update</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Package Manager</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Create"
                        checked={this.state.up_pm_Create}
                        onChange={(e) => {
                          this.setState({ up_pm_Create: e.target.checked });
                          this.checked = this.state.up_pm_Create;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Delete"
                        checked={this.state.up_pm_Delete}
                        onChange={(e) => {
                          this.setState({ up_pm_Delete: e.target.checked });
                          this.checked = this.state.up_pm_Delete;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_pm_Update"
                        checked={this.state.up_pm_Update}
                        onChange={(e) => {
                          this.setState({ up_pm_Update: e.target.checked });
                          this.checked = this.state.up_pm_Update;
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
                        checked={this.state.up_rp_Create}
                        onChange={(e) => {
                          this.setState({ up_rp_Create: e.target.checked });
                          this.checked = this.state.up_rp_Create;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_rp_Delete"
                        checked={this.state.up_rp_Delete}
                        onChange={(e) => {
                          this.setState({ up_rp_Delete: e.target.checked });
                          this.checked = this.state.up_rp_Delete;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_rp_Update"
                        checked={this.state.up_rp_Update}
                        onChange={(e) => {
                          this.setState({ up_rp_Update: e.target.checked });
                          this.checked = this.state.up_rp_Update;
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
                        checked={this.state.up_r_Create}
                        onChange={(e) => {
                          this.setState({ up_r_Create: e.target.checked });
                          this.checked = this.state.up_r_Create;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_r_Delete"
                        checked={this.state.up_r_Delete}
                        onChange={(e) => {
                          this.setState({ up_r_Delete: e.target.checked });
                          this.checked = this.state.up_r_Delete;
                        }}
                      />
                    </td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        name="up_r_Update"
                        checked={this.state.up_r_Update}
                        onChange={(e) => {
                          this.setState({ up_r_Update: e.target.checked });
                          this.checked = this.state.up_r_Update;
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <br />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Update Project
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateProject;
