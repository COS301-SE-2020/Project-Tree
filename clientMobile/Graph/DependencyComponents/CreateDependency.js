import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Icon,
  Label,
  Form,
  Item,
  Input,
} from 'native-base';
import {ButtonGroup} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import ms from "ms";

class CreateDependency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDependencyVisibility: false,
      source: null,
      target: null,
    };
    this.setCreateDependencyVisibility = this.setCreateDependencyVisibility.bind(
      this,
    );
    this.handleCreateDependency = this.handleCreateDependency.bind(this);
  }

  setCreateDependencyVisibility(visible) {
    this.setState({createDependencyVisibility: visible});
  }

  recDepCheck(curr, target) {
    for (let i = 0; i < this.props.links.length; i++) {
      const el = this.props.links[i];
      if (el.source === curr) {
        if (target === el.target) return true;
        return this.recDepCheck(el.target, target);
      }
    }
    return false;
  }

  handleCreateDependency() {
    if (
      this.props.sourceCreateDependency === null ||
      this.props.targetCreateDependency === null
    ) {
      return;
    }

    if ( this.recDepCheck(this.props.targetCreateDependency, this.props.sourceCreateDependency) === true) {
      alert('A task cannot be directly or indirectly dependent on itself');
      this.props.setCreateDependency(null);
      return;
    }

    this.setState({
      source: this.props.sourceCreateDependency,
      target: this.props.targetCreateDependency,
    });
    this.setCreateDependencyVisibility(true);
    this.props.setCreateDependency(null);
  }

  render() {
    return (
      <React.Fragment>
        <CreateDependencyModal
          createDependencyVisibility={this.state.createDependencyVisibility}
          setCreateDependencyVisibility={this.setCreateDependencyVisibility}
          name={
            this.props.getName(this.state.source) +
            '→' +
            this.props.getName(this.state.target)
          }
          source={this.state.source}
          target={this.state.target}
          projID={this.props.projID}
          getProjectInfo={this.props.getProjectInfo}
          setProjectInfo={this.props.setProjectInfo}
        />

        {this.props.sourceCreateDependency !== null ? (
          <React.Fragment>
            <TouchableOpacity
              onPress={this.handleCreateDependency}
              style={styles.CreateDependencyBtn}>
              <Text>
                {this.props.getName(this.props.sourceCreateDependency) +
                  '→' +
                  (this.props.getName(this.props.targetCreateDependency) ===
                  null
                    ? ''
                    : this.props.getName(this.props.targetCreateDependency))}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.setCreateDependency(null)}
              style={styles.ClearDependencyBtn}>
              <Icon type="MaterialIcons" name="clear" />
            </TouchableOpacity>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

class CreateDependencyModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.createDependencyVisibility}
        onRequestClose={() => this.props.setCreateDependencyVisibility(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.setCreateDependencyVisibility(false)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
            </View>

            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>
                Create Dependency
              </Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '80%',
                  marginBottom: 10,
                }}></View>
            </View>

            <View style={{flex: 5}}>
              <CreateDependencyForm
                setCreateDependencyVisibility={
                  this.props.setCreateDependencyVisibility
                }
                getProjectInfo={this.props.getProjectInfo}
                setProjectInfo={this.props.setProjectInfo}
                name={this.props.name}
                source={this.props.source}
                target={this.props.target}
                projID={this.props.projID}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

class CreateDependencyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      relationshipType: "ss",
      source: this.props.source,
      target: this.props.target,
      selectedIndex: 0,
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
      this.setState({selectedIndex: 0, dependencyRelationship: 'ss'});
    } else {
      this.setState({selectedIndex: 1, dependencyRelationship: 'fs'});
    }
  }

  formatValidateInput() {
    let data = {
      projId: this.props.projID,
      fid: this.props.source,
      sid: this.props.target,
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
      'http://10.0.2.2:5000/dependency/add',
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
    this.props.setCreateDependencyVisibility(false);
    this.props.setProjectInfo(body.nodes, body.rels);
  }

  checkFormData(){
    let duration = this.state.dependencyDuration;
    if(!(duration.toString()).trim().length){
      this.setState({error: "Please enter a duration for your dependency"});
      return false;
    }
  }

  render() {
    const component1 = () => <Text>Start→Start</Text>;
    const component2 = () => <Text>Finish→Start</Text>;
    const buttons = [{element: component1}, {element: component2}];

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.modalText}>{this.props.name}</Text>
        </View>
        <View style={{flex: 1}}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
            containerStyle={{height: 40}}
            selectedButtonStyle={{backgroundColor: '#EEBB4D'}}
          />
        </View>
        <View style={{flex: 1, marginBottom:10}}>
          <Form>
            <Text style={{color:'red', alignSelf:'center'}}>{this.state.error}</Text>
            <Item floatingLabel>
              <Label>Duration (Days)</Label>
              <Input
                value={this.state.dependencyDuration.toString()}
                onEndEditing={()=>this.checkFormData("duration")}
                onChangeText={(val) => this.setState({dependencyDuration: val})}
              />
            </Item>
          </Form>
        </View>
        <View styles={{flex: 1}}>
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
    height: 400,
    width: 350,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
  CreateDependencyBtn: {
    height: 50,
    //width: 200,
    borderRadius: 5,
    borderColor: 'green',
    borderWidth: 3,
    position: 'absolute',
    bottom: 72,
    left: 210,
    right: 74,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  ClearDependencyBtn: {
    height: 50,
    width: 50,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'red',
    position: 'absolute',
    bottom: 72,
    justifyContent: 'center',
    left: 145,
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  container: {flex: 1, paddingTop: 30, backgroundColor: '#fff', width: '100%'},
  head: {height: 40, backgroundColor: '#f1f8ff', width: 200},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40},
  text: {margin: 6, textAlign: 'center'},
});

export default CreateDependency;
