import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Slider,
  Switch,
} from 'react-native';
import {Icon, Label, Form, Item, Input} from 'native-base';
import {Tooltip} from 'react-native-elements';
import IconEntypo from 'react-native-vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import ms from 'ms';

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
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>Edit Task</Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '60%',
                  marginBottom: 10,
                }}></View>
            </View>
            <UpdateTaskForm
              updateType={this.props.updateType}
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
              rels={this.props.rels}
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

    this.state = {
      name: this.props.task.name,
      description: this.props.task.description,
      startDate: this.props.task.startDate,
      endDate: this.props.task.endDate,
      duration: this.props.task.duration,
      progress: this.props.task.progress,
      type: this.props.task.type,
      issue: this.props.task.type === 'Issue',
      dateTimePicker: false,
      dateTimeType: {type: 'date', for: 'start', value: new Date()},
      error: null,
      people: [...this.props.allUsers],
      assignedProjUsers: [...this.props.assignedProjUsers],
      pacManSearchTerm: '',
      resourcesSearchTerm: '',
      resPersonSearchTerm: '',
      pacManList: [...this.props.pacMans],
      resourcesList: [...this.props.resources],
      resPersonList: [...this.props.resPersons],
    };

    this.handleDateTimeSelect = this.handleDateTimeSelect.bind(this);
    this.checkFormData = this.checkFormData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatValidateInput = this.formatValidateInput.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateStart = this.updateStart.bind(this);
    this.addPacMan = this.addPacMan.bind(this);
    this.addResPerson = this.addResPerson.bind(this);
    this.addResource = this.addResource.bind(this);
    this.removeAssignedPeople = this.removeAssignedPeople.bind(this);
    this.removeAssignedPerson = this.removeAssignedPerson.bind(this);
  }

  handleDateTimeSelect(event, selectedDate, type) {
    if (event.type === 'dismissed') {
      this.setState({dateTimePicker: false});
      return;
    }
    let date = new Date(
      new Date(selectedDate).getTime() -
        new Date().getTimezoneOffset() * 60 * 1000,
    )
      .toISOString()
      .substring(0, 16);
    if (type.for === 'start') {
      if (date < this.props.project.startDate) {
        this.setState({
          error: 'You cannot make the start date/time before the project date/time.',
          startDate: this.props.project.startDate       ,
          dateTimePicker: false,
        });
      } else if (this.state.endDate < date)
        this.setState({
          error: 'You cannot set the start date/time after the end date/time.',
          startDate: date,
          endDate: date,
          dateTimePicker: false,
        });
      else
        this.setState({
          error: null,
          startDate: date,
          dateTimePicker: false,
        });
    } else {
      if (this.state.startDate > date)
        this.setState({
          error: 'You cannot set the end date/time before the start date/time.',
          startDate: date,
          endDate: date,
          dateTimePicker: false,
        });
      else
        this.setState({
          error: null,
          endDate: date,
          dateTimePicker: false,
        });
    }
  }

  formatValidateInput() {
    if (this.checkFormData('all') === false) return null;

    let type = 'Incomplete';
    if (this.state.issue === true) type = 'Issue';
    if (parseInt(this.state.progress) === 100) type = 'Complete';

    let data = {
      id: this.props.task.id,
      name: this.state.name,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      description: this.state.description,
      progress: this.state.progress,
      type: type,
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
    if (mode === 0) this.setState({pacManSearchTerm: value});
    if (mode === 1) this.setState({resPersonSearchTerm: value});
    if (mode === 2) this.setState({resourcesSearchTerm: value});
  }

  addPacMan(person) {
    let tempPacManList = this.state.pacManList;
    tempPacManList.push(person);

    let tempProjUsersList = this.state.assignedProjUsers;
    let userTask = [];
    userTask.push(person);
    userTask.push({
      start: person.id,
      end: this.props.task.id,
      type: 'PACKAGE_MANAGER',
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
      pacManSearchTerm: '',
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
      end: this.props.task.id,
      type: 'RESPONSIBLE_PERSON',
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
      resPersonSearchTerm: '',
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
      end: this.props.task.id,
      type: 'RESOURCE',
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
      resourcesSearchTerm: '',
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
    this.setState({people: peopleList});
  }

  async handleSubmit() {
    let input = this.formatValidateInput();
    if (input === null) return;

    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = input;

    const response = await fetch(
      'http://10.0.2.2:5000/task/update',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      },
    );

    const body = await response.json();

    let timestamp = new Date();
    timestamp.setTime(
      timestamp.getTime() - new Date().getTimezoneOffset() * 60 * 1000,
    );
    timestamp = timestamp.toISOString();

    await fetch(
      'http://10.0.2.2:5000/people/updateAssignedPeople',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
            taskName: this.state.name,
            type: 'auto',
            mode: 2,
          },
        }),
      },
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

    this.props.toggleVisibility(true, false);
    this.props.displayTaskDependency(null, null);
    this.props.setProjectInfo(
      body.nodes,
      body.rels,
      this.state.assignedProjUsers,
    );
  }

  componentDidMount() {
    this.removeAssignedPeople();
  }

  checkFormData(check) {
    if (check === 'name' || check === 'all') {
      let name = this.state.name;
      if (name === null || !name.trim().length) {
        this.setState({error: 'Please enter a task name'});
        return false;
      } else {
        this.setState({error: null});
      }
    }
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime(
      startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000,
    );
    let endDate = new Date(ed);
    endDate.setTime(
      endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000,
    );
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  updateStart() {
    let check = true;
    this.props.rels.forEach(el => {
      if (el.target === this.props.task.id) check = false;
    });
    return check;
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

    let start = this.updateStart();

    return (
    this.props.updateType === "update" ?
      (
        <React.Fragment>
          <ScrollView style={{height: 650}}>
            <Form>
              <Text style={{color: 'red', alignSelf: 'center'}}>
                {this.state.error}
              </Text>
              <Item floatingLabel>
                <Label>Name of Task</Label>
                <Input
                  value={this.state.name}
                  onChangeText={(val) => this.setState({name: val})}
                  onEndEditing={() => this.checkFormData('name')}
                />
              </Item>
              <Item floatingLabel>
                <Label>Description of Task</Label>
                <Input
                  value={this.state.description}
                  onChangeText={(val) => this.setState({description: val})}
                />
              </Item>
              {start ? 
                <Item floatingLabel disabled>
                  <Label>Start Date</Label>
                  <Input value={this.state.startDate.substring(0, 10)} />
                  <Icon
                    type="FontAwesome"
                    name="calendar-o"
                    onPress={() => {
                      this.setState({
                        dateTimePicker: true,
                        dateTimeType: {
                          type: 'date',
                          for: 'start',
                          value: this.state.startDate,
                        },
                      });
                    }}
                  />
                </Item>
              :
                <Item floatingLabel disabled>
                  <Label>Start Date
                    <Tooltip
                      popover={
                        <Text style={{color: 'white'}}>
                          This task is dependent on another task, to edit the start date of this task please update either a previous task or dependency.
                        </Text>
                      }
                      height={150}
                      width={250}
                      skipAndroidStatusBar={true}
                      backgroundColor={'rgba(0, 0, 0, 1)'}>
                      <View style={styles.tooltipButton}>
                        <IconEntypo name="help" size={25} />
                      </View>
                    </Tooltip>
                  </Label>
                  <Input value={this.state.startDate.substring(0, 10)} />
                </Item>
              }
              {start ? 
                <Item floatingLabel disabled>
                  <Label>Start Time</Label>
                  <Input value={this.state.startDate.substring(11, 16)} />
                  <Icon
                    type="SimpleLineIcons"
                    name="clock"
                    onPress={() => {
                      this.setState({
                        dateTimePicker: true,
                        dateTimeType: {
                          type: 'time',
                          for: 'start',
                          value: this.state.startDate,
                        },
                      });
                    }}
                  />
                </Item>
              :
                <Item floatingLabel disabled>
                  <Label>Start Time
                    <Tooltip
                      popover={
                        <Text style={{color: 'white'}}>
                          This task is dependent on another task, to edit the start date of this task please update either a previous task or dependency.
                        </Text>
                      }
                      height={150}
                      width={250}
                      skipAndroidStatusBar={true}
                      backgroundColor={'rgba(0, 0, 0, 1)'}>
                      <View style={styles.tooltipButton}>
                        <IconEntypo name="help" size={25} />
                      </View>
                    </Tooltip>
                  </Label>
                  <Input value={this.state.startDate.substring(11, 16)} />
                </Item>
              }
              <Item floatingLabel disabled>
                <Label>End Date</Label>
                <Input value={this.state.endDate.substring(0, 10)} />
                <Icon
                  type="FontAwesome"
                  name="calendar-o"
                  onPress={() => {
                    this.setState({
                      dateTimePicker: true,
                      dateTimeType: {
                        type: 'date',
                        for: 'end',
                        value: this.state.endDate,
                      },
                    });
                  }}
                />
              </Item>
              <Item floatingLabel disabled>
                <Label>End Time</Label>
                <Input value={this.state.endDate.substring(11, 16)} />
                <Icon
                  type="SimpleLineIcons"
                  name="clock"
                  onPress={() => {
                    this.setState({
                      dateTimePicker: true,
                      dateTimeType: {
                        type: 'time',
                        for: 'end',
                        value: this.state.endDate,
                      },
                    });
                  }}
                />
              </Item>
              <Item floatingLabel disabled>
                <Label>Duration</Label>
                <Input
                  value={this.CalcDiff(this.state.startDate, this.state.endDate)}
                />
              </Item>
              <View style={{flex: 1, marginBottom: 15}}>
                <Text style={styles.text}>{String(this.state.progress)}</Text>
                <Slider
                  step={1}
                  maximumValue={100}
                  value={this.state.progress}
                  onValueChange={(value) => {
                    if (parseInt(value) === 100) {
                      this.setState({issue: false});
                    }
                    this.setState({progress: value});
                    this.value = this.state.progress;
                  }}
                />
              </View>

              <View
                style={
                  (styles.modalText,
                  {
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 20,
                    paddingLeft: 24,
                  })
                }>
                <Text style={{alignItems: 'flex-start', fontSize: 16}}>
                  There is an issue with this task:{' '}
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={this.state.issue ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    if (parseInt(this.state.progress) === 100) {
                      this.setState({
                        error:
                          'You cannot specify that a complete task has an issue.',
                        issue: false,
                      });
                      this.value = false;
                    } else {
                      this.setState({issue: value});
                      this.value = this.state.issue;
                    }
                  }}
                  value={this.state.issue}
                  style={{alignItems: 'flex-end'}}
                />
              </View>
              <Item floatingLabel>
                <Label>Package Manager</Label>
                <Input
                  value={this.state.pacManSearchTerm}
                  onChangeText={(val) => this.updateSearch(val, 0)}
                />
              </Item>

              <View style={{flexDirection: 'row', flex: 1}}>
                {this.state.pacManSearchTerm.length >= 2 ? (
                  <View style={{flex: 0.5}}>
                    {filteredPacMan.map((person) => {
                      return (
                        <TouchableOpacity
                          type="button"
                          onPress={() => this.addPacMan(person)}
                          key={person.id}
                          style={styles.peopleButtons}>
                          <Text style={{color: 'white'}}>
                            {person.name}&nbsp;{person.surname}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{flex: 0.5}}></View>
                )}
                <View style={{flex: 0.5}}>
                  {this.state.pacManList.map((person) => {
                    return (
                      <TouchableOpacity
                        type="button"
                        onPress={() => this.removeAssignedPerson(person, 0)}
                        key={person.id}
                        style={styles.selectedPeopleButtons}>
                        <Text>
                          {person.name}&nbsp;{person.surname}
                        </Text>
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
              <View style={{flexDirection: 'row', flex: 1}}>
                {this.state.resPersonSearchTerm.length >= 2 ? (
                  <View style={{flex: 0.5}}>
                    {filteredResPerson.map((person) => {
                      return (
                        <TouchableOpacity
                          type="button"
                          onPress={() => this.addResPerson(person)}
                          key={person.id}
                          style={styles.peopleButtons}>
                          <Text style={{color: 'white'}}>
                            {person.name}&nbsp;{person.surname}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{flex: 0.5}}></View>
                )}
                <View style={{flex: 0.5}}>
                  {this.state.resPersonList.map((person) => {
                    return (
                      <TouchableOpacity
                        type="button"
                        onPress={() => this.removeAssignedPerson(person, 1)}
                        key={person.id}
                        style={styles.selectedPeopleButtons}>
                        <Text>
                          {person.name}&nbsp;{person.surname}
                        </Text>
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
              <View style={{flexDirection: 'row', flex: 1}}>
                {this.state.resourcesSearchTerm.length >= 2 ? (
                  <View style={{flex: 0.5}}>
                    {filteredResources.map((person) => {
                      return (
                        <TouchableOpacity
                          type="button"
                          onPress={() => this.addResource(person)}
                          key={person.id}
                          style={styles.peopleButtons}>
                          <Text style={{color: 'white'}}>
                            {person.name}&nbsp;{person.surname}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{flex: 0.5}}></View>
                )}
                <View style={{flex: 0.5}}>
                  {this.state.resourcesList.map((person) => {
                    return (
                      <TouchableOpacity
                        type="button"
                        onPress={() => this.removeAssignedPerson(person, 2)}
                        key={person.id}
                        style={styles.selectedPeopleButtons}>
                        <Text>
                          {person.name}&nbsp;{person.surname}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Form>
            {this.state.dateTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  new Date(
                    new Date(this.state.dateTimeType.value).getTime() +
                      new Date().getTimezoneOffset() * 60 * 1000,
                  )
                }
                mode={this.state.dateTimeType.type}
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) =>
                  this.handleDateTimeSelect(
                    event,
                    selectedDate,
                    this.state.dateTimeType,
                  )
                }
              />
            )}
          </ScrollView>
          <View styles={{padding: 20}}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.handleSubmit}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )
    :
      (
        <React.Fragment>
          <ScrollView style={{height: 650}}>
            <Form>
              <Text style={{color: 'red', alignSelf: 'center'}}>
                {this.state.error}
              </Text>
              <Item floatingLabel disabled>
                <Label>Name of Task</Label>
                <Input
                  value={this.state.name}
                  onChangeText={() => {}}
                  onEndEditing={() => {}}
                />
              </Item>
              <Item floatingLabel disabled>
                <Label>Description of Task</Label>
                <Input
                  value={this.state.description}
                  onChangeText={() => {}}
                />
              </Item>
              <View style={{flex: 1, marginBottom: 15}}>
                <Text style={styles.text}>{String(this.state.progress)}</Text>
                <Slider
                  step={1}
                  maximumValue={100}
                  value={this.state.progress}
                  onValueChange={(value) => {
                    if (parseInt(value) === 100) {
                      this.setState({issue: false});
                    }
                    this.setState({progress: value});
                    this.value = this.state.progress;
                  }}
                />
              </View>

              <View
                style={
                  (styles.modalText,
                  {
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 20,
                    paddingLeft: 24,
                  })
                }>
                <Text style={{alignItems: 'flex-start', fontSize: 16}}>
                  There is an issue with this task:{' '}
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={this.state.issue ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    if (parseInt(this.state.progress) === 100) {
                      this.setState({
                        error:
                          'You cannot specify that a complete task has an issue.',
                        issue: false,
                      });
                      this.value = false;
                    } else {
                      this.setState({issue: value});
                      this.value = this.state.issue;
                    }
                  }}
                  value={this.state.issue}
                  style={{alignItems: 'flex-end'}}
                />
              </View>
            </Form>
          </ScrollView>
          <View styles={{padding: 20}}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.handleSubmit}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )
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
    height: '100%',
    width: 350,
  },
  hideButton: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    marginBottom: 20,
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
  },
});

export default UpdateTask;
