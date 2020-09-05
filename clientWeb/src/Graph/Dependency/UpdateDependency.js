import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ms from "ms";

class UpdateDependency extends React.Component {
  constructor(props) {
    super(props);
    let duration;
    if (this.props.dependency.relationshipType === "ss") {
      duration = this.CalcDiff(this.props.dependency.sStartDate, this.props.dependency.endDate);
    } else {
      duration = this.CalcDiff(this.props.dependency.sStartDate, this.props.dependency.endDate);
    }
    this.state = {
      Show: false,
      pid: this.props.project.id,
      dependency: this.props.dependency,
      duration: duration,
    };

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
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = this.state.dependency;
    projectData = JSON.stringify(projectData);
    const response = await fetch("/dependency/update", {
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
    this.setState({ Show: false });
  }
  
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="outline-dark" onClick={this.ShowModal}>
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
                name="cd_pid"
                value={this.state.pid}
                onChange={() => {}}
              />
              <input
                hidden
                type="number"
                name="ud_did"
                value={this.state.dependency.id}
                onChange={() => {}}
              />
              <Form.Group>
                <Form.Label>Relationship Type</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="cd_relationshipType"
                  value={this.state.dependency.relationshipType}
                  style={{
                    width: "250px",
                    borderColor: "#EEBB4D",
                    backgroundColor: "white",
                    fontSize: "20px",
                  }}
                  onChange={(e) => {
                    let dependency = this.state.dependency;
                    dependency.relationshipType = e.target.value;
                    if (dependency.relationshipType === "ss") {
                      dependency.startDate = this.state.dependency.sStartDate;
                      this.setState({ 
                        dependency: dependency,
                        duration: this.CalcDiff(this.state.dependency.sStartDate, this.state.dependency.endDate) 
                      });
                    } else {
                      dependency.startDate = this.state.dependency.eStartDate;
                      this.setState({
                        dependency: dependency,
                        duration: this.CalcDiff(this.state.dependency.sEndDate, this.state.dependency.endDate) 
                      });
                    }
                    this.value = this.state.dependency.relationshipType;
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
                  name="ud_startDate"
                  value={
                    this.state.dependency.relationshipType === "ss" ?
                    this.state.dependency.sStartDate
                  :
                    this.state.dependency.sEndDate
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
                  value={this.state.dependency.endDate}
                  onChange={(e) => {
                    let dependency = this.state.dependency;
                    dependency.endDate = e.target.value;
                    if (this.state.dependency.relationshipType === "ss") {
                      this.setState({ 
                        dependency: dependency, 
                        duration: this.CalcDiff(this.state.dependency.sStartDate, e.target.value) 
                      });
                    } else {
                      this.setState({ 
                        dependency: dependency, 
                        duration: this.CalcDiff(this.state.dependency.sEndDate, e.target.value) 
                      });
                    }
                    this.value = this.state.dependency.endDate;
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

export default UpdateDependency;
