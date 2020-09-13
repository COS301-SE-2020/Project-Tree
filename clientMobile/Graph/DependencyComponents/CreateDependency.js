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
      source_viewId: null,
      target_viewId: null
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

  alreadyExists(target, source){
    let rels = this.props.links;

    for(var x=0; x<rels.length; x++){
      if(target === rels[x].target && source === rels[x].source) return true;
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

    if ( this.recDepCheck(this.props.targetCreateDependency.id, this.props.sourceCreateDependency.id) === true) {
      alert('A task cannot be directly or indirectly dependent on itself');
      this.props.setCreateDependency(null);
      return;
    }

    if(this.alreadyExists(this.props.targetCreateDependency.id, this.props.sourceCreateDependency.id)){
      alert('A dependency between these nodes already exists');
      this.props.setCreateDependency(null);
      return;
    }

    

    this.setState({
      source: this.props.sourceCreateDependency,
      target: this.props.targetCreateDependency,
      source_viewId: this.props.source_viewId,
      target_viewId: this.props.target_viewId
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
          source={this.state.source}
          target={this.state.target}
          source_viewId={this.state.source_viewId}
          target_viewId={this.state.target_viewId}
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
                {this.props.sourceCreateDependency.name +
                  '→' +
                  (this.props.targetCreateDependency ===
                  null
                    ? ''
                    : this.props.targetCreateDependency.name)}
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
                source_viewId={this.props.source_viewId}
                target_viewId={this.props.target_viewId}
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
    let endDate = this.props.target.startDate;
    if (this.props.source.startDate > endDate)
      endDate = this.props.source.startDate;
    this.state = {
      relationshipType: "ss",
      source: this.props.source,
      target: this.props.target,
      source_viewId:this.props.source_viewId,
      target_viewId:this.props.target_viewId,
      sStartDate: this.props.source.startDate,
      sEndDate: this.props.source.endDate,
      startDate: this.props.source.startDate,
      endDate: endDate,
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
    let date = new Date(new Date(selectedDate).getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substring(0,16);
    if (type.for === 'start') {
        if (this.state.endDate < date) 
          this.setState({
            error: "You can not set the end before the start",
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
          error: "You can not set the end before the start",
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
      projId: this.props.projID,
      fid: this.props.source.id,
      sid: this.props.target.id,
      cd_viewId_source: this.props.source_viewId,
      cd_viewId_target: this.props.target_viewId,
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
  
  CalcDiff(sd, ed) {
    let startDate = new Date(sd);
    startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    let endDate = new Date(ed);
    endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 );
    return ms(endDate.getTime() - startDate.getTime(), {long: true});
  }

  render() {
    const component1 = () => <Text>Start→Start</Text>;
    const component2 = () => <Text>Finish→Start</Text>;
    const buttons = [{element: component1}, {element: component2}];

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.modalText}></Text>
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
                  this.state.sStartDate.replace("T", " ")
                  :
                  this.state.sEndDate.replace("T", " ")
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
        <View styles={{flex: 1}}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleSubmit}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
        {this.state.dateTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(new Date(this.state.dateTimeType.value).getTime() + new Date().getTimezoneOffset()*60*1000)}
            mode={this.state.dateTimeType.type}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => this.handleDateTimeSelect(event, selectedDate, this.state.dateTimeType)}
          />
        )}
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
