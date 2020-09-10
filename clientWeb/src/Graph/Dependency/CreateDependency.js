import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data; 
}

class CreateDependency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Show: true,
      pid: this.props.project.id,
      fid: this.props.source.id,
      sid: this.props.target.id,
      viewId_source: this.props.viewId_source,
      viewId_target: this.props.viewId_target
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    data = await stringifyFormData(data);
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData = JSON.stringify(projectData);
    console.log(projectData)

    const response = await fetch("/dependency/add", {
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
    this.props.clearDependency();
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
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Modal.Title>Create Dependency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                hidden
                type="number"
                name="cd_pid"
                value={this.state.pid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_fid"
                value={this.state.fid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_sid"
                value={this.state.sid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_viewId_source"
                value={this.state.viewId_source === null ? "" : this.state.viewId_source}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_viewId_target"
                value={this.state.viewId_target === null ? "" : this.state.viewId_target}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Relationship Type</Form.Label>
                <Form.Control as="select" name="cd_relationshipType">
                  <option value="ss">Start-Start</option>
                  <option value="fs">Finish-Start</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Dependency Duration</Form.Label>
                <Form.Control required type="number" name="cd_duration" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Button variant="secondary" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Create Dependency
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateDependency;
