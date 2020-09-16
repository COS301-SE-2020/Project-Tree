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
  Modal,
} from 'react-native';
import {Icon} from 'native-base';
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
      confirmPassword: '',
      hiddenText: true,
      confirm_hiddenText: true,
      newPass: '',
      confirmNewPass: true,
      passwordError: '',
      passwordError2: '',
      passwordError3: '',
      passwordError4: '',
    };
    this.textInputChange = this.textInputChange.bind(this);
    this.emailInputChange = this.emailInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
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
    this.updateHiddenText = this.updateHiddenText.bind(this);
    this.updateConfirmHiddenText = this.updateConfirmHiddenText.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.password_validate = this.password_validate.bind(this);
  }

  password_validate(p) {
    let str = '';
    let arr = [];
    /[A-Z]/.test(p) === false
      ? arr.push('Must contain at least one Capital Letter \n')
      : arr.push('Must contain at least one Capital Letter ✓');
    /[0-9]/.test(p) === false
      ? arr.push('Must contain at least one number \n')
      : arr.push('Must contain at least one number ✓');
    /[~`!#$@%^&*_+=\-[\]\\';,/{}|\\":<>?]/g.test(p) === false
      ? arr.push('Must contain at least one special character eg. #!@$ \n')
      : arr.push('Must contain at least one special character eg. #!@$ ✓');
    /^.{8,22}$/.test(p) === false
      ? arr.push('Must be between 8 and 22 characters ')
      : arr.push('Must be between 8 and 22 characters  ✓');
    return arr;
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

  onChange(event, selectedDate) {
    if (event.type === 'dismissed') {
      this.setState({startDatePickerVisible: false});
      return;
    }

    this.setState({startDate: selectedDate, startDatePickerVisible: false});
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
      this.setState({
        userName: body.user.name,
        sname: body.user.sname,
        email: body.user.email,
        initialEmail: body.user.email,
        profilepicture: body.user.profilepicture,
      });
      if (body.user.birthday == '  ') {
      } else {
        this.setState({startDate: body.user.birthday});
      }
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

  handleNewPasswordChange(val) {
    let arr = this.password_validate(val);
    this.setState({
      passwordError: arr[0],
      passwordError2: arr[1],
      passwordError3: arr[2],
      passwordError4: arr[3],
      isValidPassword: false,
    });
    if (
      arr[0].indexOf('✓') != -1 &&
      arr[1].indexOf('✓') != -1 &&
      arr[2].indexOf('✓') != -1 &&
      arr[3].indexOf('✓') != -1
    ) {
      this.setState({
        newPass: val,
        confirmNewPass: true,
      });
    } else {
      this.setState({
        confirmNewPass: true,
      });
    }
  }

  handlePasswordChange(val) {
    this.setState({
      confirmPassword: val,
      isValidPassword: true,
    });
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

  async handlePass(pass, passNew) {
    if (pass.trim().length < 1) {
      alert('Please enter your password you wish to change');
      return;
    }

    if (passNew.trim().length < 1) {
      alert('Please ensure all password criteria are met');
      return;
    }

    if (!this.state.confirmNewPass && !this.state.confirmNewPass) {
      alert('Invalid password');
    } else {
      let data = {
        token: this.state.token,
        testPass: pass,
        newPass: passNew,
      };
      data = JSON.stringify(data);
      const response = await fetch(
        'http://projecttree.herokuapp.com/user/pass',
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
      if (body.message === 'wrong') {
        alert(
          'Password entered does not match password registered with this account.',
        );
      } else if (body.message === 'success') {
        alert('Success');
        this.props.userScreen(false);
      }
    }
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

    if (this.state.isValidUser && this.state.isValidEmail) {
      let data = {
        token: this.state.token,
        name: this.state.userName,
        email: this.state.email,
        sname: this.state.sname,
        bday: this.state.startDate,
        testEmail: this.state.initialEmail,
        testPass: pass,
        profilepicture: this.state.profilepicture,
      };
      data = JSON.stringify(data);

      const response = await fetch(
        'http://projecttree.herokuapp.com/user/edit',
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
      this.props.userScreen(false);
    } else {
      alert('Please ensure all entered information is valid');
    }
  }

  render() {
    return (
      <View style={styleUser.container}>
        <StatusBar backgroundColor="#EBB035" barStyle="light-content" />
        <View style={styleUser.header}>
          <TouchableOpacity
            style={styleUser.hideButton1}
            onPress={() => this.props.userScreen(false)}>
            <Icon type="FontAwesome" name="close" />
          </TouchableOpacity>
          <Text style={styleUser.text_header}>User details</Text>
        </View>
        <Animatable.View animation="fadeInUp" style={styleUser.footer}>
          <ScrollView>
            <Text style={styleUser.text_footer}>Name</Text>
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
            {this.state.startDatePickerVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                onChange={this.onChange}
                value={this.state.startDate}
                mode={'date'}
                is24Hour={true}
              />
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
              {this.state.checkSname ? (
                <Animatable.View animation="rubberBand">
                  <Feather name="check-circle" color="green" size={16} />
                </Animatable.View>
              ) : null}
            </View>
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
            {/* <Text style={[styleUser.text_footer, {marginTop: 35}]}>Date of Birth</Text> */}
            {/* <View>
            <Form>
              <Item floatingLabel disabled>
              <Input value={this.state.startDate.toISOString().substr(0, 10)} editable={false} />
               <TextInput
                  style={styleUser.textInput}
                 // defaultValue={this.state.startDate}
                  placeholder="startDate"
                  editable={false} 
                />
                <Icon
                  type="AntDesign"
                  name="calendar"
                  onPress={() => {
                    this.setState({startDatePickerVisible: true});
                  }}
                />
              </Item>
            </Form>
            </View> */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => this.setModalVisible(false)}>
              <View style={styleUser.centeredView}>
                <View style={styleUser.modalView}>
                  <TouchableOpacity
                    style={styleUser.hideButton}
                    onPress={() => this.setModalVisible(false)}>
                    <Icon type="FontAwesome" name="close" />
                  </TouchableOpacity>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 25, color: '#184D47'}}>
                      Password Change
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#EEBB4D',
                        height: 1,
                        width: '60%',
                        marginBottom: 10,
                      }}></View>
                  </View>
                  <Text
                    style={[
                      styles.text_footer,
                      {
                        marginTop: 35,
                      },
                    ]}>
                    Current Password
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

                  <Text
                    style={[
                      styles.text_footer,
                      {
                        marginTop: 35,
                      },
                    ]}>
                    New Password
                  </Text>
                  <View style={styles.mover}>
                    <Feather name="lock" color="#05375a" size={20} />
                    <TextInput
                      placeholder="Password"
                      secureTextEntry={this.state.hiddenText ? true : false}
                      style={styles.inputT}
                      autoCapitalize="none"
                      onChangeText={(val) => this.handleNewPasswordChange(val)}
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
                      <Text
                        style={
                          this.state.passwordError.indexOf('✓') != -1
                            ? styleUser.green
                            : styleUser.red
                        }>
                        {' '}
                        {this.state.passwordError}
                      </Text>
                      <Text
                        style={
                          this.state.passwordError2.indexOf('✓') != -1
                            ? styleUser.green
                            : styleUser.red
                        }>
                        {' '}
                        {this.state.passwordError2}
                      </Text>
                      <Text
                        style={
                          this.state.passwordError3.indexOf('✓') != -1
                            ? styleUser.green
                            : styleUser.red
                        }>
                        {' '}
                        {this.state.passwordError3}
                      </Text>
                      <Text
                        style={
                          this.state.passwordError4.indexOf('✓') != -1
                            ? styleUser.green
                            : styleUser.red
                        }>
                        {' '}
                        {this.state.passwordError4}
                      </Text>
                    </Animatable.View>
                  )}
                  <View style={styleUser.buttonSign}>
                    <TouchableOpacity
                      onPress={() => {
                        this.handlePass(
                          this.state.confirmPassword,
                          this.state.newPass,
                        );
                      }}
                      style={[
                        styleUser.signIn,
                        {
                          borderColor: '#296d98',
                          borderWidth: 2,
                        },
                      ]}>
                      <Text
                        style={[
                          styleUser.textSign,
                          {
                            color: '#296d98',
                          },
                        ]}>
                        Confirm Password Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={styleUser.button}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible: true});
                }}
                style={[
                  styleUser.signIn,
                  {
                    borderColor: '#296d98',
                    borderWidth: 2,
                    marginTop: 38,
                  },
                ]}>
                <Text
                  style={[
                    styleUser.textSign,
                    {
                      color: '#296d98',
                    },
                  ]}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styleUser.buttonSign}>
              <TouchableOpacity
                onPress={() => {
                  this.handleEdit(
                    this.state.userName,
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
                    marginTop: 0,
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

const styleUser = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBB035',
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
  inputT: {
    flex: 1,
    paddingLeft: 10,
    color: 'black',
    marginTop: Platform.OS === 'ios' ? 0 : -12,
  },
  mover: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
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
    paddingBottom: 10,
  },
  buttonSign: {
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
  hideButton: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 0,
    bottom: 0,
  },
  hideButton1: {
    alignItems: 'flex-end',
    marginRight: 210,
    marginLeft: 0,
    marginTop: 0,
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
  green: {
    color: '#008656',
  },
  red: {
    color: '#ff0000',
  },
});
