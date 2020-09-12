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
import {ButtonGroup} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ms from "ms";

class UpdateDependency extends Component {
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
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.toggleVisibility(true, false)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, color: '#184D47'}}>
                  Edit Dependency
                </Text>
                <View
                  style={{
                    backgroundColor: '#EEBB4D',
                    height: 1,
                    width: '60%',
                    marginBottom: 10,
                  }}></View>
              </View>
            </View>

            <View style={{flex: 6}}>
              <UpdateDependencyForm
                dependency={this.props.dependency}
                toggleVisibility={this.props.toggleVisibility}
                getProjectInfo={this.props.getProjectInfo}
                setProjectInfo={this.props.setProjectInfo}
                displayTaskDependency={this.props.displayTaskDependency}
                name={this.props.name}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

class UpdateDependencyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      relationshipType: this.props.dependency.relationshipType,
      sStartDate: this.props.dependency.sStartDate,
      sEndDate: this.props.dependency.sEndDate,
      startDate: this.props.dependency.startDate,
      endDate: this.props.dependency.endDate,
      selectedIndex: this.props.dependency.relationshipType === 'ss' ? 0 : 1,
      error: null,
      dateTimePicker: false,
      dateTimeType: { type: 'date', for: 'start', value: new Date() },
    };

    this.handleDateTimeSelect = this.handleDateTimeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatValidateInput = this.formatValidateInput.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  handleDateTimeSelect(event, selectedDate, type) {
    if(event.type === 'dismissed') {
      this.setState({dateTimePicker: false});
      return;
    }
    let date = new Date(selectedDate).toISOString().substring(0,16);
    if (type.for === 'start') {
        if (this.state.endDate < date) 
          this.setState({
            error: "you can not set the end before the start",
            startDate: date, 
            endDate: date, 
            dateTimePicker: false
          });
        else
        this.setState({
          error: null,
          startDate: date, 
          dateTimePicker: false
        });
    } else {
      if (this.state.startDate > date) 
        this.setState({
          error: "you can not set the end before the start",
          endDate: this.state.startDate, 
          dateTimePicker: false
        });
      else
      this.setState({
        error: null,
        endDate: date, 
        dateTimePicker: false
      });
    }
  }

  updateIndex(selectedIndex) {
    if (selectedIndex == 0) {
      this.setState({selectedIndex: 0, relationshipType: 'ss'});
      this.handleDateTimeSelect({}, this.state.sStartDate, {for:"start"});
    } else {
      this.setState({selectedIndex: 1, relationshipType: 'fs'});
      this.handleDateTimeSelect({}, this.state.sEndDate, {for:"start"});
    }
  }

  formatValidateInput() {

    let data = {
      id: this.props.dependency.id,
      relationshipType: this.state.relationshipType,
      sStartDate: this.state.sStartDate,
      sEndDate: this.state.sEndDate,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    return data;
  }

  async handleSubmit() {
    let input = this.formatValidateInput();
    if (input === null) return;

    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = input;
    projectData = JSON.stringify(projectData);

    const response = await fetch(
      'http://10.0.2.2:5000/dependency/update',
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
    this.props.toggleVisibility(true, false);
    this.props.displayTaskDependency(null, null);
    this.props.setProjectInfo(body.nodes, body.rels);
  }
  
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    let endDate = new Date(ed);
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    const component1 = () => <Text>Start→Start</Text>;
    const component2 = () => <Text>Finish→Start</Text>;
    const buttons = [{element: component1}, {element: component2}];

    return (
      <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        <View style={{flex: 1}}>
          <Text style={styles.modalText}>{this.props.name}</Text>
        </View>
        <View style={{flex: 1}}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
            containerStyle={{height: 50}}
            selectedButtonStyle={{backgroundColor: '#EEBB4D'}}
          />
        </View>
        <View style={{flex: 1, marginBottom:20}}>
          <Form>
            <Text style={{color:'red', alignSelf:'center'}}>{this.state.error}</Text>
            <Item floatingLabel disabled>
              <Label>
              {
                this.state.relationshipType === 'ss'?
                  "Start Date and Time of First Task"
                  :
                  "End Date and Time of First Task"
              }
              </Label>
              <Input value={
                this.state.relationshipType === 'ss'?
                  this.state.sStartDate 
                  :
                  this.state.sEndDate
                } />
            </Item>
            <Item floatingLabel disabled>
              <Label>Start Date of Second Task</Label>
              <Input value={this.state.endDate.substring(0, 10)} />
              <Icon
                type="AntDesign"
                name="plus"
                onPress={() => {
                  this.setState({
                    dateTimePicker: true, 
                    dateTimeType: { 
                      type: 'date', 
                      for: 'end',
                      value: this.state.endDate,
                    }
                  });
                }}
              />
            </Item>
            <Item floatingLabel disabled>
              <Label>Start Time of Second Task</Label>
              <Input value={this.state.endDate.substring(11, 16)} />
              <Icon
                type="AntDesign"
                name="plus"
                onPress={() => {
                  this.setState({
                    dateTimePicker: true, 
                    dateTimeType: { 
                      type: 'time', 
                      for: 'end',
                      value: this.state.endDate,
                    }
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
          </Form>
        </View>
        {this.state.dateTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(this.state.dateTimeType.value)}
            mode={this.state.dateTimeType.type}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => this.handleDateTimeSelect(event, selectedDate, this.state.dateTimeType)}
          />
        )}
        <View style={{flex: 1}}>
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
    height: 410,
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
    textAlign: 'center',
    fontSize: 18,
  },
  container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
  head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40},
  text: {margin: 6, textAlign: 'center'},
});

export default UpdateDependency;
