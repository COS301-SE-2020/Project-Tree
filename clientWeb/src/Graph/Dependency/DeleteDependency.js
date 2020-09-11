import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class DeleteDependency extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Show: false };
    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  ShowModal() {
    this.setState({ Show: true });
  }

  HideModal() {
    this.setState({ Show: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    data = await stringifyFormData(data);
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData = JSON.stringify(projectData);

    const response = await fetch("/dependency/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: projectData,
    });
    const body = await response.json();
    await this.props.setTaskInfo(
      body.nodes,
      body.rels,
      body.displayNode,
      body.displayRel
    );
  }

  render() {
    return (
      <React.Fragment>
        <Button className="btn-danger" onClick={this.ShowModal}>
          <i className="fa fa-trash"></i>
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C" }}
            >
              <Modal.Title>Delete Dependency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  Are you sure you want to delete this dependency?
                </Form.Label>
                <input
                  hidden
                  type="number"
                  name="dd_did"
                  value={this.props.dependency.id}
                  onChange={() => {}}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
               style={{ backgroundColor: "#96BB7C" }}
            >
              <Button variant="secondary" onClick={this.HideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Delete Dependency
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default DeleteDependency;
