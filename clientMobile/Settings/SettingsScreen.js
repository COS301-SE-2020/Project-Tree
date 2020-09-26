import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  Modal
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {pfp: 'https://i.ibb.co/MRpbpHN/default.png',  modalVisible: false};

    this.setModalVisible = this.setModalVisible.bind(this);
    this.takePhotoFromCamera = this.takePhotoFromCamera.bind(this);
    this.choosePhotoFromLibrary = this.choosePhotoFromLibrary.bind(this);

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

  takePhotoFromCamera() {
    // ImagePicker.openCamera({
    //   compressImageMaxWidth: 300,
    //   compressImageMaxHeight: 300,
    //   cropping: true,
    //   compressImageQuality: 0.7
    // }).then(image => {
    //   console.log(image);
    //   setImage(image.path);
    //   this.bs.current.snapTo(1);
    // });
    console.log("HELLO")
  }

  choosePhotoFromLibrary(){
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 300,
    //   cropping: true,
    //   compressImageQuality: 0.7
    // }).then(image => {
    //   console.log(image);
    //   setImage(image.path);
    //   this.bs.current.snapTo(1);
    // });
    console.log("hi")
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#008656" barStyle="light-content" />
        <View style={styles.header}>
          <Image style={styles.logo} source={{uri: this.state.pfp}} />
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
                this.setState({modalVisible: true});
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#184D47',
                  borderWidth: 2,
                  marginTop: 40,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#008656',
                  },
                ]}>
                Change PFP
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
                Edit User Settings
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
                Logout
              </Text>
            </TouchableOpacity>
          </View> 
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
          >
              <View style={styles.panel}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
              </View>
              <TouchableOpacity style={styles.panelButton} onPress=
              {
                    this.props.userScreen(false)              
              }>
              <Text style={styles.panelButtonTitle}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity styles={styles.panelButton} onPress={
                    this.props.userScreen(false)
              }>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.panelButton}
                onPress={this.props.userScreen(false)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
              </TouchableOpacity>
              </View>
            </Modal>            
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008656',
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
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
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
});
