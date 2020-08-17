import React, {Component} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Picker,
  Textarea,
  Tab,
  Tabs,
  TabHeading,
  Label,
  Form,
  Item,
  Input,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  StyleProvider,
} from 'native-base';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';

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
    this.state = {
      projName: null,
      projDescription: null,
      tableFormData: ['', '', '', '', '', '', '', '', ''],
    };
    this.setElementClicked = this.setElementClicked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setElementClicked(index) {
    let array = this.state.tableFormData;
    array[index] === '' ? (array[index] = 'x') : (array[index] = '');
    this.setState({tableFormData: array});
  }

  async handleSubmit() {
    if (this.state.projName == null) {
      alert('Please enter a project name');
      return;
    }

    if (this.state.projDescription == null) {
      alert('Please enter a project description');
      return;
    }

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
      'http://projecttree.herokuapp.com/project/add',
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

  render() {
    return (
      <React.Fragment>
        <Form>
          <Item floatingLabel>
            <Label>Name of project</Label>
            <Input onChangeText={(val) => this.setState({projName: val})} />
          </Item>
          <Item floatingLabel>
            <Label>Description of project</Label>
            <Input
              onChangeText={(val) => this.setState({projDescription: val})}
            />
          </Item>
        </Form>
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
