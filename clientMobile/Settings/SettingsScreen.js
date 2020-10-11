import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  Modal
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';


let global_pfp = "";
const axios = require('axios').default;

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {pfp: 'https://i.ibb.co/MRpbpHN/default.png',  modalVisible: false, token:''};

    this.setModalVisible = this.setModalVisible.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.choosePhotoFromLibrary = this.choosePhotoFromLibrary.bind(this);
    this.fileChange = this.fileChange.bind(this);
  }

  async setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async componentDidMount() {
    let token = null;
    await AsyncStorage.getItem('sessionToken').then(async (value) => {
      token = JSON.parse(value);
      this.setState({token: token});
      const response = await fetch(
        'http://projecttree.herokuapp.com/user/get',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({token: token}),
        },
      );
      const body = await response.json();
      if (body.user.profilepicture !== 'undefined') {
        this.setState({
          pfp: body.user.profilepicture,
        });
      }
    });
  }

  deleteUser() 
  {
    let tok = this.state.token
    let data = {
      token: tok,
    }
    data = JSON.stringify(data)
     const res =  fetch(
      'http://10.0.2.2:5000/user/delete',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data
      },
    )  
    this.props.handleLogout();
    console.log("HELLO")
  }

  choosePhotoFromLibrary(){
    console.log(this.state.token)
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true
    }).then(image => {
      this.fileChange(image);
    });
    console.log("hi")
  }

  async fileChange(file) 
  {
    let tok = this.state.token
    let body = new FormData()
    body.append('image', file.data)
    await axios({
      method: 'post',
      url: 'https://api.imgbb.com/1/upload?key=0a77a57b5cf30dc09fd33f608fcb318c',
      timeout: 0,
      processData: false,
      mimeType: "multipart/form-data",
      contentType: false,
      data: body
    }) .then(function (response) {
      let x = (response.data.data.url)
      global_pfp= (response.data.data.url)
      let data = {
        token: tok,
        profilepicture: x
      }
      data = JSON.stringify(data)

       const res =  fetch(
        'http://10.0.2.2:5000/user/change',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: data
        },
      )
    })
    .catch(function (error) {
      console.log(error)
    })
    this.setState({pfp: global_pfp})
  }

  hideModal() 
  {
    this.setState({ show: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#96BB7C" barStyle="light-content" />
        <View style={styles.header}>
        <TouchableOpacity
              onPress={() => {
                this.choosePhotoFromLibrary();
              }}>
          <Image style={styles.logo} source={{uri: this.state.pfp}} /></TouchableOpacity>
          <Text style={styles.text_header}>User Details</Text>
        </View>
        <Animatable.View
          animation="rubberBand"
          style={[
            styles.footer,
            {
              backgroundColor: 'white',
              marginBottom: 40,
            },
          ]}>
            <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.deleteUser();
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#184D47',
                  borderWidth: 2,
                  marginTop: 10,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#008656',
                  },
                ]}>
                Delete User
              </Text>
            </TouchableOpacity>
          </View>  
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.choosePhotoFromLibrary();
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#184D47',
                  borderWidth: 2,
                  marginTop: 50,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#008656',
                  },
                ]}>
                Change Profile Picture
              </Text>
            </TouchableOpacity>
          </View>  
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.props.userScreen(true);
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#184D47',
                  borderWidth: 2,
                  marginTop: 10,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#008656',
                  },
                ]}>
                Edit User Details
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.props.handleLogout();
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#184D47',
                  borderWidth: 2,
                  marginTop: 10,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#008656',
                  },
                ]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View> 
          {/* <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={styles.hideButton}
                    onPress={() => this.setModalVisible(false)}>
                    <Icon type="FontAwesome" name="close" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.choosePhotoFromLibrary();
                    }}
                    style={[
                      styles.signIn,
                      {
                        borderColor: '#184D47',
                        borderWidth: 2,
                        marginTop: 20,
                      },
                    ]}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#008656',
                    },
                  ]}>
                  Open Gallery
                </Text>
            </TouchableOpacity>
                </View>
              </View>
            </Modal>          */}
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#96BB7C',
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingBottom: 24,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 20,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  hideButton: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 0,
    bottom: 0,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: 'black',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
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
    margin: 80,
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
});
