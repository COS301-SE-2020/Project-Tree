import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {Icon} from 'native-base';
import * as Progress from 'react-native-progress';
import DeleteTask from './DeleteTask';
import UpdateTask from './UpdateTask';
import CloneTask from './CloneTask';
import SendTaskNotification from '../../NoticeBoard/TaskWideNotification';
import ms from 'ms';

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
    this.updateType = this.updateType.bind(this);
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
    for (let x = 0; x < this.props.assignedProjUsers.length; x++) {
      if (
        this.props.assignedProjUsers[x][1].end === this.props.selectedTask.id
      ) {
        taskUsers.push(this.props.assignedProjUsers[x]);
      }
    }

    // Assign users to their respective roles by putting them in arrays
    for (let x = 0; x < taskUsers.length; x++) {
      if (taskUsers[x][1].type === 'PACKAGE_MANAGER') {
        taskPacMans.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === 'RESPONSIBLE_PERSON') {
        taskResPersons.push(taskUsers[x][0]);
      }
      if (taskUsers[x][1].type === 'RESOURCE') {
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
        </Text>,
      );
    }
    return list;
  }

  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }
  
  updateType(pac, resp, reso){
    if(this.props.userPermissions["update"]) return "update";
    let check = false;
    pac.forEach(person => {
      if (person.id === this.props.user.id) check = true;
    });
    if (check) return "progress";
    resp.forEach(person => {
      if (person.id === this.props.user.id) check = true;
    });
    if (check) return "progress";
    reso.forEach(person => {
      if (person.id === this.props.user.id) check = true;
    });
    if (check) return "progress";
    return "none";
  }

  render() {
    if (
      this.props.selectedTask === null ||
      this.props.assignedProjUsers === null
    )
      return null;

    let taskUsers = this.classifyExistingUsers();
    taskPacMans = taskUsers[0];
    taskResPersons = taskUsers[1];
    taskResources = taskUsers[2];
    
    let updateType = this.updateType(taskPacMans, taskResPersons, taskResources);

    let color = '#0275d8';

    return (
      <React.Fragment>
        <UpdateTask
          updateType={updateType}
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
          rels={this.props.rels}
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
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <Text
                  style={{fontSize: 30, color: '#184D47', textAlign: 'center'}}>
                  {this.props.selectedTask.name}
                  {this.props.clonedNode !== null ? (
                    <Text>{'\n'}(View)</Text>
                  ) : null}
                </Text>
              </View>
              <ScrollView style={{height: 200}}>
                <Text style={styles.modalText}>
                  {this.props.selectedTask.description}
                </Text>
                <Text style={styles.modalText}>
                  Task Id: {this.props.selectedTask.id}
                </Text>
                <Text style={styles.modalText}>
                  Start Date:{' '}
                  {this.props.selectedTask.startDate.replace('T', ' ')}
                </Text>
                <Text style={styles.modalText}>
                  End Date: {this.props.selectedTask.endDate.replace('T', ' ')}
                </Text>
                <Text style={styles.modalText}>
                  Duration:{' '}
                  {this.CalcDiff(
                    this.props.selectedTask.startDate,
                    this.props.selectedTask.endDate,
                  )}
                </Text>
                <View style={{alignItems: 'center'}}>
                  <Progress.Bar
                    progress={this.props.selectedTask.progress / 100}
                    showsText={true}
                    formatText={() => {
                      return `${this.props.selectedTask.progress}%`;
                    }}
                    color={color}
                  />
                </View>
                <Text style={styles.roleText}>Package managers:</Text>
                {this.printUsers(taskPacMans)}
                <Text style={styles.roleText}>Responsible persons:</Text>
                {this.printUsers(taskResPersons)}
                <Text style={styles.roleText}>Resources:</Text>
                {this.printUsers(taskResources)}
              </ScrollView>

              <View>
                <View style={{flexDirection: 'row'}}>
                  {updateType !== "none" ? (
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => this.toggleVisibility(false, true)}>
                        <Icon
                          type="AntDesign"
                          name="edit"
                          style={{color: 'white'}}>
                          <Text>&nbsp;Edit</Text>
                        </Icon>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {this.props.userPermissions['delete'] === true ? (
                    <View style={{flex: 1}}>
                      <DeleteTask
                        task={this.props.selectedTask}
                        clonedNode={this.props.clonedNode}
                        toggleVisibility={this.toggleVisibility}
                        getProjectInfo={this.props.getProjectInfo}
                        setProjectInfo={this.props.setProjectInfo}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={{flexDirection: 'row'}}>
                  {this.props.userPermissions['create'] === true ? (
                    <View style={{flex: 1}}>
                      <CloneTask
                        task={this.props.selectedTask}
                        toggleVisibility={this.toggleVisibility}
                        project={this.props.project}
                        setProjectInfo={this.props.setProjectInfo}
                      />
                    </View>
                  ) : null}
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
    fontWeight: 'bold',
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
