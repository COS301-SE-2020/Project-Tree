import React from "react";
import { Form, Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import "./AssigningPeople.css";
import ms from "ms";

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
    let now = new Date();
    now.setTime( now.getTime() - new Date().getTimezoneOffset()*60*1000 );
    now = now.toISOString().substring(0,16);
    this.state = {
      Show: true,
      name: "",
      description: "",
      startDate: now,
      duration: "0ms",
      endDate: now,
      people: this.props.allUsers,
      pacManSearchTerm: "",
      resourcesSearchTerm: "",
      resPersonSearchTerm: "",
      pacManList: [],
      resourcesList: [],
      resPersonList: [],
      isloading: false, 
    }
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.assignPeople = this.assignPeople.bind(this);
  }

  hideModal() {
    // Resets the people list
    for (let x = 0; x < this.state.pacManList.length; x++) {
      this.state.people.push(this.state.pacManList[x]);
    }
    for (let x = 0; x < this.state.resPersonList.length; x++) {
      this.state.people.push(this.state.resPersonList[x]);
    }
    for (let x = 0; x < this.state.resourcesList.length; x++) {
      this.state.people.push(this.state.resourcesList[x]);
    }

    this.setState({ Show: false, isloading: false  });
    this.props.hideModal();
  }

  updateSearch(event, mode) {
    if (mode === 0) this.setState({ pacManSearchTerm: event.target.value });
    if (mode === 1) this.setState({ resPersonSearchTerm: event.target.value });
    if (mode === 2) this.setState({ resourcesSearchTerm: event.target.value });
  }

  addPacMan(person) {
    let tempPacManList = this.state.pacManList;
    tempPacManList.push(person);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({ pacManList: tempPacManList, pacManSearchTerm: "" });
  }

  addResPerson(person) {
    let tempResPersonList = this.state.resPersonList;
    tempResPersonList.push(person);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({
      resPersonList: tempResPersonList,
      resPersonSearchTerm: "",
    });
  }

  addResource(person) {
    let tempResourceList = this.state.resourcesList;
    tempResourceList.push(person);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({ resourceList: tempResourceList, resourcesSearchTerm: "" });
  }

  removeAssignedPerson(person, mode) {
    let peopleList = this.state.people;
    if (mode === 0) {
      for (let x = 0; x < this.state.pacManList.length; x++) {
        if (person.id === this.state.pacManList[x].id) {
          if (x === 0) this.state.pacManList.shift();
          else if (x === this.state.pacManList.length - 1)
            this.state.pacManList.pop();
          else this.state.pacManList.splice(x, 1);
        }
      }
    }

    if (mode === 1) {
      for (let x = 0; x < this.state.resPersonList.length; x++) {
        if (person.id === this.state.resPersonList[x].id) {
          if (x === 0) this.state.resPersonList.shift();
          else if (x === this.state.resPersonList.length - 1)
            this.state.resPersonList.pop();
          else this.state.resPersonList.splice(x, 1);
        }
      }
    }

    if (mode === 2) {
      for (let x = 0; x < this.state.resourcesList.length; x++) {
        if (person.id === this.state.resourcesList[x].id) {
          if (x === 0) this.state.resourcesList.shift();
          else if (x === this.state.resourcesList.length - 1)
            this.state.resourcesList.pop();
          else this.state.resourcesList.splice(x, 1);
        }
      }
    }
    peopleList.push(person);
    this.setState({ usablePeople: peopleList });
  }

  /*
  * Assigns people to tasks
  */
  assignPeople(newTask){
    let peopleArray = this.props.assignedProjUsers;
    for(let x = 0; x < this.state.pacManList.length; x++){
      let user = this.state.pacManList[x];
      let relationship = {
        start: this.state.pacManList[x].id,
        end: newTask,
        type: "PACKAGE_MANAGER"
      }
      let userRel = [user,relationship];
      peopleArray.push(userRel);
    }

    for(let x = 0; x < this.state.resPersonList.length; x++){
      let user = this.state.resPersonList[x];
      let relationship = {
        start: this.state.resPersonList[x].id,
        end: newTask,
        type: "RESPONSIBLE_PERSON"
      }
      let userRel = [user,relationship];
      peopleArray.push(userRel);
    }

    for(let x = 0; x < this.state.resourcesList.length; x++){
      let user = this.state.resourcesList[x];
      let relationship = {
        start: this.state.resourcesList[x].id,
        end: newTask,
        type: "RESOURCE"
      }
      let userRel = [user,relationship];
      peopleArray.push(userRel);
    }
    return peopleArray;
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({isloading: true});
    let data = {
      project: this.props.project,
      name: this.state.name,
      description: this.state.description,
      startDate: this.state.startDate,
      duration: this.state.duration,
      endDate: this.state.endDate,
    }
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
    let newTask = body.displayNode;

    let assignedPeople = this.assignPeople(newTask);

    let timestamp = new Date();
    timestamp.setTime( timestamp.getTime() - new Date().getTimezoneOffset()*60*1000 );
    timestamp = timestamp.toISOString();

    await fetch("/people/assignPeople", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ct_taskId: newTask,
        ct_pacMans: this.state.pacManList,
        ct_resPersons: this.state.resPersonList,
        ct_resources: this.state.resourcesList,
        auto_notification: {
          timestamp: timestamp,
          projName: this.props.project.name,
          projID: this.props.project.id,
          taskName: data.ct_Name,
          type: "auto",
          mode: 2,
        },
      }),
    });

    await this.props.setTaskInfo(
      body.nodes,
      body.rels,
      body.displayNode,
      body.displayRel,
      assignedPeople
    );

    this.hideModal();
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    let endDate = new Date(ed);
    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    // Filters the list of people to only show people matching the search term
    let filteredPacMan = null;
    let filteredResPerson = null;
    let filteredResources = null;
    if (this.state.people !== null) {
      filteredPacMan = this.state.people.filter((person) => {
        return (
          person.name
            .toLowerCase()
            .indexOf(this.state.pacManSearchTerm.toLowerCase()) !== -1
        );
      });
      filteredResPerson = this.state.people.filter((person) => {
        return (
          person.name
            .toLowerCase()
            .indexOf(this.state.resPersonSearchTerm.toLowerCase()) !== -1
        );
      });
      filteredResources = this.state.people.filter((person) => {
        return (
          person.name
            .toLowerCase()
            .indexOf(this.state.resourcesSearchTerm.toLowerCase()) !== -1
        );
      });
    }

    return (
      <React.Fragment>
        <Modal show={this.state.Show} onHide={this.hideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Name of task</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={this.state.name}
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                    this.value = this.state.name;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description of task</Form.Label>
                <Form.Control
                  as="textarea"
                  value={this.state.description}
                  onChange={(e) => {
                    this.setState({ description: e.target.value });
                    this.value = this.state.description;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date of task</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={this.state.startDate.substring(0,10)}
                  onChange={(e) => {
                    let value = this.state.startDate;
                    value = `${e.target.value}T${this.state.startDate.substring(11,16)}`;
                    let startDate =new Date(value);
                    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    let endDate =new Date(this.state.endDate);
                    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    if (endDate < startDate) {
                      this.setState({ 
                        startDate: value, 
                        endDate: value,
                        duration: this.CalcDiff(value, value),
                      }); 
                    } else {
                      this.setState({ 
                        startDate: value, 
                        duration: this.CalcDiff(value, this.state.endDate) 
                      });
                    }
                    this.value = this.state.startDate;
                  }}
                />
                <Form.Label>Start Time of task</Form.Label>
                <Form.Control
                  required
                  type="time"
                  value={this.state.startDate.substring(11,16)}
                  onChange={(e) => {
                    let value = this.state.startDate;
                    value = `${this.state.startDate.substring(0,10)}T${e.target.value}`;
                    let startDate =new Date(value);
                    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    let endDate =new Date(this.state.endDate);
                    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    if (endDate < startDate) {
                      this.setState({ 
                        startDate: value, 
                        endDate: value,
                        duration: this.CalcDiff(value, value),
                      }); 
                    } else {
                      this.setState({ 
                        startDate: value, 
                        duration: this.CalcDiff(value, this.state.endDate) 
                      });
                    }
                    this.value = this.state.startDate;
                  }}
                />
              </Form.Group>
              <Form.Group>
              <Form.Label>End date of task</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={this.state.endDate.substring(0,10)}
                  onChange={(e) => {
                    let value = this.state.endDate;
                    value = `${e.target.value}T${this.state.endDate.substring(11,16)}`;
                    let startDate =new Date(this.state.startDate);
                    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    let endDate =new Date(value);
                    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    if (endDate < startDate) {
                      this.setState({ 
                        startDate: value, 
                        endDate: value,
                        duration: this.CalcDiff(value, value),
                      }); 
                    } else {
                      this.setState({ 
                        endDate: value, 
                        duration: this.CalcDiff(this.state.startDate, value) 
                      });
                    }
                    this.value = this.state.endDate;
                  }}
                />
                <Form.Label>End Time of task</Form.Label>
                <Form.Control
                  required
                  type="time"
                  value={this.state.endDate.substring(11,16)}
                  onChange={(e) => {
                    let value = this.state.endDate;
                    value = `${this.state.endDate.substring(0,10)}T${e.target.value}`;
                    let startDate =new Date(this.state.startDate);
                    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    let endDate =new Date(value);
                    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
                    if (endDate < startDate) {
                      this.setState({ 
                        startDate: value, 
                        endDate: value,
                        duration: this.CalcDiff(value, value),
                      }); 
                    } else {
                      this.setState({ 
                        endDate: value, 
                        duration: this.CalcDiff(this.state.startDate, value) 
                      });
                    }
                    this.value = this.state.endDate;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="duration"
                  value={this.state.duration}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Package Manager</Form.Label>
                <Row>
                  <Col>
                    <input
                      type="text"
                      value={this.state.pacManSearchTerm}
                      onChange={(e) => this.updateSearch(e, 0)}
                      placeholder="Search for a name"
                      style={{width:'100%'}}
                    />
                    {this.state.pacManSearchTerm.length >= 2 ? (
                        filteredPacMan.map((person) => {
                          return (
                            <React.Fragment>
                              <button
                                type="button"
                                className="selectPersonBtn"
                                onClick={() => this.addPacMan(person)}
                                key={person.id}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                              <br />
                            </React.Fragment>
                          );
                        })
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.pacManList.map((person) => {
                      return (
                        <React.Fragment>
                          <button
                            type="button"
                            className="selectedPersonBtn"
                            onClick={() => this.removeAssignedPerson(person, 0)}
                            key={person.id}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Responsible Person(s)</Form.Label>
                <Row>
                  <Col>
                    <input
                      type="text"
                      value={this.state.resPersonSearchTerm}
                      onChange={(e) => this.updateSearch(e, 1)}
                      placeholder="Search for a name"
                      style={{width:'100%'}}
                    />
                    {this.state.resPersonSearchTerm.length >= 2 ? (
                        filteredResPerson.map((person) => {
                          return (
                            <React.Fragment>
                              <button
                                type="button"
                                className="selectPersonBtn"
                                onClick={() => this.addResPerson(person)}
                                key={person.id}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                              <br />
                            </React.Fragment>
                          );
                        })
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.resPersonList.map((person) => {
                      return (
                        <React.Fragment>
                          <button
                            type="button"
                            className="selectedPersonBtn"
                            onClick={() => this.removeAssignedPerson(person, 1)}
                            key={person.id}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Resource(s)</Form.Label>
                <Row>
                  <Col>
                    <input
                      type="text"
                      value={this.state.resourcesSearchTerm}
                      onChange={(e) => this.updateSearch(e, 2)}
                      placeholder="Search for a name"
                      style={{width:'100%'}}
                    />
                    {this.state.resourcesSearchTerm.length >= 2 ? (
                        filteredResources.map((person) => {
                          return (
                            <React.Fragment>
                              <button
                                type="button"
                                className="selectPersonBtn"
                                onClick={() => this.addResource(person)}
                                key={person.id}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                              <br />
                            </React.Fragment>
                          );
                        })
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.resourcesList.map((person) => {
                      return (
                        <React.Fragment>
                          <button
                            type="button"
                            className="selectedPersonBtn"
                            onClick={() => this.removeAssignedPerson(person, 2)}
                            key={person.id}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </Col>
                </Row>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer
              style={{ backgroundColor: "#96BB7C", color: "white" }}
            >
              <Button variant="secondary" onClick={this.hideModal}>
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
                : "Create" } 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateTask;
