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

class CreateProject extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
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
      this.props.setProjectInfo(response);
    })
      .done(() => {
        this.setState({ show: false });
      })
      .fail(() => {
        alert("Unable to create project");
      })
      .always(() => {
        //alert( "finished" );
      });
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="my-2"
          style={{borderColor:"#184D47", backgroundColor:"white"}}
          onClick={this.showModal}
          block
          size="sm"
        >
          <i className="fa fa-plus" style={{fontSize:"30px", color:"#184D47"}}></i>
        </Button>
        <Modal show={this.state.show} onHide={this.hideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header closeButton style={{backgroundColor:"#184D47", color:"white"}}>
              <Modal.Title>Create Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                <thead >
                  <tr>
                    <td className="text-center" colSpan="4" style={{backgroundColor:"#184D47", color:"white"}}>
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
            <Modal.Footer style={{backgroundColor:"#184D47"}}>
              <Button variant="secondary" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Create Project
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateProject;
