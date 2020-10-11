import React from "react";
import {
  Form,
  Modal,
  Button,
  Row,
  Col,
  InputGroup,
  Spinner,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import ms from "ms";

class UpdateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Show: false,
      id: this.props.task.id,
      name: this.props.task.name,
      startDate: this.props.task.startDate,
      duration: this.CalcDiff(
        this.props.task.startDate,
        this.props.task.endDate
      ),
      endDate: this.props.task.endDate,
      description: this.props.task.description,
      progress: this.props.task.progress,
      initialProgress: this.props.task.progress,
      issue: this.props.task.type === "Issue",
      people: this.props.allUsers,
      assignedProjUsers: this.props.assignedProjUsers,
      pacManSearchTerm: "",
      resourcesSearchTerm: "",
      resPersonSearchTerm: "",
      pacManList: [...this.props.pacMans],
      resourcesList: [...this.props.resources],
      resPersonList: [...this.props.resPersons],
      isloading: false,
    };
    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.removeAssignedPeople = this.removeAssignedPeople.bind(this);
    this.removeAssignedPerson = this.removeAssignedPerson.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.task !== prevProps.task) {
      this.setState({
        id: this.props.task.id,
        name: this.props.task.name,
        startDate: this.props.task.startDate,
        duration: this.CalcDiff(
          this.props.task.startDate,
          this.props.task.endDate
        ),
        endDate: this.props.task.endDate,
        description: this.props.task.description,
        progress: this.props.task.progress,
        initialProgress: this.props.task.progress,
        issue: this.props.task.type === "Issue",
        people: this.props.allUsers,
        assignedProjUsers: this.props.assignedProjUsers,
        pacManSearchTerm: "",
        resourcesSearchTerm: "",
        resPersonSearchTerm: "",
        pacManList: [...this.props.pacMans],
        resourcesList: [...this.props.resources],
        resPersonList: [...this.props.resPersons],
      });
    }
  }

  //Removes people from the people list if they are already assigned to a role so that they can't be selected again
  removeAssignedPeople() {
    for (let x = 0; x < this.state.people.length; x++) {
      for (let y = 0; y < this.state.pacManList.length; y++) {
        if (
          this.state.pacManList[y] !== undefined &&
          this.state.people[x] !== undefined
        ) {
          if (this.state.pacManList[y].id === this.state.people[x].id) {
            if (x === 0) this.state.people.shift();
            else if (x === this.state.people.length - 1)
              this.state.people.pop();
            else this.state.people.splice(x, 1);
          }
        }
      }
    }

    for (let x = 0; x < this.state.people.length; x++) {
      for (let y = 0; y < this.state.resPersonList.length; y++) {
        if (
          this.state.resPersonList[y] !== undefined &&
          this.state.people[x] !== undefined
        ) {
          if (this.state.resPersonList[y].id === this.state.people[x].id) {
            if (x === 0) this.state.people.shift();
            else if (x === this.state.people.length - 1)
              this.state.people.pop();
            else this.state.people.splice(x, 1);
          }
        }
      }
    }

    for (let x = 0; x < this.state.people.length; x++) {
      for (let y = 0; y < this.state.resourcesList.length; y++) {
        if (
          this.state.resourcesList[y] !== undefined &&
          this.state.people[x] !== undefined
        ) {
          if (this.state.resourcesList[y].id === this.state.people[x].id) {
            if (x === 0) this.state.people.shift();
            else if (x === this.state.people.length - 1)
              this.state.people.pop();
            else this.state.people.splice(x, 1);
          }
        }
      }
    }
  }

  ShowModal() {
    this.setState({ Show: true, people: this.props.allUsers });
    this.removeAssignedPeople();
  }

  HideModal() {
    let pacManList = [...this.props.pacMans];
    let resourcesList = [...this.props.resources];
    let resPersonList = [...this.props.resPersons];

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

    this.setState({ Show: false, pacManList: pacManList, resourceList: resourcesList, resPersonList: resPersonList });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isloading: true });
    let type = "Incomplete";
    if (this.state.issue === true) type = "Issue";
    if (parseInt(this.state.progress) === 100) type = "Complete";

    let timeComplete = undefined;
    if (
      this.state.initialProgress < 100 &&
      parseInt(this.state.progress) === 100
    ) {
      timeComplete = new Date();
      timeComplete.setTime(
        timeComplete.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      );
      timeComplete = timeComplete.toISOString();
    } else if (
      this.state.initialProgress === 100 &&
      parseInt(this.state.progress) < 100
    ) {
      timeComplete = null;
    }

    let data = {
      id: this.state.id,
      name: this.state.name,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      description: this.state.description,
      progress: this.state.progress,
      type: type,
      timeComplete: timeComplete,
    };
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = data;
    projectData.project = this.props.project;
    projectData = JSON.stringify(projectData);

    const response = await fetch("/task/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: projectData,
    });

    const body = await response.json();
    if ( body.message === "After Project End Date"){
      alert("The changes you tried to make would have moved the project end date, if you want to make the change please move the project end date");
      this.setState({isloading: false}); 
    } else {
      let timestamp = new Date();
      timestamp.setTime(
        timestamp.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      );
      timestamp = timestamp.toISOString();
  
      await fetch("/people/updateAssignedPeople", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ut_taskId: this.state.id,
          ut_pacMans: this.state.pacManList,
          ut_resPersons: this.state.resPersonList,
          ut_resources: this.state.resourcesList,
          ut_originalPacMans: this.props.pacMans,
          ut_originalResPersons: this.props.resPersons,
          ut_originalResources: this.props.resources,
          auto_notification: {
            timestamp: timestamp,
            projName: this.props.project.name,
            projID: this.props.project.id,
            taskName: data.name,
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
        this.state.assignedProjUsers
      );
  
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
  
      this.setState({ Show: false, isloading: false });
    }
  }

  updateSearch(event, mode) {
    if (mode === 0) this.setState({ pacManSearchTerm: event.target.value });
    if (mode === 1) this.setState({ resPersonSearchTerm: event.target.value });
    if (mode === 2) this.setState({ resourcesSearchTerm: event.target.value });
  }

  addPacMan(person) {
    let tempPacManList = this.state.pacManList;
    tempPacManList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = [];
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.state.id,
      type: "PACKAGE_MANAGER",
    });
    tempProjUsersList.push(userTask);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({
      assignedProjUsers: tempProjUsersList,
      pacManList: tempPacManList,
      pacManSearchTerm: "",
    });
  }

  addResPerson(person) {
    let tempResPersonList = this.state.resPersonList;
    tempResPersonList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = [];
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.state.id,
      type: "RESPONSIBLE_PERSON",
    });
    tempProjUsersList.push(userTask);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({
      assignedProjUsers: tempProjUsersList,
      resPersonList: tempResPersonList,
      resPersonSearchTerm: "",
    });
  }

  addResource(person) {
    let tempResourceList = this.state.resourcesList;
    tempResourceList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = [];
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.state.id,
      type: "RESOURCE",
    });
    tempProjUsersList.push(userTask);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for (let x = 0; x < this.state.people.length; x++) {
      if (this.state.people[x].id === person.id) {
        if (x === 0) this.state.people.shift();
        else if (x === this.state.people.length - 1) this.state.people.pop();
        else this.state.people.splice(x, 1);
      }
    }

    this.setState({
      assignedProjUsers: tempProjUsersList,
      resourceList: tempResourceList,
      resourcesSearchTerm: "",
    });
  }

  /*
   * Removes an assigned person from the assigned people arrays
   */
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

    for (let x = 0; x < this.state.assignedProjUsers.length; x++) {
      if (person.id === this.state.assignedProjUsers[x][0].id) {
        if (x === 0) this.state.assignedProjUsers.shift();
        else if (x === this.state.assignedProjUsers.length - 1)
          this.state.assignedProjUsers.pop();
        else this.state.assignedProjUsers.splice(x, 1);
      }
    }

    peopleList.push(person);
    this.setState({ people: peopleList });
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime(
      startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    let endDate = new Date(ed);
    endDate.setTime(
      endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    return ms(endDate.getTime() - startDate.getTime(), { long: true });
  }

  updateStart() {
    let check = true;
    this.props.rels.forEach(el => {
      if (el.target === this.state.id) check = false;
    });
    return check;
  }

  changeDate(e, type) {
    if(type.substring(type.length-4, type.length) === "Date") {
      if (isNaN(Date.parse(e.target.value))) return;
    } else if (
        !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(e.target.value)
      ) return;
    let value = type.substring(0,1) === "s" ? 
    this.state.startDate : this.state.endDate;
    if(type.substring(type.length-4, type.length) === "Date") 
    value = `${e.target.value}T${
        type.substring(0,1) === "s" ? 
          this.state.startDate.substring(11,16) 
        : 
          this.state.endDate.substring(11,16)}`;
    else value = `${type.substring(0,1) === "s" ? 
        this.state.startDate.substring(0,10) 
      : 
        this.state.endDate.substring(0,10)}T${
        e.target.value
      }`;
    if (value < this.props.project.startDate) {
      alert(
        "You cannot make the task before the project date/time."
      );
      value = this.props.project.startDate;
    }
    if (value > this.props.project.endDate) {
      alert(
        "You cannot make the start date/time before the project date/time."
      );
      value = this.props.project.endDate;
    }
    let startDate = type.substring(0,1) === "s" ? 
      value : this.state.startDate;
    let endDate = type.substring(0,1) === "s" ? 
      this.state.endDate : value;
    if (endDate < startDate) {
      alert(
        "You cannot make the end date/time before the start date/time."
      );
      this.setState({ 
        startDate: value,
        endDate: value,
        duration: this.CalcDiff(value, value)
      });
    } else {
      if (type.substring(0,1) === "s") 
        this.setState({ startDate: value, duration: this.CalcDiff(value, this.state.endDate)});
      else
        this.setState({ endDate: value, duration: this.CalcDiff(this.state.startDate, value) });
    }
    if (type.substring(0,1) === "s") 
      return this.state.startDate;
    else
      return this.state.endDate;
  }


  render() {
    /*
     * Filters the list of people to only show people matching the search term
     */
    let filteredPacMan = this.state.people.filter((person) => {
      return (
        person.name
          .toLowerCase()
          .indexOf(this.state.pacManSearchTerm.toLowerCase()) !== -1
      );
    });
    let filteredResPerson = this.state.people.filter((person) => {
      return (
        person.name
          .toLowerCase()
          .indexOf(this.state.resPersonSearchTerm.toLowerCase()) !== -1
      );
    });
    let filteredResources = this.state.people.filter((person) => {
      return (
        person.name
          .toLowerCase()
          .indexOf(this.state.resourcesSearchTerm.toLowerCase()) !== -1
      );
    });

    return (
      <React.Fragment>
        <Button
          variant="outline-dark"
          style={{ width: "170px" }}
          onClick={this.ShowModal}
        >
          <i className="fa fa-edit"> </i> Edit
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          {this.props.updateType === "update" ?
            <Form onSubmit={this.handleSubmit}>
              <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
                <Modal.Title>Edit Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Name of task</Form.Label>
                  <Form.Control
                    required
                    type="text"
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
                    rows="3"
                    value={this.state.description}
                    onChange={(e) => {
                      this.setState({ description: e.target.value });
                      this.value = this.state.description;
                    }}
                  />
                </Form.Group>
                {this.updateStart() ? 
                  <React.Fragment>
                    <Form.Group>
                      <Form.Label>Start date of task</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        value={this.state.startDate.substring(0, 10)}
                        onChange={(e) => {this.value = this.changeDate(e, "startDate")}}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Start time of task</Form.Label>
                      <Form.Control
                        required
                        type="time"
                        value={this.state.startDate.substring(11, 16)}
                        onChange={(e) => {this.value = this.changeDate(e, "startTime")}}
                      />
                    </Form.Group>
                  </React.Fragment>
                :
                  <React.Fragment>
                    <Form.Group>
                      <Form.Label>Start date of task</Form.Label>{" "}
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            This task is dependent on another task, to edit the start date of this task please update either a previous task or dependency.
                          </Tooltip>
                        }
                      >
                        <i className="fa fa-question-circle"></i>
                      </OverlayTrigger>
                      <Form.Control
                        required
                        disabled
                        type="date"
                        value={this.state.startDate.substring(0, 10)}
                        onChange={(e) => {}}
                      />
                    </Form.Group>
                    <Form.Group>  
                      <Form.Label>Start time of task</Form.Label>{" "}
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            This task is dependent on another task, to edit the start time of this task please update either a previous task or dependency.
                          </Tooltip>
                        }
                      >
                        <i className="fa fa-question-circle"></i>
                      </OverlayTrigger>
                      <Form.Control
                        required
                        disabled
                        type="time"
                        value={this.state.startDate.substring(11, 16)}
                        onChange={(e) => {}}
                      />
                    </Form.Group>
                  </React.Fragment>
                }
                <Form.Group>
                  <Form.Label>End date of task</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={this.state.endDate.substring(0, 10)}
                    onChange={(e) => {this.value = this.changeDate(e, "endDate")}}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>End time of task</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    value={this.state.endDate.substring(11, 16)}
                    onChange={(e) => {this.value = this.changeDate(e, "endTime")}}
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
                <Form.Group>
                  <InputGroup>
                    <Form.Label>Progress</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      name="progress"
                      min={0}
                      max={100}
                      value={this.state.progress}
                      onChange={(e) => {
                        if (parseInt(e.target.value) === 100) {
                          this.setState({ issue: false });
                        }
                        this.setState({ progress: e.target.value });
                        this.value = this.state.progress;
                      }}
                    />
                    <Form.Control
                      type="range"
                      value={this.state.progress}
                      onChange={(e) => {
                        if (parseInt(e.target.value) === 100) {
                          this.setState({ issue: false });
                        }
                        this.setState({ progress: e.target.value });
                        this.value = this.state.progress;
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
                      if (parseInt(this.state.progress) === 100) {
                        this.setState({ issue: false });
                        this.checked = false;
                        alert(
                          "You cannot specify that a complete task has an issue."
                        );
                      } else {
                        this.setState({ issue: e.target.checked });
                        this.checked = this.state.issue;
                      }
                    }}
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
                        style={{ width: "100%" }}
                      />
                      {this.state.pacManSearchTerm.length >= 2
                        ? filteredPacMan.map((person) => {
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
                        : null}
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
                        style={{ width: "100%" }}
                      />
                      {this.state.resPersonSearchTerm.length >= 2
                        ? filteredResPerson.map((person) => {
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
                        : null}
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
                        style={{ width: "100%" }}
                      />
                      {this.state.resourcesSearchTerm.length >= 2
                        ? filteredResources.map((person) => {
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
                        : null}
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
                <br />
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
                <Button variant="secondary" onClick={this.HideModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  style={{ width: "100px" }}
                  disabled={this.state.isloading}
                >
                  {this.state.isloading ? (
                    <Spinner
                      animation="border"
                      variant="success"
                      size="sm"
                    ></Spinner>
                  ) : (
                    "Save"
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          :
            <Form onSubmit={this.handleSubmit}>
              <Modal.Header closeButton style={{ backgroundColor: "#96BB7C" }}>
                <Modal.Title>Edit Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <InputGroup>
                    <Form.Label>Progress</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      name="progress"
                      min={0}
                      max={100}
                      value={this.state.progress}
                      onChange={(e) => {
                        if (parseInt(e.target.value) === 100) {
                          this.setState({ issue: false });
                        }
                        this.setState({ progress: e.target.value });
                        this.value = this.state.progress;
                      }}
                    />
                    <Form.Control
                      type="range"
                      value={this.state.progress}
                      onChange={(e) => {
                        if (parseInt(e.target.value) === 100) {
                          this.setState({ issue: false });
                        }
                        this.setState({ progress: e.target.value });
                        this.value = this.state.progress;
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
                      if (parseInt(this.state.progress) === 100) {
                        this.setState({ issue: false });
                        this.checked = false;
                        alert(
                          "You cannot specify that a complete task has an issue."
                        );
                      } else {
                        this.setState({ issue: e.target.checked });
                        this.checked = this.state.issue;
                      }
                    }}
                  />
                </Form.Group>
                <br />
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: "#96BB7C" }}>
                <Button variant="secondary" onClick={this.HideModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="dark"
                  style={{ width: "100px" }}
                  disabled={this.state.isloading}
                >
                  {this.state.isloading ? (
                    <Spinner
                      animation="border"
                      variant="success"
                      size="sm"
                    ></Spinner>
                  ) : (
                    "Save"
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          }
        </Modal>
      </React.Fragment>
    );
  }
}

export default UpdateTask;
