import React, {Component} from 'react';
import {
  Text, 
  View, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {Label, Form, Item, Input, Icon} from 'native-base';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';
import ms from 'ms';

class CreateProject extends Component {
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
        <CreateProjectModal
          token={this.props.token}
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          setProjectInfo={this.props.setProjectInfo}
          setCurrentProject={this.props.setCurrentProject}
        />

        <View style={{padding: 5, paddingTop: 15}}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              this.setModalVisible(true);
              this.props.setDrawerVisible(false);
            }}>
            <Text style={{color: '#fff'}}>Create Project</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

class CreateProjectModal extends Component {
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
              <Text style={{fontSize: 25, color: '#184D47'}}>
                Create Project
              </Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '60%',
                  marginBottom: 10,
                }}></View>
            </View>
            <CreateProjectForm
              token={this.props.token}
              setProjectInfo={this.props.setProjectInfo}
              setModalVisible={this.props.setModalVisible}
              setCurrentProject={this.props.setCurrentProject}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

class CreateProjectForm extends Component {
  constructor(props) {
    super(props);
    let now = new Date();
    now.setTime(now.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    now = now.toISOString().substring(0, 16);
    this.state = {
      projName: null,
      projDescription: null,
      tableFormData: ['', '', '', '', '', '', '', '', ''],
      startDate: now,
      endDate: now,
      error: null,
    };
    this.handleDateTimeSelect = this.handleDateTimeSelect.bind(this);
    this.setElementClicked = this.setElementClicked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      if (this.state.endDate < date)
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

  setElementClicked(index) {
    let array = this.state.tableFormData;
    array[index] === '' ? (array[index] = 'x') : (array[index] = '');
    this.setState({tableFormData: array});
  }

  async handleSubmit() {
    if (this.checkFormData('all') === false) return;

    this.props.setModalVisible(false);

    let permissions = this.state.tableFormData;
    for (var count = 0; count < 9; count++) {
      permissions[count] == 'x'
        ? (permissions[count] = true)
        : (permissions[count] = undefined);
    }

    let data = {
      token: this.props.token,
      cp_Name: this.state.projName,
      cp_Description: this.state.projDescription,
      cp_StartDate: this.state.startDate.substring(0,10),
      cp_StartTime: this.state.startDate.substring(11,16),
      cp_EndDate: this.state.endDate.substring(0,10),
      cp_EndTime: this.state.endDate.substring(11,16),
      cp_pm_Create: permissions[0],
      cp_pm_Delete: permissions[1],
      cp_pm_Update: permissions[2],
      cp_rp_Create: permissions[3],
      cp_rp_Delete: permissions[4],
      cp_rp_Update: permissions[5],
      cp_r_Create: permissions[6],
      cp_r_Delete: permissions[7],
      cp_r_Update: permissions[8],
    };

    data = JSON.stringify(data);

    const response = await fetch(
      'http://10.0.2.2:5000/project/add',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      },
    );

    const body = await response.json();
    this.props.setProjectInfo(body);
  }

  checkFormData(check) {
    if (check === 'name' || check === 'all') {
      let name = this.state.projName;
      if (name === null || !name.trim().length) {
        this.setState({error: 'Please enter a project name'});
        return false;
      } else {
        this.setState({error: null});
      }
    }

    if (check === 'description' || check === 'all') {
      if (this.state.error !== null) {
        return false;
      }
      let description = this.state.projDescription;
      if (description === null || !description.trim().length) {
        this.setState({error: 'Please enter a project description'});
        return false;
      } else {
        this.setState({error: null});
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <ScrollView style={{height: 650}}>
          <Form>
            <Text style={{color: 'red', alignSelf: 'center'}}>
              {this.state.error}
            </Text>
            <Item floatingLabel>
              <Label>Name of project</Label>
              <Input
                onChangeText={(val) => this.setState({projName: val})}
                onEndEditing={() => this.checkFormData('name')}
              />
            </Item>
            <Item floatingLabel>
              <Label>Description of project</Label>
              <Input
                onChangeText={(val) => this.setState({projDescription: val})}
                onEndEditing={() => this.checkFormData('description')}
              />
            </Item>
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
          </Form>
        </ScrollView>
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
        <PermissionsTable
          tableFormData={this.state.tableFormData}
          setElementClicked={this.setElementClicked}
        />
        <View styles={{padding: 10}}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleSubmit}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

class PermissionsTable extends Component {
  render() {
    const elementButton = (value, index) => (
      <TouchableOpacity onPress={() => this.props.setElementClicked(index)}>
        <View style={styles.btn}>
          <Text style={styles.text}>{value}</Text>
        </View>
      </TouchableOpacity>
    );

    let tableHead = ['', 'Create', 'Delete', 'Update'];
    let tableData = [
      [
        'Package Managers',
        elementButton(this.props.tableFormData[0], 0),
        elementButton(this.props.tableFormData[1], 1),
        elementButton(this.props.tableFormData[2], 2),
      ],
      [
        'Responsible Persons',
        elementButton(this.props.tableFormData[3], 3),
        elementButton(this.props.tableFormData[4], 4),
        elementButton(this.props.tableFormData[5], 5),
      ],
      [
        'Resources',
        elementButton(this.props.tableFormData[6], 6),
        elementButton(this.props.tableFormData[7], 7),
        elementButton(this.props.tableFormData[8], 8),
      ],
    ];

    return (
      <View style={styles.container}>
        <Table borderStyle={{borderWidth: 1}}>
          <Row
            data={tableHead}
            flexArr={[2, 1, 1, 1]}
            style={styles.head}
            textStyle={styles.text}
          />
          <TableWrapper style={styles.wrapper}>
            <Rows
              data={tableData}
              flexArr={[2, 1, 1, 1]}
              style={styles.row}
              textStyle={styles.text}
            />
          </TableWrapper>
        </Table>
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#96BB7C',
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
  createButton: {
    backgroundColor: '#184D47',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderColor: '#EEBB4D',
    borderWidth: 2,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    margin: 0,
  },
  whiteText: {
    color: '#fff',
  },
  blackText: {
    color: '#000',
  },
  hideButton: {
    flex: 0.15,
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
});

export default CreateProject;
