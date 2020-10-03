
import React, {Component} from 'react';
import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Label, Form, Item, Input, Icon} from 'native-base';

class JoinProject extends Component {
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
        <JoinProjectModal
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          user={this.props.user}
        />

        <View style={{padding: 5, paddingTop: 15}}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              this.setModalVisible(true);
              this.props.setDrawerVisible(false);
            }}>
            <Text style={{color: '#fff'}}>Join Project</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

class JoinProjectModal extends Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flex:2}}>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => this.props.setModalVisible(false)}>
                <Icon type="FontAwesome" name="close" />
              </TouchableOpacity>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, color: '#184D47'}}>
                  Join Project
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

            <View style={{flex:4}}>
              <JoinProjectForm setModalVisible={this.props.setModalVisible} user={this.props.user}/>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

class JoinProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = { code:"" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    if(this.state.code === null){
        alert("The code entered is invalid");
        return;
    }

    let data = JSON.stringify({userId: this.props.user.id , accessCode: this.state.code });

    const response = await fetch(
      'http://projecttree.herokuapp.com/project/joinproject',
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
    if(body.response !== "okay"){
      alert(body.response);
    }

    else{
      this.props.setModalVisible(false);
    }
  }

  render() {
    return (
      <React.Fragment>
        <View style={{flex:2}}>
          <Form>
            <Item floatingLabel>
              <Label>Access Code</Label>
              <Input
                onChangeText={(val) => this.setState({code:val})}
              />
            </Item>
          </Form>
        </View>
        <View style={{flex:1}}>
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
    height: 220,
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

export default JoinProject;
