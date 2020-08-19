import React, { Component, Modal, Form, Button } from "react";

class User extends Component {
  render() {
    return (
      <React.Fragment>
        <Button className="btn-light" onClick={this.ShowModal}>
          <i className="fa fa-edit"> </i> Edit{" "}
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Modal.Title>Update Dependencies</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                hidden
                type="number"
                name="ud_pid"
                value={this.state.pid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="ud_did"
                value={this.state.did}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Relationship Type</Form.Label>
                <Form.Control
                  as="select"
                  name="ud_relationshipType"
                  value={this.state.relation}
                  onChange={(e) => {
                    this.setState({ relation: e.target.value });
                    this.value = this.state.relation;
                  }}
                >
                  <option value="ss">Start-Start</option>
                  <option value="fs">Finish-Start</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Duration:</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="ud_duration"
                  value={this.state.duration}
                  onChange={(e) => {
                    this.setState({ duration: e.target.value });
                    this.value = this.state.duration;
                  }}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Button variant="secondary" onClick={this.HideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Update Dependency
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default User;
