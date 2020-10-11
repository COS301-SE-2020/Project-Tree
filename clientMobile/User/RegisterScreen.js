import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      sname: '',
      password: '',
      email: '',
      validUser: true,
      isValidSname: true,
      isValidPassword: true,
      isValidEmail: true,
      check_inputChange: false,
      checkSname: false,
      hiddenText: true,
      confirm_hiddenText: true,
      passwordError: '',
      passwordError2: '',
      passwordError3: '',
      passwordError4: '',
    };
    this.inputChange = this.inputChange.bind(this);
    this.emailInputChange = this.emailInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateHiddenText = this.updateHiddenText.bind(this);
    this.updateConfirmHiddenText = this.updateConfirmHiddenText.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleValidUser = this.handleValidUser.bind(this);
    this.snameInputChange = this.snameInputChange.bind(this);
    this.handleValidSname = this.handleValidSname.bind(this);
    this.password_validate = this.password_validate.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  handleValidUser(val) {
    if (val.trim().length >= 2) {
      this.setState({
        validUser: true,
        check_inputChange: true,
      });
    } else {
      this.setState({
        validUser: false,
        check_inputChange: false,
      });
    }
  }

  inputChange(val) {
    if (val.length !== 0) {
      this.setState({
        userName: val,
      });
    } else {
      this.setState({
        userName: val,
      });
    }
  }

  validateEmail(text){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    }
    else {
      return true
    }
  }

  handleValidSname(val) {
    if (val.trim().length >= 2) {
      this.setState({
        isValidSname: true,
        checkSname: true,
      });
    } else {
      this.setState({
        isValidSname: false,
        checkSname: false,
      });
    }
  }

  snameInputChange(val) {
    if (val.length !== 0) {
      this.setState({
        sname: val,
      });
    } else {
      this.setState({
        sname: val,
      });
    }
  }

  password_validate(p) {
    let str = '';
    let arr = [];
    /[A-Z]/.test(p) === false
      ? arr.push('Must contain at least one Capital Letter \n')
      : arr.push('✓');
    /[0-9]/.test(p) === false
      ? arr.push('Must contain at least one number \n')
      : arr.push('✓');
    /[~`!#$@%^&*_+=\-[\]\\';,/{}|\\":<>?]/g.test(p) === false
      ? arr.push('Must contain at least one special character eg. #!@$ \n')
      : arr.push('✓');
    /^.{8,22}$/.test(p) === false
      ? arr.push('Must be between 8 and 22 characters ')
      : arr.push('✓');
    return arr;
  }

  emailInputChange(val) {
    if (this.validateEmail(val)) {
      this.setState({
        email: val,
        check_emailInputChange: true,
      });
    } else {
      this.setState({
        emailInputChange: val,
        check_emailInputChange: false,
      });
    }
  }

  handlePasswordChange(val) {
    let arr = this.password_validate(val);
    this.setState({
      passwordError: arr[0],
      passwordError2: arr[1],
      passwordError3: arr[2],
      passwordError4: arr[3],
      isValidPassword: false,
    });
    if (arr[0] == '✓' && arr[1] == '✓' && arr[2] == '✓' && arr[3] == '✓') {
      this.setState({
        password: val,
        isValidPassword: true,
      });
    } else {
      this.setState({
        isValidPassword: false,
      });
    }
  }

  updateHiddenText() {
    this.setState({
      hiddenText: !this.state.hiddenText,
    });
  }

  updateConfirmHiddenText() {
    this.setState({
      confirm_hiddenText: !this.state.confirm_hiddenText,
    });
  }

  async handleRegister(userName, password, email, sname) {
    if (userName.trim().length < 1) {
      alert('Please enter a name');
      return;
    }

    if (sname.trim().length < 1) {
      alert('Please enter a Surname');
      return;
    }

    if (password.trim().length < 1) {
      alert('Please enter a password');
      return;
    }

    if (this.validateEmail(email) === false) {
      alert('Please enter a valid email address');
      return;
    }

    if (
      this.state.validUser &&
      this.state.isValidPassword &&
      this.state.isValidEmail &&
      this.state.isValidSname
    ) {
      let data = {
        name: userName,
        sname: this.state.sname,
        email: this.state.email,
        password: this.state.password,
        um_date: '  ',
        type: 'mobileToken',
      };
      data = JSON.stringify(data);

      const response = await fetch(
        'https://projecttree.herokuapp.com/register',
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
      if (body.message !== 'success') {
        alert(body.message);
      } else {
        this.props.handleLogin(body);
      }
    } else {
      alert('Please ensure all entered information is valid');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="grey" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Register</Text>
        </View>
        <Animatable.View animation="fadeInUp" style={styles.footer}>
          <ScrollView>
            <Text style={styles.text_footer}>First name</Text>
            <View style={styles.mover}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="First name"
                style={styles.inputT}
                autoCapitalize="none"
                onChangeText={(val) => this.inputChange(val)}
                onEndEditing={(val) =>
                  this.handleValidUser(this.state.userName)
                }
              />
              {this.state.check_inputChange ? (
                <Animatable.View animation="rubberBand">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {this.state.validUser ? null : (
              <Animatable.View animation="rubberBand" duration={400}>
                <Text style={styles.errorMsg}>
                  First name must be at least be longer than 1 character.
                </Text>
              </Animatable.View>
            )}
            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 35,
                },
              ]}>
              Surname
            </Text>
            <View style={styles.mover}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                placeholder="Surname"
                style={styles.inputT}
                autoCapitalize="none"
                onChangeText={(val) => this.snameInputChange(val)}
                onEndEditing={(val) => this.handleValidSname(this.state.sname)}
              />

              {this.state.checkSname ? (
                <Animatable.View animation="rubberBand">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {this.state.isValidSname ? null : (
              <Animatable.View animation="rubberBand" duration={400}>
                <Text style={styles.errorMsg}>
                  Surname must be at least be longer than 1 character.
                </Text>
              </Animatable.View>
            )}
            <Text
              style={[
                styles.text_footer,
                {
                  marginTop: 35,
                },
              ]}>
              Password
            </Text>
            <View style={styles.mover}>
              <Feather name="lock" color="#05375a" size={20} />
              <TextInput
                placeholder="Password"
                secureTextEntry={this.state.hiddenText ? true : false}
                style={styles.inputT}
                autoCapitalize="none"
                onChangeText={(val) => this.handlePasswordChange(val)}
              />
              <TouchableOpacity onPress={this.updateHiddenText}>
                {this.state.hiddenText ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {this.state.isValidPassword ? (
              true
            ) : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  {'\n'}
                  {this.state.passwordError}
                  {'\n'}
                  {this.state.passwordError2}
                  {'\n'}
                  {this.state.passwordError3}
                  {'\n'}
                  {this.state.passwordError4}
                </Text>
              </Animatable.View>
            )}
            <Text style={[styles.text_footer, {marginTop: 35}]}>Email</Text>
            <View style={styles.mover}>
              <FontAwesome name="paper-plane" color="#05375a" size={20} />
              <TextInput
                placeholder="Email"
                style={styles.inputT}
                autoCapitalize="none"
                onChangeText={(val) => this.emailInputChange(val)}
              />
              {this.state.check_emailInputChange ? (
                <Animatable.View animation="pulse">
                  <Feather name="check-circle" color="#296d98" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => {
                  this.props.switchScreen('Login');
                }}
                style={[
                  styles.signer,
                  {
                    borderColor: '#296d98',
                    borderWidth: 2,
                    marginTop: 40,
                  },
                ]}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#296d98',
                    },
                  ]}>
                  Already have an account? Sign in now
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => {
                  this.handleRegister(
                    this.state.userName,
                    this.state.password,
                    this.state.email,
                    this.state.sname,
                  );
                }}
                style={[
                  styles.signer,
                  {
                    borderColor: '#296d98',
                    borderWidth: 2,
                    marginTop: 8,
                  },
                ]}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#296d98',
                    },
                  ]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    );
  }
}

export default RegisterScreen;

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEBB4D',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  footer: {
    width: '100%',
    backgroundColor: 'white',
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  mover: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  inputT: {
    flex: 1,
    paddingLeft: 10,
    color: 'black',
    marginTop: Platform.OS === 'ios' ? 0 : -12,
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
  },
  signer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  terms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  priv: {
    color: 'grey',
  },
});
