import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class CreateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Show: true,
      id: this.props.project.id,
      startDate: 0,
      duration: 0,
      endDate: 0,
    };
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDuration = this.setDuration.bind(this);
  }

  async hideModal() {
    this.setState({ Show: false });
    this.props.hideModal();
  }

  setDuration(e) {
    var duration;
    var startDate;
    if (e.target.id === "ct_startDate") {
      startDate = e.target.value;
      duration = this.state.duration;
    } else if (e.target.id === "ct_duration") {
      startDate = this.state.startDate;
      duration = e.target.value;
    }

    var initialDate;
    initialDate = new Date(startDate);
    var endDate = new Date(
      initialDate.getTime() + 1000 * 60 * 60 * 24 * duration
    );
    var dateWithDuration = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
    ];
    var edate = dateWithDuration;
    var formatMonth = edate[1];
    if (edate[1] < 10) {
      formatMonth = "0" + edate[1];
    }
    var formatDay = edate[2];
    if (edate[2] < 10) {
      formatDay = "0" + edate[2];
    }

    var formatDate = edate[0] + "-" + formatMonth + "-" + formatDay;
    return formatDate;
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    data = await stringifyFormData(data);
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData = JSON.stringify(projectData);

    const response = await fetch("/task/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: projectData,
    });

    const body = await response.json();
    this.hideModal();
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
        <Modal show={this.state.Show} onHide={this.hideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header closeButton style={{backgroundColor:"#184D47", color:"white"}}>
              <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Name of task</Form.Label>
                <Form.Control
                  type="text"
                  id="ct_Name"
                  name="ct_Name"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description of task</Form.Label>
                <Form.Control
                  as="textarea"
                  name="ct_description"
                  id="ct_description"
                  min="0"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date of task</Form.Label>
                {/* this.setState({ description: e.target.value });
                                this.value = this.state.description; */}
                <Form.Control
                  type="date"
                  name="ct_startDate"
                  id="ct_startDate"
                  onChange={(e) => {
                    this.setState({ startDate: e.target.value });
                    this.value = this.state.startDate;
                    this.setState({ endDate: this.setDuration(e) });
                  }}
                  value={this.state.startDate}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="number"
                  name="ct_duration"
                  id="ct_duration"
                  onChange={(e) => {
                    this.setState({ duration: e.target.value });
                    this.value = this.state.duration;
                    this.setState({ endDate: this.setDuration(e) });
                  }}
                  value={this.state.duration}
                  min="0"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>End date of task</Form.Label>
                <Form.Control
                  type="date"
                  name="ct_endDate"
                  id="ct_endDate"
                  value={this.state.endDate}
                  readOnly
                  required
                />
              </Form.Group>
              {/* <Form.Group>
                                <Form.Label>Responsible Person </Form.Label>
                                <Form.Control type='number' min='0' name="ct_resPersonId" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Package Manager</Form.Label>
                                <Form.Control type='number' min='0' name="ct_pacManId" required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Resources </Form.Label>
                                <Form.Control type='number' min='0' name="ct_resourceId" required/>
                            </Form.Group> */}
              <Form.Group>
                <input
                  hidden
                  type="number"
                  id="ct_pid"
                  name="ct_pid"
                  value={this.state.id}
                  onChange={() => {}}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:"#184D47", color:"white"}}>
              <Button variant="secondary" onClick={this.hideModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Create Task
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateTask;