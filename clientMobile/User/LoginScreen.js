import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import IonIcons from 'react-native-vector-icons/Ionicons';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      password: '',
      check_textInputChange: false,
      secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
    };
    this.textInputChange = this.textInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateSecureTextEntry = this.updateSecureTextEntry.bind(this);
    this.loginHandle = this.loginHandle.bind(this);
  }

  textInputChange(val) {
    this.setState({
      Email: val,
      check_textInputChange: true,
    });
  }

  handlePasswordChange(val) {
    this.setState({
      password: val,
    });
  }

  updateSecureTextEntry() {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  }

  async loginHandle(Email, password) {
    if (Email == '') {
      alert('Please enter your Email');
      return;
    }

    if (password == '') {
      alert('Please enter your Password');
      return;
    }

    if (this.state.isValidUser && this.state.isValidPassword) {
      let data = {
        email: Email.trim(),
        password: password,
        type: 'mobileToken',
      };
      data = JSON.stringify(data);

      const response = await fetch('https://projecttree.herokuapp.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      });
      const body = await response.json();
      this.props.handleLogin(body);
    } else {
      alert('Invalid Email or Password.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="grey" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Login</Text>
        </View>
        <Animatable.View
          animation="fadeInUp"
          style={[
            styles.footer,
            {
              backgroundColor: 'white',
            },
          ]}>
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => this.textInputChange(val)}
            />
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}>
            Password
          </Text>
          <View style={styles.action}>
            <IconSimpleLineIcons name="lock" size={20} />
            <TextInput
              placeholder="Your Password"
              placeholderTextColor="#666666"
              secureTextEntry={this.state.secureTextEntry ? true : false}
              style={[styles.textInput, {}]}
              autoCapitalize="none"
              onChangeText={(val) => this.handlePasswordChange(val)}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchScreen('Register');
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#3CB371',
                  borderWidth: 2,
                  marginTop: 65,
                },
              ]}>
              <Text
                style={[
                  styles.signInText,
                  {
                    color: '#3CB371',
                  },
                ]}>
                Don't have an account? Sign up now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                this.loginHandle(this.state.Email, this.state.password);
              }}
              style={[
                styles.signIn,
                {
                  borderColor: '#3CB371',
                  borderWidth: 2,
                },
              ]}>
              <Text
                style={[
                  styles.signInText,
                  {
                    color: '#3CB371',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3CB371',
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 80,
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
    fontSize: 40,
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
    marginTop: 20,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signInText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
