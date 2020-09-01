import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import {
  Icon,
  Label,
  Form,
  Item,
  Input,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

class UpdateTask extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisibility}
        onRequestClose={() => this.props.toggleVisibility(true, false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => this.props.toggleVisibility(true, false)}>
              <Icon type="FontAwesome" name="close" />
            </TouchableOpacity>
            <View style={{alignItems: 'center', marginTop: 25}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>Edit Task</Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '60%',
                  marginBottom: 10,
                }}>
              </View>
            </View>
            <UpdateTaskForm
              task={this.props.task}
              toggleVisibility={this.props.toggleVisibility}
              getProjectInfo={this.props.getProjectInfo}
              setProjectInfo={this.props.setProjectInfo}
              displayTaskDependency={this.props.displayTaskDependency}
              project={this.props.project}
              pacMans={this.props.pacMans}
              resPersons={this.props.resPersons}
              resources={this.props.resources}
              allUsers={this.props.allUsers}
              assignedProjUsers={this.props.assignedProjUsers}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

class UpdateTaskForm extends Component {
  constructor(props) {
    super(props);

    let sYear = this.props.task.startDate.year.low;
    let sMonth =
      this.props.task.startDate.month.low < 10
        ? '0' + this.props.task.startDate.month.low
        : this.props.task.startDate.month.low;
    let sDay = this.props.task.startDate.day.low;
    if (sDay < 10) {
      sDay = '0' + sDay;
    }

    let eYear = this.props.task.endDate.year.low;
    let eMonth =
      this.props.task.endDate.month.low < 10
        ? '0' + this.props.task.endDate.month.low
        : this.props.task.endDate.month.low;
    let eDay = this.props.task.endDate.day.low;
    if (eDay < 10) {
      eDay = '0' + eDay;
    }

    this.state = {
      taskName: this.props.task.name,
      taskDescription: this.props.task.description,
      startDate: new Date(sYear + '-' + sMonth + '-' + sDay),
      endDate: new Date(eYear + '-' + eMonth + '-' + eDay),
      taskDuration: this.props.task.duration,
      startDatePickerVisible: false,
      error:null,
      people: [...this.props.allUsers],
      assignedProjUsers: [...this.props.assignedProjUsers],
      pacManSearchTerm: "",
      resourcesSearchTerm: "",
      resPersonSearchTerm: "",
      pacManList: [...this.props.pacMans],
      resourcesList: [...this.props.resources],
      resPersonList: [...this.props.resPersons],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateSelect = this.handleStartDateSelect.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.formatValidateInput = this.formatValidateInput.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.removeAssignedPeople = this.removeAssignedPeople.bind(this);
    this.removeAssignedPerson = this.removeAssignedPerson.bind(this);
  }

  handleStartDateSelect(event, selectedDate) {
    if(event.type === 'dismissed') {
      this.setState({startDatePickerVisible: false});
      return;
    }
    
    this.setState({startDate: selectedDate, startDatePickerVisible: false});
    this.setEndDate(selectedDate, undefined);
  }

  handleDuration(duration) {
    this.setState({taskDuration: duration});
    this.setEndDate(undefined, duration);
  }

  setEndDate(startDate, duration) {
    if (duration != undefined) {
      duration = parseInt(duration);
      if (isNaN(duration)) return;
      let result = new Date(this.state.startDate);
      result.setDate(result.getDate() + duration);
      this.setState({endDate: result});
    } else {
      let result = new Date(startDate);
      result.setDate(result.getDate() + parseInt(this.state.taskDuration));
      this.setState({endDate: result});
    }
  }

  formatValidateInput() {
    if(this.checkFormData('all') === false) return null;

    let data = {
      ut_id: this.props.task.id,
      ut_name: this.state.taskName,
      ut_startDate: this.state.startDate.toISOString().substr(0, 10),
      ut_duration: !(this.state.taskDuration.toString()).trim().length || this.state.taskDuration < 0 ? 0 : parseInt(this.state.taskDuration),
      ut_endDate: this.state.endDate.toISOString().substr(0, 10),
      ut_description: this.state.taskDescription,
    };

    return data;
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

  updateSearch(value, mode) {
    if (mode === 0) this.setState({ pacManSearchTerm: value });
    if (mode === 1) this.setState({ resPersonSearchTerm: value });
    if (mode === 2) this.setState({ resourcesSearchTerm: value });
  }

  addPacMan(person) {
    let tempPacManList = this.state.pacManList;
    tempPacManList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = []
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.props.task.id,
      type: "PACKAGE_MANAGER"
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
      pacManSearchTerm: ""
    });
  }

  addResPerson(person) {
    let tempResPersonList = this.state.resPersonList;
    tempResPersonList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = []
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.props.task.id,
      type: "RESPONSIBLE_PERSON"
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
    let userTask = []
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.props.task.id,
      type: "RESOURCE"
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
      resourcesSearchTerm: ""
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

    for(let x = 0; x < this.state.assignedProjUsers.length; x++){
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

  async handleSubmit() {
    let input = this.formatValidateInput();
    if (input === null) return;

    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = input;
    projectData = JSON.stringify(projectData);

    const response = await fetch(
      'http://projecttree.herokuapp.com/task/update',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: projectData,
      },
    );

    const body = await response.json();

    let timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 2);
    timestamp = timestamp.toISOString();

    await fetch("http://projecttree.herokuapp.com/people/updateAssignedPeople", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ut_taskId: this.props.task.id,
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
          taskName: this.state.taskName,
          type: "auto",
          mode: 2,
        }
      }),
    });

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

    this.props.toggleVisibility(true, false);
    this.props.displayTaskDependency(null, null);
    this.props.setProjectInfo(body.nodes, body.rels, this.state.assignedProjUsers);
  }

  componentDidMount(){
    this.removeAssignedPeople();
  }

  checkFormData(check){
    if(check === "name" || check === "all"){
      let name = this.state.taskName;
      if(name === null || !name.trim().length){
        this.setState({error:"Please enter a task name"});
        return false;
      }

      else{
        this.setState({error:null});
      }
    }

    if(check === "duration" || check === "all"){
      let duration = this.state.taskDuration
      if(!(duration.toString()).trim().length || duration<0){
        this.setState({taskDuration:0});
        this.setEndDate(this.state.startDate, 0);
      }
    }
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
      <ScrollView style={{height:650}}>
        <Form>
          <Text style={{color:'red', alignSelf:'center'}}>{this.state.error}</Text>
          <Item floatingLabel>
            <Label>Name of Task</Label>
            <Input
              value={this.state.taskName}
              onChangeText={(val) => this.setState({taskName: val})}
              onEndEditing={()=>this.checkFormData("name")} 
            />
          </Item>
          <Item floatingLabel>
            <Label>Description of Task</Label>
            <Input
              value={this.state.taskDescription}
              onChangeText={(val) => this.setState({taskDescription: val})}
            />
          </Item>
          <Item floatingLabel disabled>
            <Label>Start Date</Label>
            <Input value={this.state.startDate.toISOString().substr(0, 10)} />
            <Icon
              type="AntDesign"
              name="plus"
              onPress={() => {
                this.checkFormData("duration");
                this.setState({startDatePickerVisible: true});
              }}
            />
          </Item>
          <Item floatingLabel disabled>
            <Label>Duration (days)</Label>
            <Input
              value={this.state.taskDuration.toString()}
              onEndEditing={()=>this.checkFormData("duration")}
              onChangeText={this.handleDuration}
            />
          </Item>
          <Item floatingLabel disabled>
            <Label>End Date</Label>
            <Input value={this.state.endDate.toISOString().substr(0, 10)} />
          </Item>
          <Item floatingLabel>
            <Label>Package Manager</Label>
            <Input
              value={this.state.pacManSearchTerm}
              onChangeText={(val) => this.updateSearch(val, 0)}
            />
          </Item>
          <View style={{flexDirection: 'row', flex:1}}>
            {this.state.pacManSearchTerm.length >= 2 ? (
              <View style={{flex:0.5}}>
                {filteredPacMan.map((person) => {
                  return (
                    <TouchableOpacity
                      type="button"
                      onPress={() => this.addPacMan(person)}
                      key={person.id}
                      style={styles.peopleButtons}
                    >
                      <Text style={{color:'white'}}>{person.name}&nbsp;{person.surname}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : <View style={{flex:0.5}}></View>}
            <View style={{flex:0.5}}>
              {this.state.pacManList.map((person) => {
                return (
                  <TouchableOpacity
                    type="button"
                    onPress={() => this.removeAssignedPerson(person, 0)}
                    key={person.id}
                    style={styles.selectedPeopleButtons}
                  >
                    <Text>{person.name}&nbsp;{person.surname}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Item floatingLabel>
            <Label>Responsible Person</Label>
            <Input
              value={this.state.resPersonSearchTerm}
              onChangeText={(val) => this.updateSearch(val, 1)}
            />
          </Item>
          <View style={{flexDirection: 'row', flex:1}}>
            {this.state.resPersonSearchTerm.length >= 2 ? (
              <View style={{flex:0.5}}>
                {filteredResPerson.map((person) => {
                  return (
                    <TouchableOpacity
                      type="button"
                      onPress={() => this.addResPerson(person)}
                      key={person.id}
                      style={styles.peopleButtons}
                    >
                      <Text style={{color:'white'}}>{person.name}&nbsp;{person.surname}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : <View style={{flex:0.5}}></View>}
            <View style={{flex:0.5}}>
              {this.state.resPersonList.map((person) => {
                return (
                  <TouchableOpacity
                    type="button"
                    onPress={() => this.removeAssignedPerson(person, 1)}
                    key={person.id}
                    style={styles.selectedPeopleButtons}
                  >
                    <Text>{person.name}&nbsp;{person.surname}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Item floatingLabel>
            <Label>Resource(s)</Label>
            <Input
              value={this.state.resourcesSearchTerm}
              onChangeText={(val) => this.updateSearch(val, 2)}
            />
          </Item>
          <View style={{flexDirection: 'row', flex:1}}>
            {this.state.resourcesSearchTerm.length >= 2 ? (
              <View style={{flex:0.5}}>
                {filteredResources.map((person) => {
                  return (
                    <TouchableOpacity
                      type="button"
                      onPress={() => this.addResource(person)}
                      key={person.id}
                      style={styles.peopleButtons}
                    >
                      <Text style={{color:'white'}}>{person.name}&nbsp;{person.surname}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : <View style={{flex:0.5}}></View>}
            <View style={{flex:0.5}}>
              {this.state.resourcesList.map((person) => {
                return (
                  <TouchableOpacity
                    type="button"
                    onPress={() => this.removeAssignedPerson(person, 2)}
                    key={person.id}
                    style={styles.selectedPeopleButtons}
                  >
                    <Text>{person.name}&nbsp;{person.surname}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Form>
        {this.state.startDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.startDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.handleStartDateSelect}
          />
        )}
        <View styles={{padding: 20}}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleSubmit}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.8)',
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 100,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 800,
    width: 350,
  },
  hideButton: {
    flex: 0.5,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#184D47',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 3,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
  head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40},
  text: {margin: 6, textAlign: 'center'},
  peopleButtons: {
    backgroundColor: '#184D47',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 3,
  },
  selectedPeopleButtons: {
    backgroundColor: '#EEBB4D',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 3,
  }
});

export default UpdateTask;
