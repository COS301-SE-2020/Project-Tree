import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import $ from "jquery";

class DeleteProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
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
    let data = {};
    data.project = this.props.project;
    data.token = localStorage.getItem("sessionToken");
    $.post("/project/delete", { data: JSON.stringify(data) }, (response) => {
      this.props.setProject(response);
    }).fail(() => {
      alert("Unable to delete project");
    });

    this.hideModal();
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-danger"
          size="lg"
          onClick={() => {
            this.showModal();
          }}
        >
          <i className="fa fa-trash"></i>
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
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Modal.Title>Delete Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <p>Are you sure you want to delete this project</p>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  this.hideModal();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Delete Project
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default DeleteProject;
