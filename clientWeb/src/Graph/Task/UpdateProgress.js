import React from "react";
import { Form, Modal, Button, InputGroup } from "react-bootstrap";
import $ from "jquery";

class UpdateProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Show: false,
      task: this.props.task,
      issue: this.props.task.type === "Issue",
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.task !== prevProps.task) {
      this.setState({ 
        task: this.props.task,
        issue: this.props.task.type === "Issue",
      });
    }
  }

  showModal() {
    this.setState({ Show: true });
  }

  hideModal() {
    this.setState({ Show: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let type = "Incomplete"
    if (this.state.issue === true) type = "Issue";
    if (parseInt(this.state.task.progress) === 100) type = "Complete";

    let data = {
      id: this.state.task.id,
      progress: this.state.task.progress,
      type: type,
    }
    $.post("/task/progress", data, (response) => {
      this.setState({ show: false });
      this.props.toggleSidebar(null, null);
      this.props.setTaskInfo();
    }).fail(() => {
      alert("Unable to update task");
    });
  }

  render() {
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
              <Form.Group>
                <InputGroup>
                  <Form.Label>Progress</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="progress"
                    min={0}
                    max={100}
                    value={this.state.task.progress}
                    onChange={(e) => {
                      if(parseInt(e.target.value) === 100){
                        this.setState({ issue: false });
                      }
                      let task = this.state.task;
                      task.progress = e.target.value;
                      this.setState({ task: task });
                      this.value = this.state.task.progress;
                    }}
                  />
                  <Form.Control 
                    type="range"
                    value={this.state.task.progress}
                    onChange={(e) => {
                      if(parseInt(e.target.value) === 100){
                        this.setState({ issue: false });
                      }
                      let task = this.state.task;
                      task.progress = e.target.value;
                      this.setState({ task: task });
                      this.value = this.state.task.progress;
                    }}
                    />
                </InputGroup>
              </Form.Group>
              
              <Form.Group>
                <Form.Check 
                  type="checkbox" 
                  label="There is an issue with the task" 
                  checked={this.state.issue}
                  onChange={(e) => {
                    if(parseInt(this.state.task.progress) === 100){
                      this.setState({ issue: false });
                      this.checked = false;
                      alert("you cant specify that a complete task has an issue");
                    } else {
                      this.setState({ issue: e.target.checked });
                      this.checked = this.state.issue;
                    }
                  }}
                />
              </Form.Group>
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
