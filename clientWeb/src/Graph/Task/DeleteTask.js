import React from "react";
import { Form, Modal, Button, Spinner } from "react-bootstrap";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class DeleteTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Show: false, id: this.props.task.id , isloading: false};
    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  ShowModal() {
    this.setState({ Show: true });
  }

  HideModal() {
    this.setState({ Show: false, isloading: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({isloading: true});
    let data = new FormData(event.target);
    data = await stringifyFormData(data);
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData = JSON.stringify(projectData);

    let response = null;
    if(this.props.viewId !== null) {
      response = await fetch("/task/deleteClone", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: projectData,
      });
    }
    else {
      response = await fetch("/task/delete", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: projectData,
      });
    }

    const body = await response.json();
    await this.props.setTaskInfo(
      body.nodes,
      body.rels,
      body.displayNode,
      body.displayRel
    );

    this.HideModal();
  }

  render() {
    return (
      <React.Fragment>
        <Button
          className="btn-danger"
          style={{width: "170px"}}
          onClick={() => {
            this.ShowModal();
          }}
        >
          <i className="fa fa-trash"></i> Delete{" "}
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Delete Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <input
                  hidden
                  type="number"
                  name="id"
                  value={this.state.id}
                  onChange={() => {}}
                />
                <input
                  hidden
                  type="boolean"
                  name="viewId"
                  value={this.props.viewId !== null ? this.props.viewId : ""}
                  onChange={() => {}}
                />
                <p> Are you sure you want to delete this task?</p>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Button variant="secondary" onClick={this.HideModal}>
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
                : "Delete" } 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default DeleteTask;
