import React from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";

function stringifyFormData(fd) {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
}

class UpdateTask extends React.Component {
  constructor(props) {
    super(props);
    var syear = `${this.props.task.startDate.year.low}`;
    var smonth = this.props.task.startDate.month.low;
    smonth = smonth < 10 ? `0${smonth}` : `${smonth}`;
    var sday = this.props.task.startDate.day.low;
    sday = sday < 10 ? `0${sday}` : `${sday}`;
    var eyear = `${this.props.task.endDate.year.low}`;
    var emonth = this.props.task.endDate.month.low;
    emonth = emonth < 10 ? `0${emonth}` : `${emonth}`;
    var eday = this.props.task.endDate.day.low;
    eday = eday < 10 ? `0${eday}` : `${eday}`;
    this.state = {
      Show: false,
      id: this.props.task.id,
      name: this.props.task.name,
      startDate: `${syear}-${smonth}-${sday}`,
      duration: this.props.task.duration,
      endDate: `${eyear}-${emonth}-${eday}`,
      description: this.props.task.description,
      people:this.props.allUsers,
      pacManSearchTerm:'',
      resourcesSearchTerm:'',
      resPersonSearchTerm:'',
      pacManList:this.props.pacMans,
      resourcesList:this.props.resources,
      resPersonList:this.props.resPersons,
    };
    this.ShowModal = this.ShowModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshState = this.refreshState.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.removeAssignedPeople = this.removeAssignedPeople.bind(this);
  }

  // componentDidMount(){
  //   this.removeAssignedPeople();
  // }

  refreshState() {
    var syear = `${this.props.task.startDate.year.low}`;
    var smonth = this.props.task.startDate.month.low;
    smonth = smonth < 10 ? `0${smonth}` : `${smonth}`;
    var sday = this.props.task.startDate.day.low;
    sday = sday < 10 ? `0${sday}` : `${sday}`;
    var eyear = `${this.props.task.startDate.year.low}`;
    var emonth = this.props.task.startDate.month.low;
    emonth = emonth < 10 ? `0${emonth}` : `${emonth}`;
    var eday = this.props.task.startDate.day.low;
    eday = eday < 10 ? `0${eday}` : `${eday}`;
    this.setState({
      id: this.props.task.id,
      name: this.props.task.name,
      startDate: `${syear}-${smonth}-${sday}`,
      duration: this.props.task.duration,
      endDate: `${eyear}-${emonth}-${eday}`,
      description: this.props.task.description,
      people:this.props.allUsers,
      pacManSearchTerm:'',
      resourcesSearchTerm:'',
      resPersonSearchTerm:'',
      pacManList:this.props.pacMans,
      resourcesList:this.props.resources,
      resPersonList:this.props.resPersons,
    });
  }

  /*
  * Removes people from the people list if they are already assigned to a role so that they can't be selected again
  */
  removeAssignedPeople(){
    //console.log(this.state.people)
    for(let x = 0; x < this.state.people.length; x++){
      for(let y = 0; y < this.state.pacManList.length; y++){
        if(this.state.pacManList[y].id === this.state.people[x].id){
          if(x === 0) this.state.people.shift();
          else if(x === this.state.people.length-1) this.state.people.pop()
          else this.state.people.splice(x,1)
        }
      }
    }

    for(let x = 0; x < this.state.people.length; x++){
      for(let y = 0; y < this.state.resPersonList.length; y++){
        if(this.state.resPersonList[y].id === this.state.people[x].id){
          if(x === 0) this.state.people.shift();
          else if(x === this.state.people.length-1) this.state.people.pop()
          else this.state.people.splice(x,1)
        }
      }
    }

    for(let x = 0; x < this.state.people.length; x++){
      for(let y = 0; y < this.state.resourcesList.length; y++){
        if(this.state.resourcesList[y].id === this.state.people[x].id){
          if(x === 0) this.state.people.shift();
          else if(x === this.state.people.length-1) this.state.people.pop()
          else this.state.people.splice(x,1)
        }
      }
    }
  }

  ShowModal() {
    this.setState({ Show: true, people:this.props.allUsers });
    this.removeAssignedPeople();
  }

  HideModal() {
    for(let x = 0; x < this.state.pacManList.length; x++){
      this.state.people.push(this.state.pacManList[x])
    }
    for(let x = 0; x < this.state.resPersonList.length; x++){
      this.state.people.push(this.state.resPersonList[x])
    }
    for(let x = 0; x < this.state.resourcesList.length; x++){
      this.state.people.push(this.state.resourcesList[x])
    }
    
    this.setState({ Show: false });
  }

  setDuration(e) {
    var duration;
    var startDate;
    if (e.target.id === "ut_startDate") {
      startDate = e.target.value;
      duration = this.state.duration;
    } else if (e.target.id === "ut_duration") {
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

    const response = await fetch("/task/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: projectData,
    });

    const body = await response.json();

    await fetch("/people/updateAssignedPeople", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        ut_taskId:this.state.id,
        ut_pacMans:this.state.pacManList,
        ut_resPersons:this.state.resPersonList,
        ut_resources:this.state.resourcesList,
        ut_originalPacMans:this.props.pacMans,
        ut_originalResPersons:this.props.resPersons,
        ut_originalResources:this.props.resources
      })
    });

    await this.props.setTaskInfo(
      body.nodes,
      body.rels,
      body.displayNode,
      body.displayRel
    );
    this.setState({ Show: false });
  }

  updateSearch(event, mode){
    if(mode===0) this.setState({pacManSearchTerm:event.target.value});
    if(mode==1) this.setState({resPersonSearchTerm:event.target.value});
    if(mode==2) this.setState({resourcesSearchTerm:event.target.value});
  }

  addPacMan(person){
    let tempPacManList = this.state.pacManList;
    tempPacManList.push(person);

    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for(let x = 0; x < this.state.people.length; x++){
      if(this.state.people[x].id === person.id){
        if(x === 0) this.state.people.shift();
        else if(x === this.state.people.length-1) this.state.people.pop()
        else this.state.people.splice(x,1)
      }
    }

    this.setState({pacManList:tempPacManList,pacManSearchTerm:''});
  }

  addResPerson(person){
    let tempResPersonList = this.state.resPersonList;
    tempResPersonList.push(person);
    
    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for(let x = 0; x < this.state.people.length; x++){
      if(this.state.people[x].id === person.id){
        if(x === 0) this.state.people.shift();
        else if(x === this.state.people.length-1) this.state.people.pop()
        else this.state.people.splice(x,1)
      }
    }

    this.setState({resPersonList:tempResPersonList,resPersonSearchTerm:''});
  }

  addResource(person){
    let tempResourceList = this.state.resourcesList;
    tempResourceList.push(person);
    
    // Prevents user from selecting someone for two roles or twice for one role by removing them from state people array
    for(let x = 0; x < this.state.people.length; x++){
      if(this.state.people[x].id === person.id){
        if(x === 0) this.state.people.shift();
        else if(x === this.state.people.length-1) this.state.people.pop()
        else this.state.people.splice(x,1)
      }
    }

    this.setState({resourceList:tempResourceList,resourcesSearchTerm:''});
  }

  removeAssignedPerson(person,mode){
    let peopleList = this.state.people;
    if(mode === 0){
      for(let x = 0; x < this.state.pacManList.length; x++){
        if(person.id === this.state.pacManList[x].id){
          if(x === 0) this.state.pacManList.shift();
          else if(x === this.state.pacManList.length-1) this.state.pacManList.pop();
          else this.state.pacManList.splice(x,1);
        }
      }
    }

    if(mode === 1){
      for(let x = 0; x < this.state.resPersonList.length; x++){
        if(person.id === this.state.resPersonList[x].id){
          if(x === 0) this.state.resPersonList.shift();
          else if(x === this.state.resPersonList.length-1) this.state.resPersonList.pop();
          else this.state.resPersonList.splice(x,1);
        }
      }
    }

    if(mode === 2){
      for(let x = 0; x < this.state.resourcesList.length; x++){
        if(person.id === this.state.resourcesList[x].id){
          if(x === 0) this.state.resourcesList.shift();
          else if(x === this.state.resourcesList.length-1) this.state.resourcesList.pop();
          else this.state.resourcesList.splice(x,1);
        }
      }
    }
    peopleList.push(person);
    this.setState({people:peopleList})
  }

  render() {
    if (this.state.id !== this.props.task.id) this.refreshState();

    console.log(this.props.pacMans)
    console.log("LIST:"+this.state.pacManList)
    /*
    * Filters the list of people to only show people matching the search term
    */
    let filteredPacMan = this.state.people.filter(
      (person) => {
        return person.name.toLowerCase().indexOf(
          this.state.pacManSearchTerm.toLowerCase()) !== -1;
      }
    );
    let filteredResPerson = this.state.people.filter(
      (person) => {
        return person.name.toLowerCase().indexOf(
          this.state.resPersonSearchTerm.toLowerCase()) !== -1;
      }
    );
    let filteredResources = this.state.people.filter(
      (person) => {
        return person.name.toLowerCase().indexOf(
          this.state.resourcesSearchTerm.toLowerCase()) !== -1;
      }
    );

    return (
      <React.Fragment>
        <Button variant="outline-dark"  onClick={this.ShowModal}>
          <i className="fa fa-edit"> </i> Edit{" "}
        </Button>
        <Modal show={this.state.Show} onHide={this.HideModal}>
          <Form onSubmit={this.handleSubmit}>
            <Modal.Header closeButton style={{backgroundColor:"#184D47", color:"white"}}>
              <Modal.Title>Update Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <input
                  hidden
                  type="number"
                  id="ut_id"
                  name="ut_id"
                  value={this.state.id}
                  onChange={() => {}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Name of task</Form.Label>
                <Form.Control
                  type="text"
                  id="ut_name"
                  name="ut_name"
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
                  id="ut_description"
                  name="ut_description"
                  rows="3"
                  value={this.state.description}
                  onChange={(e) => {
                    this.setState({ description: e.target.value });
                    this.value = this.state.description;
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Start date</Form.Label>
                <Form.Control
                  type="date"
                  id="ut_startDate"
                  name="ut_startDate"
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
                <Form.Label> Duration</Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="0"
                  id="ut_duration"
                  name="ut_duration"
                  value={this.state.duration}
                  onChange={(e) => {
                    this.setState({ duration: e.target.value });
                    this.value = this.state.duration;
                    this.setState({ endDate: this.setDuration(e) });
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  id="ut_endDate"
                  name="ut_endDate"
                  value={this.state.endDate}
                  readOnly
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Package Manager</Form.Label>
                <Row>
                  <Col>
                    <input type='text'
                      value={this.state.pacManSearchTerm}
                      onChange={(e)=>this.updateSearch(e,0)}
                      placeholder='Search for a name'/>
                    {this.state.pacManSearchTerm.length >=2 ? <ul>
                      {filteredPacMan.map((person) => {
                        return <li key={person.id}>
                            <button type='button' onClick={()=>this.addPacMan(person)}>{person.name}&nbsp;{person.surname}</button>
                          </li>
                      })}
                    </ul>:null}
                  </Col>
                  <Col>
                    {this.state.pacManList.map((person) => {
                      return <li key={person.id}>
                          <button type='button' onClick={()=>this.removeAssignedPerson(person,0)}>{person.name}&nbsp;{person.surname}</button>
                        </li>
                    })}
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Responsible Person(s)</Form.Label>
                <Row>
                  <Col>
                    <input type='text'
                      value={this.state.resPersonSearchTerm}
                      onChange={(e)=>this.updateSearch(e,1)}
                      placeholder='Search for a name'/>
                    {this.state.resPersonSearchTerm.length >=2 ? <ul>
                      {filteredResPerson.map((person) => {
                        return <li key={person.id}>
                            <button type='button' onClick={()=>this.addResPerson(person)}>{person.name}&nbsp;{person.surname}</button>
                          </li>
                      })}
                    </ul>:null}
                  </Col>
                  <Col>
                    {this.state.resPersonList.map((person) => {
                      return <li key={person.id}>
                          <button type='button' onClick={()=>this.removeAssignedPerson(person,1)}>{person.name}&nbsp;{person.surname}</button>
                        </li>
                    })}
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Resource(s)</Form.Label>
                <Row>
                  <Col>
                    <input type='text'
                      value={this.state.resourcesSearchTerm}
                      onChange={(e)=>this.updateSearch(e,2)}
                      placeholder='Search for a name'/>
                    {this.state.resourcesSearchTerm.length >=2 ? <ul>
                      {filteredResources.map((person) => {
                        return <li key={person.id}>
                            <button type='button' onClick={()=>this.addResource(person)}>{person.name}&nbsp;{person.surname}</button>
                          </li>
                      })}
                    </ul>:null}
                  </Col>
                  <Col>
                    {this.state.resourcesList.map((person) => {
                      return <li key={person.id}>
                          <button type='button' onClick={()=>this.removeAssignedPerson(person,2)}>{person.name}&nbsp;{person.surname}</button>
                        </li>
                    })}
                  </Col>
                </Row>
              </Form.Group>
              <br />
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:"#184D47", color:"white"}}>
              <Button variant="secondary" onClick={this.HideModal}>
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

export default UpdateTask;
