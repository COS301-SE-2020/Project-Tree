import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ms from "ms";

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
      relationshipType: "ss",
      target: this.props.target,
      duration: this.CalcDiff(this.props.source.startDate, this.props.target.startDate),
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
  
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
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
                value={this.props.pid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_fid"
                value={this.props.source.id}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="cd_sid"
                value={this.props.target.id}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Relationship Type</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="cd_relationshipType"
                  value={this.state.relationshipType}
                  style={{
                    width: "250px",
                    borderColor: "#EEBB4D",
                    backgroundColor: "white",
                    fontSize: "20px",
                  }}
                  onChange={(e) => {
                    if (e.target.value === "ss") {
                      this.setState({ 
                        relationshipType: e.target.value,
                        duration: this.CalcDiff(this.props.source.startDate, this.state.target.startDate) 
                      });
                    } else {
                      this.setState({ 
                        relationshipType: e.target.value,
                        duration: this.CalcDiff(this.props.source.endDate, this.state.target.startDate) 
                      });
                    }
                    this.value = this.state.relationshipType;
                  }}
                >
                  <option value="ss">Start-Start</option>
                  <option value="fs">Finish-Start</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  {this.state.relationshipType === "ss" ? 
                    "Start Date of first Task"
                  :
                    "End Date of first Task"
                  }
                </Form.Label>
                <Form.Control
                  required
                  readOnly
                  type="datetime-local"
                  name="cd_startDate"
                  value={
                    this.state.relationshipType === "ss" ?
                    this.props.source.startDate
                  :
                    this.props.source.endDate
                  }
                  onChange={() => {}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Start Date of Second Task
                </Form.Label>
                <Form.Control
                  required
                  type="datetime-local"
                  name="cd_endDate"
                  value={this.state.target.startDate}
                  onChange={(e) => {
                    let target = this.state.target;
                    target.startDate = e.target.value;
                    if (this.state.relationshipType === "ss") {
                      this.setState({ 
                        target: target, 
                        duration: this.CalcDiff(this.props.source.startDate, e.target.value) 
                      });
                    } else {
                      this.setState({ 
                        target: target, 
                        duration: this.CalcDiff(this.props.source.endDate, e.target.value) 
                      });
                    }
                    this.value = this.state.target.value;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label> Duration</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="duration"
                  value={this.state.duration}
                  readOnly
                />
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
