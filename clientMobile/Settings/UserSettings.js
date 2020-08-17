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
import {
  Icon,
  Label,
  Form,
  Item,
  Input,
} from 'native-base';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      sname: '',
      password: '',
      email: '',
      initialEmail: '',
      token: '',
      modalVisible: false,
      startDate: new Date(),
      startDatePickerVisible: false,
      isValidUser: true,
      isValidSname: true,
      isValidPassword: true,
      isValidEmail: true,
      isValidPasswordConfirm: true,
      check_textInputChange: false,
      checkSname: false,
      secureTextEntry: true,
      confirm_secureTextEntry: true,
      confirmPassword: true,
    };
    this.textInputChange = this.textInputChange.bind(this);
    this.emailInputChange = this.emailInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateSecureTextEntry = this.updateSecureTextEntry.bind(this);
    this.updateConfirmSecureTextEntry = this.updateConfirmSecureTextEntry.bind(
      this,
    );
    this.handleEdit = this.handleEdit.bind(this);
    this.handleValidUser = this.handleValidUser.bind(this);
    this.snameInputChange = this.snameInputChange.bind(this);
    this.handleValidSname = this.handleValidSname.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  onChange(event, selectedDate) {
    this.setState({startDate: selectedDate, startDatePickerVisible: false});
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async componentDidMount() {
    let token = null;
    await AsyncStorage.getItem('sessionToken').then(async (value) => {
      token = JSON.parse(value);
      this.setState({token: token});
      const response = await fetch('http://10.0.2.2:5000/user/get', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: token}),
      });
      const body = await response.json();
      this.setState({
        userName: body.user.name,
        sname: body.user.sname,
        password: body.user.password,
        email: body.user.email,
        initialEmail: body.user.email,
      });
    });
  }

  handleValidUser(val) {
    if (val.trim().length >= 2) {
      this.setState({
        isValidUser: true,
        check_textInputChange: true,
      });
    } else {
      this.setState({
        isValidUser: false,
        check_textInputChange: false,
      });
    }
  }

  textInputChange(val) {
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

  emailInputChange(val) {
    if (val.length !== 0) {
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

  handlePasswordChange(val, flag) {
    if (flag) {
      if (val.trim().length >= 8) {
        this.setState({
          password: val,
          isValidPassword: true,
        });
      } else {
        this.setState({
          password: val,
          isValidPassword: false,
        });
      }
    } else {
      this.setState({
        confirmPassword: val,
      });
    }
  }

  updateSecureTextEntry() {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  }

  updateConfirmSecureTextEntry() {
    this.setState({
      confirm_secureTextEntry: !this.state.confirm_secureTextEntry,
    });
  }

  async handleEdit(pass) {
    if (this.state.userName.trim().length < 1) {
      alert('Please enter a username');
    }

    if (this.state.sname.trim().length < 1) {
      alert('Please enter a Surname');
    }

    if (this.state.email == null) {
      alert('Please enter a valid email address');
    }

    if (
      this.state.isValidUser &&
      this.state.isValidPassword &&
      this.state.isValidEmail &&
      this.state.isValidPasswordConfirm
    ) {
      let data = {
        token: this.state.token,
        name: this.state.userName,
        email: this.state.email,
        sname: this.state.sname,
        bday: this.state.startDate.toISOString().substr(0, 10),
        testEmail: this.state.initialEmail,
        testPass: pass,
      };
      data = JSON.stringify(data);

      const response = await fetch('http://10.0.2.2:5000/user/edit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      });
      const body = await response.json();
      this.props.userScreen(false);
    } else {
      alert('Please ensure all entered information is valid');
    }
  }

  render() {
    return (
      <View style={styleUser.container}>
        <StatusBar backgroundColor="#94334b" barStyle="light-content" />
        <View style={styleUser.header}>
          <Text style={styleUser.text_header}>User details</Text>
        </View>
        <Animatable.View animation="fadeInUp" style={styleUser.footer}>
          <ScrollView>
            <Text style={styleUser.text_footer}>Username</Text>
            <View style={styleUser.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                defaultValue={this.state.userName}
                style={styleUser.textInput}
                autoCapitalize="none"
                onChangeText={(val) => this.textInputChange(val)}
                onEndEditing={(val) =>
                  this.handleValidUser(this.state.userName)
                }
              />
              {this.state.check_textInputChange ? (
                <Animatable.View animation="rubberBand">
                  <Feather name="check-circle" color="green" size={16} />
                </Animatable.View>
              ) : null}
            </View>
            {this.state.isValidUser ? null : (
              <Animatable.View animation="rubberBand" duration={400}>
                <Text style={styleUser.errorMsg}>
                  Username must be at least be longer than 1 character.
                </Text>
              </Animatable.View>
            )}
            <Text
              style={[
                styleUser.text_footer,
                {
                  marginTop: 35,
                },
              ]}>
              Surname
            </Text>
            <View style={styleUser.action}>
              <FontAwesome name="user-o" color="#05375a" size={16} />
              <TextInput
                placeholder="Surname"
                style={styleUser.textInput}
                autoCapitalize="none"
                defaultValue={this.state.sname}
                onChangeText={(val) => this.snameInputChange(val)}
                onEndEditing={(val) => this.handleValidSname(this.state.sname)}
              />
            </View>
            {this.state.checkSname ? (
              <Animatable.View animation="rubberBand">
                <Feather name="check-circle" color="green" size={16} />
              </Animatable.View>
            ) : null}
            {this.state.isValidSname ? null : (
              <Animatable.View animation="rubberBand" duration={400}>
                <Text style={styleUser.errorMsg}>
                  Surname must be at least be longer than 1 character.
                </Text>
              </Animatable.View>
            )}
            <Text style={[styleUser.text_footer, {marginTop: 35}]}>Email</Text>
            <View style={styleUser.action}>
              <FontAwesome name="paper-plane" color="#05375a" size={20} />
              <TextInput
                defaultValue={this.state.email}
                placeholder="Email"
                style={styleUser.textInput}
                autoCapitalize="none"
                onChangeText={(val) => this.emailInputChange(val)}
              />
              {this.state.check_emailInputChange ? (
                <Animatable.View animation="pulse">
                  <Feather name="check-circle" color="#296d98" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            <Form>
              <Item floatingLabel disabled>
                <Label>Start Date</Label>
                <Input
                  value={this.state.startDate.toISOString().substr(0, 10)}
                />
                <Icon
                  type="AntDesign"
                  name="plus"
                  onPress={() => {
                    this.setState({startDatePickerVisible: true});
                  }}
                />
              </Item>
            </Form>

            {this.state.startDatePickerVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                onChange={this.onChange}
                value={this.state.startDate}
                mode={'date'}
                is24Hour={true}
              />
            )}
            <View style={styleUser.button}>
              <TouchableOpacity
                onPress={() => {
                  this.handleEdit(
                    this.state.userName,
                    this.state.password,
                    this.state.email,
                    this.state.sname,
                    this.state.startDate,
                  );
                }}
                style={[
                  styleUser.signIn,
                  {
                    borderColor: '#296d98',
                    borderWidth: 2,
                    marginTop: 8,
                  },
                ]}>
                <Text
                  style={[
                    styleUser.textSign,
                    {
                      color: '#296d98',
                    },
                  ]}>
                  Edit Details
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    );
  }
}
export default UserSettings;
// }
// export default User;

const styleUser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94334b',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 40,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: 'sans-serif-medium',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 50,
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
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },
  centeredView: {
    position: 'absolute',
    width: '20%',
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100, 0.8)',
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'green',
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
    height: 1020,
    width: '20%',
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
});
