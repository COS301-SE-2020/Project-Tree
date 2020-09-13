import React from "react";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
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
      dependency: JSON.parse(JSON.stringify(this.props.dependency)),
      duration: duration,
      isloading: false,
    };

    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.dependency !== prevProps.dependency) {
      let duration;
      if (this.props.dependency.relationshipType === "ss") {
        duration = this.CalcDiff(this.props.dependency.sStartDate, this.props.dependency.endDate);
      } else {
        duration = this.CalcDiff(this.props.dependency.sStartDate, this.props.dependency.endDate);
      }
      this.setState({
        dependency: JSON.parse(JSON.stringify(this.props.dependency)),
        duration: duration,
      })
    }
  }

  ShowModal() {
    this.setState({ Show: true });
  }

  HideModal() {
    this.setState({ Show: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({isloading: true});
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
    this.setState({ Show: false, isloading: false });
  }
  
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    let endDate = new Date(ed);
    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="outline-dark" style={{width: "100px" }}  onClick={this.ShowModal}>
          <i className="fa fa-edit"> </i> Edit{" "}
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Edit Dependencies</Modal.Title>
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
                      if (dependency.startDate > this.state.dependency.endDate) 
                      dependency.endDate = dependency.startDate;
                      
                      this.setState({ 
                        relationshipType: e.target.value,
                        dependency: dependency,
                        duration: this.CalcDiff(dependency.startDate, dependency.endDate) 
                      });
                    } else {
                      dependency.startDate = this.state.dependency.sEndDate;
                      if (dependency.startDate > this.state.dependency.endDate) 
                      dependency.endDate = dependency.startDate;
                      
                      this.setState({ 
                        relationshipType: e.target.value,
                        dependency: dependency,
                        duration: this.CalcDiff(dependency.startDate, dependency.endDate) 
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
                  {this.state.dependency.relationshipType === "ss" ? 
                    "Start Date of first Task"
                  :
                    "End Date of first Task"
                  }
                </Form.Label>
                <Form.Control
                  required
                  readOnly
                  type="text"
                  name="ud_startDate"
                  value={
                    this.state.dependency.relationshipType === "ss" ?
                    this.state.dependency.sStartDate.replace("T", " ")
                  :
                    this.state.dependency.sEndDate.replace("T", " ")
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
                  value={this.state.dependency.endDate.substring(0,10)}
                  onChange={(e) => {
                    let dependency = this.state.dependency;
                    dependency.endDate = `${e.target.value}T${this.state.dependency.endDate.substring(11,16)}`;
                    if (this.state.dependency.relationshipType === "ss") {
                      if (dependency.endDate < this.state.dependency.sStartDate) {
                        alert("you can not make the second task earlier then the first");
                        dependency.endDate = this.state.dependency.sStartDate;
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sStartDate, this.state.dependency.sStartDate) 
                        });
                      } else {
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sStartDate, dependency.endDate) 
                        });
                      }
                    } else {
                      if (dependency.endDate < this.state.dependency.sEndDate) {
                        alert("you can not make the second task earlier then the first");
                        dependency.endDate = this.state.dependency.sEndDate;
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sEndDate, this.state.dependency.sEndDate) 
                        });
                      } else {
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sEndDate, dependency.endDate) 
                        });
                      }
                    }
                    this.value = this.state.dependency.endDate;
                  }}
                />
                <Form.Label>
                  Start Time of Second Task
                </Form.Label>
                <Form.Control
                  required
                  type="time"
                  value={this.state.dependency.endDate.substring(11,16)}
                  onChange={(e) => {
                    let dependency = this.state.dependency;
                    dependency.endDate = `${this.state.dependency.endDate.substring(0,10)}T${e.target.value}`;
                    if (this.state.dependency.relationshipType === "ss") {
                      if (dependency.endDate < this.state.dependency.sStartDate) {
                        alert("you can not make the second task earlier then the first");
                        dependency.endDate = this.state.dependency.sStartDate;
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sStartDate, this.state.dependency.sStartDate) 
                        });
                      } else {
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sStartDate, dependency.endDate) 
                        });
                      }
                    } else {
                      if (dependency.endDate < this.state.dependency.sEndDate) {
                        alert("you can not make the second task earlier then the first");
                        dependency.endDate = this.state.dependency.sEndDate;
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sEndDate, this.state.dependency.sEndDate) 
                        });
                      } else {
                        this.setState({ 
                          dependency: dependency, 
                          duration: this.CalcDiff(this.state.dependency.sEndDate, dependency.endDate) 
                        });
                      }
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
                : "Save" } 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateDependency;
