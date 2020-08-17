import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

class UpdateProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Show: false,
      id: this.props.task.id,
      progress: this.props.task.progress,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setProgress = this.setProgress.bind(this);
  }

  showModal() {
    this.setState({ Show: true });
  }

  hideModal() {
    this.setState({ Show: false });
  }

  setProgress(prog) {
    this.setState({ progress: prog });
  }

  refreshState() {
    this.setState({
      id: this.props.task.id,
      progress: this.props.task.progress,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = {
      id: this.state.id,
      progress: this.state.progress,
    };

    await fetch("/task/progress", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    this.props.toggleSidebar(null, null);
    this.props.setTaskInfo();
    //this.setState({ Show:false })
  }

  render() {
    if (this.state.id !== this.props.task.id) this.refreshState();

    return (
      <React.Fragment>
        <Button variant="outline-dark" onClick={this.showModal}>
          <i className="fa fa-edit"> Update Progress</i>
        </Button>
        <Modal show={this.state.Show} onHide={this.hideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Modal.Title>Update Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Button
                className="m-2"
                variant="secondary"
                onClick={() => this.setProgress("Complete")}
              >
                Complete
              </Button>
              <Button
                className="m-2"
                variant="secondary"
                onClick={() => this.setProgress("Issue")}
              >
                Issue
              </Button>
              <Button
                className="m-2"
                variant="secondary"
                onClick={() => this.setProgress("Incomplete")}
              >
                Incomplete
              </Button>
              <br />
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
              <Button variant="secondary" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Update Task
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateProgress;
