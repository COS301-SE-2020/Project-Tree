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
  Input
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <React.Fragment>
        <CreateTaskModal
          project={this.props.project}
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
          assignedProjUsers={this.props.assignedProjUsers}
          allUsers={this.props.allUsers}
        />
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={styles.floatinBtn}>
          <Icon type="AntDesign" name="plus" />
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

class CreateTaskModal extends Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => this.props.setModalVisible(false)}>
              <Icon type="FontAwesome" name="close" />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>Create Task</Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '60%',
                  marginBottom: 10,
                }}></View>
            </View>
            <CreateTaskForm
              project={this.props.project}
              setModalVisible={this.props.setModalVisible}
              getProjectInfo={this.props.getProjectInfo}
              setProjectInfo={this.props.setProjectInfo}
              assignedProjUsers={this.props.assignedProjUsers}
              allUsers={this.props.allUsers}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

class CreateTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: null,
      taskDescription: null,
      startDate: new Date(),
      endDate: new Date(),
      taskDuration: 0,
      startDatePickerVisible: false,
      error: null,
      people: [...this.props.allUsers],
      pacManSearchTerm: "",
      resourcesSearchTerm: "",
      resPersonSearchTerm: "",
      pacManList: [],
      resourcesList: [],
      resPersonList: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateSelect = this.handleStartDateSelect.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.formatValidateInput = this.formatValidateInput.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.assignPeople = this.assignPeople.bind(this);
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
      ct_Name: this.state.taskName,
      ct_startDate: this.state.startDate.toISOString().substr(0, 10),
      ct_duration: !(this.state.taskDuration.toString()).trim().length || this.state.taskDuration < 0 ? 0 : parseInt(this.state.taskDuration),
      ct_endDate: this.state.endDate.toISOString().substr(0, 10),
      ct_description: this.state.taskDescription,
      ct_pid: this.props.project.id,
    };

    return data;
  }

  async handleSubmit() {
    let input = this.formatValidateInput();
    if (input === null) {
      return;
    }

    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = input;
    projectData = JSON.stringify(projectData);

    const response = await fetch('http://projecttree.herokuapp.com/task/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: projectData,
    });

    const body = await response.json();
    let newTask = body.displayNode;

    let assignedPeople = this.assignPeople(newTask);

    let timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 2);
    timestamp = timestamp.toISOString();

    await fetch("http://projecttree.herokuapp.com/people/assignPeople", {
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
          taskName: this.state.taskName,
          type: "auto",
          mode: 2,
        },
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

    this.props.setModalVisible(false);
    this.props.setProjectInfo(body.nodes, body.rels, assignedPeople);
  }

  updateSearch(value, mode) {
    if (mode === 0) this.setState({ pacManSearchTerm: value });
    if (mode === 1) this.setState({ resPersonSearchTerm: value });
    if (mode === 2) this.setState({ resourcesSearchTerm: value });
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
      <ScrollView style={{height:650}}>
        <Form>
          <Text style={{color:'red', alignSelf:'center'}}>{this.state.error}</Text>
          <Item floatingLabel>
            <Label>Name of Task</Label>
            <Input 
              onChangeText={(val) => this.setState({taskName: val})}
              onEndEditing={()=>this.checkFormData("name")} 
            />
          </Item>
          <Item floatingLabel>
            <Label>Description of Task</Label>
            <Input
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
        <View styles={{padding: 10}}>
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
    height:800,
    width: 350,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  floatinBtn: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  hideButton: {
    flex: 0.5,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    bottom: 0,
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
    marginTop: 15,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    width: 200,
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  row: {
    height: 40,
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
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

export default CreateTask;
