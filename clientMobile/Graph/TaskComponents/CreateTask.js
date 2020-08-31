import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
          projectID={this.props.projectID}
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
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
              projectID={this.props.projectID}
              setModalVisible={this.props.setModalVisible}
              getProjectInfo={this.props.getProjectInfo}
              setProjectInfo={this.props.setProjectInfo}
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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDateSelect = this.handleStartDateSelect.bind(this);
    this.handleDuration = this.handleDuration.bind(this);
    this.formatValidateInput = this.formatValidateInput.bind(this);
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
      ct_pid: this.props.projectID,
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
    this.props.setModalVisible(false);
    this.props.setProjectInfo(body.nodes, body.rels);
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
    return (
      <View>
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
      </View>
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
    height: 500,
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
});

export default CreateTask;
