import React from "react";
import { Form, Modal, Button } from "react-bootstrap";
import ms from "ms";

class CreateDependency extends React.Component {
  constructor(props) {
    super(props);
    let target = JSON.parse(JSON.stringify(this.props.target));
    let duration = this.CalcDiff(this.props.source.startDate, this.props.target.startDate);
    if (this.props.source.startDate > target.startDate){
      target.startDate = this.props.source.startDate;
      duration = this.CalcDiff(this.props.source.startDate, this.props.source.startDate)
    }
    
    this.state = {
      Show: true,
      relationshipType: "ss",
      target: target,
      duration: duration,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();

    let startDate;
    if (this.state.relationshipType === "ss") {
      startDate = this.props.source.startDate;
    } else {
      startDate = this.props.source.endDate
    }
    let data = {
      fid: this.props.source.id,
      sid: this.props.target.id,
      projId: this.props.project.id,
      relationshipType: this.state.relationshipType,
      sStartDate: this.props.source.startDate,
      sEndDate: this.props.source.endDate,
      startDate: startDate,
      endDate: this.state.target.startDate,
      cd_viewId_source: this.props.viewId_source,
      cd_viewId_target: this.props.viewId_target
    }
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
    this.props.closeModal();
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
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Create Dependency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                      let target = this.state.target;
                      if (this.props.source.startDate > target.startDate) 
                        target.startDate = this.props.source.startDate;
                      
                      this.setState({ 
                        relationshipType: e.target.value,
                        duration: this.CalcDiff(this.props.source.startDate, this.state.target.startDate) 
                      });
                    } else {
                      let target = this.state.target;
                      if (this.props.source.endDate > target.startDate) 
                        target.startDate = this.props.source.endDate;
                      
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
                  type="text"
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
                  type="date"
                  value={this.state.target.startDate.substring(0,10)}
                  onChange={(e) => {
                    let target = this.state.target;
                    target.startDate = `${e.target.value}T${this.state.target.startDate.substring(11,16)}`;
                    if (this.state.relationshipType === "ss") {
                      if (target.startDate < this.props.source.startDate) {
                        alert("you can not make the second task earlier then the first");
                        target.startDate = this.props.source.startDate;
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.startDate, this.props.source.startDate) 
                        });
                        return;
                      } else {
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.startDate, target.startDate) 
                        });
                      }
                    } else {
                      if (target.startDate < this.props.source.endDate) {
                        alert("you can not make the second task earlier then the first");
                        target.endDate = this.props.source.endDate;
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.endDate, this.props.source.endDate) 
                        });
                        return;
                      } else {
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.endDate, target.startDate) 
                        });
                      }
                    }
                    this.value = this.state.target.startDate;
                  }}
                />
                <Form.Label>
                  Start Time of Second Task
                </Form.Label>
                <Form.Control
                  required
                  type="time"
                  value={this.state.target.startDate.substring(11,16)}
                  onChange={(e) => {
                    let target = this.state.target;
                    target.startDate = `${this.state.target.startDate.substring(0,10)}T${e.target.value}`;
                    if (this.state.relationshipType === "ss") {
                      if (target.startDate < this.props.source.startDate) {
                        alert("you can not make the second task earlier then the first");
                        target.startDate = this.props.source.startDate;
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.startDate, this.props.source.startDate) 
                        });
                        return;
                      } else {
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.startDate, target.startDate) 
                        });
                      }
                    } else {
                      if (target.startDate < this.props.source.endDate) {
                        alert("you can not make the second task earlier then the first");
                        target.endDate = this.props.source.endDate;
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.endDate, this.props.source.endDate) 
                        });
                        return;
                      } else {
                        this.setState({ 
                          target: target, 
                          duration: this.CalcDiff(this.props.source.endDate, target.startDate) 
                        });
                      }
                    }
                    this.value = this.state.target.startDate;
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
               style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Button variant="secondary" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Create 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateDependency;
