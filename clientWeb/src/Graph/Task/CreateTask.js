import React from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";

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
      people: this.props.allUsers,
      pacManSearchTerm: "",
      resourcesSearchTerm: "",
      resPersonSearchTerm: "",
      pacManList: [],
      resourcesList: [],
      resPersonList: [],
    };
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
  }

  async hideModal() {
    for (let x = 0; x < this.state.pacManList.length; x++) {
      this.state.people.push(this.state.pacManList[x]);
    }
    for (let x = 0; x < this.state.resPersonList.length; x++) {
      this.state.people.push(this.state.resPersonList[x]);
    }
    for (let x = 0; x < this.state.resourcesList.length; x++) {
      this.state.people.push(this.state.resourcesList[x]);
    }

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

    let newTask = body.displayNode;
    let timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 2);
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
      body.displayRel
    );

    this.hideModal();
  }

  render() {
    /*
     * Filters the list of people to only show people matching the search term
     */
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
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
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
              <Form.Group>
                <Form.Label>Package Manager</Form.Label>
                <Row>
                  <Col>
                    <input
                      type="text"
                      value={this.state.pacManSearchTerm}
                      onChange={(e) => this.updateSearch(e, 0)}
                      placeholder="Search for a name"
                    />
                    {this.state.pacManSearchTerm.length >= 2 ? (
                      <ul>
                        {filteredPacMan.map((person) => {
                          return (
                            <li key={person.id}>
                              <button
                                type="button"
                                onClick={() => this.addPacMan(person)}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.pacManList.map((person) => {
                      return (
                        <li key={person.id}>
                          <button
                            type="button"
                            onClick={() => this.removeAssignedPerson(person, 0)}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                        </li>
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
                    />
                    {this.state.resPersonSearchTerm.length >= 2 ? (
                      <ul>
                        {filteredResPerson.map((person) => {
                          return (
                            <li key={person.id}>
                              <button
                                type="button"
                                onClick={() => this.addResPerson(person)}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.resPersonList.map((person) => {
                      return (
                        <li key={person.id}>
                          <button
                            type="button"
                            onClick={() => this.removeAssignedPerson(person, 1)}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                        </li>
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
                    />
                    {this.state.resourcesSearchTerm.length >= 2 ? (
                      <ul>
                        {filteredResources.map((person) => {
                          return (
                            <li key={person.id}>
                              <button
                                type="button"
                                onClick={() => this.addResource(person)}
                              >
                                {person.name}&nbsp;{person.surname}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </Col>
                  <Col>
                    {this.state.resourcesList.map((person) => {
                      return (
                        <li key={person.id}>
                          <button
                            type="button"
                            onClick={() => this.removeAssignedPerson(person, 2)}
                          >
                            {person.name}&nbsp;{person.surname}
                          </button>
                        </li>
                      );
                    })}
                  </Col>
                </Row>
              </Form.Group>
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
            <Modal.Footer
              style={{ backgroundColor: "#184D47", color: "white" }}
            >
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
