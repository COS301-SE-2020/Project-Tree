import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableHighlight,
  Modal,
} from 'react-native';
import {Icon, Form, Item, Textarea} from 'native-base';
import sendNotification from './sendNotification';
import {ButtonGroup} from 'react-native-elements';

export default class SendProjectWideNotificationWrapper extends Component {
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
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={styles.editButton}>
          <Icon
            type="AntDesign"
            name="notification"
            style={{color: 'white'}}></Icon>
        </TouchableHighlight>
        <SendNotificationModal
          project={this.props.project}
          user={this.props.user}
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          type={'project'}
        />
      </React.Fragment>
    );
  }
}

class SendNotificationModal extends Component {
  constructor(props) {
    super(props);
  }

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
            <View
              style={{alignItems: 'center', marginTop: 10, marginBottom: 20}}>
              <Text style={{fontSize: 25, color: '#184D47'}}>
                Project Wide Notification
              </Text>
              <View
                style={{
                  backgroundColor: '#EEBB4D',
                  height: 1,
                  width: '90%',
                  marginBottom: 10,
                }}></View>
            </View>
            <SendNotificationForm
              setModalVisible={this.props.setModalVisible}
              project={this.props.project}
              user={this.props.user}
              type={this.props.type}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

class SendNotificationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {message: null, mode: 0};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({mode: selectedIndex});
  }

  async handleSubmit() {
    if (this.state.message === '' || this.state.message === null) {
      alert('You have not entered a notification message');
      return;
    }

    var timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 2);
    console.log(this.props.user.id)
    await sendNotification(
      this.props.type,
      this.props.user.name + ' ' + this.props.user.sname,
      [],
      timestamp,
      this.state.message,
      undefined,
      this.props.project.name,
      this.props.project.id,
      this.state.mode,
      this.props.user.id
    );
    this.props.setModalVisible(false);
  }

  render() {
    const component1 = () => <Text>Email</Text>;
    const component2 = () => <Text>Notice Board</Text>;
    const component3 = () => <Text>Both</Text>;
    const buttons = [
      {element: component1},
      {element: component2},
      {element: component3},
    ];

    return (
      <React.Fragment>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Form>
              <Item>
                <Textarea
                  rowSpan={3}
                  placeholder="Notification"
                  bordered={true}
                  style={{width: '100%'}}
                  onChangeText={(val) => this.setState({message: val})}
                />
              </Item>
            </Form>
          </View>

          <View style={{flex: 1}}>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.mode}
              buttons={buttons}
              containerStyle={{height: 50}}
              selectedButtonStyle={{backgroundColor: '#EEBB4D'}}
            />
          </View>

          <View styles={{flex: 1}}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.handleSubmit}>
              <Text style={{color: 'white'}}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    height: 400,
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
  editButton: {
    backgroundColor: '#184D47',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: '25%',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});
