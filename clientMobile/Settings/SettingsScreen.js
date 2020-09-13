import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';


export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { pfp: "https://i.ibb.co/MRpbpHN/default.png"}
  }

  async componentDidMount() {
    let token = null;
    await AsyncStorage.getItem('sessionToken').then(async (value) => {
      token = JSON.parse(value);
      this.setState({token: token});
      const response = await fetch('http://projecttree.herokuapp.com/user/get', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: token}),
      });
      const body = await response.json();
      //console.log(body.profilepicture)
      this.setState({
        pfp: body.user.profilepicture
      });
      console.log(this.state.pfp)
    });
  }

  render() {      console.log(this.state.pfp)

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#008656" barStyle="light-content" />
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source = {{uri: this.state.pfp }}/>
          <Text style={styles.text_header}>User Details</Text>
        </View>
        <Animatable.View
          animation="rubberBand"
          style={[
            styles.footer,
            {
              backgroundColor: 'white',
              marginBottom: 40
            },
          ]}>
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
                  marginTop: 185,
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
    paddingBottom:24
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
    borderRadius: 50,
    borderColor: '#F44336',
    marginBottom: 10
  },
});
