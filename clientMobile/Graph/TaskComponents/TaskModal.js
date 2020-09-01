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
  Icon
} from 'native-base';
import * as Progress from 'react-native-progress';
import DeleteTask from './DeleteTask';
import UpdateTask from './UpdateTask';
import UpdateProgress from '../UpdateProgress';
import SendTaskNotification from '../../NoticeBoard/TaskWideNotification'

let taskPacMans = null;
let taskResPersons = null;
let taskResources = null;

class TaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTaskModal: true,
      displayUpdateModal: false,
      displayProgressModal: false,
    };
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.toggleProgressModal = this.toggleProgressModal.bind(this);
    this.classifyExistingUsers = this.classifyExistingUsers.bind(this);
  }

  toggleVisibility(taskModal, updateModal, selectedTask) {
    if (selectedTask !== undefined) {
      this.setState({
        displayTaskModal: taskModal,
        displayUpdateModal: updateModal,
      });
      this.props.displayTaskDependency(null, null);
    }

    this.setState({
      displayTaskModal: taskModal,
      displayUpdateModal: updateModal,
    });
  }

  toggleProgressModal(taskModal, progressModal) {
    this.setState({
      displayTaskModal: taskModal,
      displayProgressModal: progressModal,
    });
  }

  classifyExistingUsers() {
    let taskUsers = [];
    let taskPacMans = [];
    let taskResPersons = [];
    let taskResources = [];

    // Get the users that are part of the selected task
    for(let x = 0; x < this.props.assignedProjUsers.length; x++){
      if(this.props.assignedProjUsers[x][1].end === this.props.selectedTask.id){
        taskUsers.push(this.props.assignedProjUsers[x])
      }
    }

    // Assign users to their respective roles by putting them in arrays
    for (let x = 0; x < taskUsers.length; x++) {
      if (taskUsers[x][1].type === "PACKAGE_MANAGER") {
        taskPacMans.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === "RESPONSIBLE_PERSON") {
        taskResPersons.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === "RESOURCE") {
        taskResources.push(taskUsers[x][0]);
      }
    }

    taskUsers = [];
    taskUsers.push(taskPacMans);
    taskUsers.push(taskResPersons);
    taskUsers.push(taskResources);

    return taskUsers;
  }

  printUsers(people) {
    let list = [];
    for (let x = 0; x < people.length; x++) {
      list.push(
        <Text key={people[x].id} style={styles.personText}>
          {people[x].name}&nbsp;{people[x].surname}
        </Text>
      );
    }
    return list;
  }

  render() {
    if (this.props.selectedTask === null || this.props.assignedProjUsers === null) return null;

    let taskUsers = this.classifyExistingUsers();
    taskPacMans = taskUsers[0];
    taskResPersons = taskUsers[1];
    taskResources = taskUsers[2];

    let color = 'green';
    if (this.props.selectedTask.progress < 33) color = 'red';
    else if (this.props.selectedTask.progress < 66) color = '#EEBB4D';

    return (
      <React.Fragment>
        <UpdateTask
          task={this.props.selectedTask}
          modalVisibility={this.state.displayUpdateModal}
          toggleVisibility={this.toggleVisibility}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
          displayTaskDependency={this.props.displayTaskDependency}
          project={this.props.project}
          pacMans={taskPacMans}
          resPersons={taskResPersons}
          resources={taskResources}
          allUsers={this.props.allUsers}
          assignedProjUsers={this.props.assignedProjUsers}
        />
        <UpdateProgress
          project={this.props.project}
          task={this.props.selectedTask}
          modalVisibility={this.state.displayProgressModal}
          toggleProgressModal={this.toggleProgressModal}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.displayTaskModal}
          onRequestClose={() => this.props.displayTaskDependency(null, null)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.displayTaskDependency(null, null)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 30, color: '#184D47'}}>
                  {this.props.selectedTask.name}
                </Text>
                <View
                  style={{
                    backgroundColor: '#EEBB4D',
                    height: 1,
                    width: '60%',
                    marginBottom: 10,
                  }}></View>
              </View>
              <ScrollView style={{height:200}}>
                <Progress.Bar
                  progress={this.props.selectedTask.progress/100}
                  
                  showsText={true}
                  formatText={() => {
                    return `${this.props.selectedTask.progress}%`;
                  }}
                  color={color}
                />
                <Text style={styles.modalText}>
                  {this.props.selectedTask.description}
                </Text>
                <Text style={styles.modalText}>
                  Start Date:{' '}
                  {this.props.selectedTask.startDate.year.low +
                    '-' +
                    this.props.selectedTask.startDate.month.low +
                    '-' +
                    this.props.selectedTask.startDate.day.low}
                </Text>
                <Text style={styles.modalText}>
                  End Date:{' '}
                  {this.props.selectedTask.endDate.year.low +
                    '-' +
                    this.props.selectedTask.endDate.month.low +
                    '-' +
                    this.props.selectedTask.endDate.day.low}
                </Text>
                <Text style={styles.modalText}>
                  Duration: {this.props.selectedTask.duration} days
                </Text>
                <Text style={styles.roleText}>Package managers:</Text>
                {this.printUsers(taskPacMans)}
                <Text style={styles.roleText}>Responsible persons:</Text>
                {this.printUsers(taskResPersons)}
                <Text style={styles.roleText}>Resources:</Text>
                {this.printUsers(taskResources)}
              </ScrollView>
              
              <View style={{flex: 1}}>
                {this.props.userPermissions["update"] === true?
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => this.toggleVisibility(false, true)}>
                      <Icon type="AntDesign" name="edit" style={{color: 'white'}}>
                        <Text>&nbsp;Edit</Text>
                      </Icon>
                    </TouchableOpacity>
                  </View>
                :
                  null
                }

                {this.props.userPermissions["delete"] === true?
                  <View style={{flex: 1}}>
                    <DeleteTask
                      task={this.props.selectedTask}
                      toggleVisibility={this.toggleVisibility}
                      getProjectInfo={this.props.getProjectInfo}
                      setProjectInfo={this.props.setProjectInfo}
                    />
                  </View>
                :
                  null
                }

                {this.props.userPermissions["update"] === true?
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => this.toggleProgressModal(false, true)}>
                      <Icon
                        type="Entypo"
                        name="progress-one"
                        style={{color: 'white', paddingBottom: 10}}>
                        <Text>&nbsp;Update Progress</Text>
                      </Icon>
                    </TouchableOpacity>
                  </View>
                :
                  null
                }
                <View style={{flex: 1}}>
                  <SendTaskNotification
                    project={this.props.project}
                    user={this.props.user}
                    task={this.props.selectedTask}
                    user={this.props.user}
                    taskPacMans={taskPacMans}
                    taskResPersons={taskResPersons}
                    taskResources={taskResources}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </React.Fragment>
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
    height: 650,
    width: 350,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  roleText: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  personText: {
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  hideButton: {
    flex: 0.15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  editButton: {
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
  container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
  head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40},
  text: {margin: 6, textAlign: 'center'},
});

export default TaskModal;
