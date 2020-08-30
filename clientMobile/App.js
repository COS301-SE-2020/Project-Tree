import React, {Component} from 'react';
import { Alert } from 'react-native';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Home/HomeScreen';
import Graph from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
import UserSettings from './Settings/UserSettings';
import NoticeBoard from './NoticeBoard/NoticeBoardScreen';
console.disableYellowBox = true;

import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from './User/SplashScreen';
import LoginScreen from './User/LoginScreen';
import RegisterScreen from './User/RegisterScreen';

const Tabs = AnimatedTabBarNavigator();

const Screen = styled.View`
  flex: 1;
  background-color: #f2f2f2;
`;

const FeatherTabBarIcon = (props) => {
  return (
    <IconFeather
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

const EntypoTabBarIcon = (props) => {
  return (
    <IconEntypo
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

const MaterialTabBarIcon = (props) => {
  return (
    <IconMaterial
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: true,
      accept: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.userScreen = this.userScreen.bind(this);
  }

  async userScreen(cnt) {
    if (cnt == true) {
      this.setState({
        user: false,
      });
    } else {
      this.setState({
        user: true,
      });
    }
  }

  async handleLogout() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      this.props.setLogout(false);
    } catch (exception) {
      return false;
    }
  }

  render() {
    if (this.state.user == true) {
      return (
        <Screen>
          <SettingsScreen
            userScreen={this.userScreen}
            handleLogout={this.handleLogout}
          />
        </Screen>
      );
    } else {
      return (
        <Screen>
          <UserSettings userScreen={this.userScreen} />
        </Screen>
      );
    }
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: false,
      user: {},
      sessionToken: null,
      switch: true,
      selectedProject: null,
      userInfo: null,
      switchToLog: false,
      userPermissions: {
        create: false,
        update: false,
        delete: false,
        project: false,
      },
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.switchScreen = this.switchScreen.bind(this);
    this.setLogout = this.setLogout.bind(this);
    this.setSelectedProject = this.setSelectedProject.bind(this);
  }

  async setSelectedProject(project) {
    let tokenVal = null;
    try {
      await AsyncStorage.getItem('sessionToken').then((value) => {
        if (value) {
          tokenVal = JSON.parse(value);
        }
      });
    } catch {
      console.log('Error');
    }

    let data = JSON.stringify({token: tokenVal, project});
    const response = await fetch('http://projecttree.herokuapp.com/user/checkpermission', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: data}),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    let userPermissions = {
      create: body.create,
      update: body.update,
      delete: body.delete,
      project: body.project,
    }
    try {
      await AsyncStorage.setItem('selectedProject', JSON.stringify(project));
      await AsyncStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    } catch (e) {
      console.log('Could not set key');
    }
    this.setState({
      selectedProject: project,
      userPermissions: userPermissions,
    });
  }

  async setLogout(mode) {
    this.setState({
      loggedInStatus: mode,
      user: {},
      sessionToken: null,
      selectedProject: null,
    });
  }

  switchScreen(flag) {
    if (flag == 'Register') {
      this.setState({
        switch: false,
      });
    } else if (flag == 'Splash') {
      this.setState({
        switchToLog: true,
      });
    } else {
      this.setState({
        switch: true,
      });
    }
  }

  async handleLogin(data) {
    try {
      await AsyncStorage.setItem(
        'sessionToken',
        JSON.stringify(data.sessionToken),
      );
    } catch (e) {
      Alert.alert(
        'Error',
        'User details not found. Please ensure details are correct',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    }
    this.setState({
      loggedInStatus: data.status,
      user: data.id,
      sessionToken: data.sessionToken,
    });
  }

  async componentDidMount() {
    AsyncStorage.getItem('sessionToken').then((value) => {
      if (value) this.setState({loggedInStatus: true});
    });

    AsyncStorage.getItem('selectedProject').then((value) => {
      if (value) this.setState({selectedProject: JSON.parse(value)});
    });

    AsyncStorage.getItem('userPermissions').then((value) => {
      console.log(value);
      if (value) this.setState({userPermissions: JSON.parse(value)});
    });
  }

  async setUserInfo() {
    if (this.state.userInfo != null) return;

    let tokenVal = null;
    try {
      await AsyncStorage.getItem('sessionToken').then((value) => {
        if (value) {
          tokenVal = JSON.parse(value);
        }
      });
    } catch {
      console.log('Error');
    }

    let userToken = {token: tokenVal};

    const response = await fetch('http://projecttree.herokuapp.com/user/get', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToken),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    this.setState({userInfo: body.user});
  }

  render() {
    if (this.state.loggedInStatus === true) {
      this.setUserInfo();
      return (
        <NavigationContainer>
          <Tabs.Navigator
            tabBarOptions={{
              activeTintColor: 'black',
              inactiveTintColor: 'white',
              activeBackgroundColor: '#96BB7C',
              labelStyle: {
                fontWeight: 'bold',
              },
              tabStyle: {
                height: 60,
              },
            }}
            appearence={{
              floating: false,
              topPadding: 5,
              horizontalPadding: 10,
              shadow: true,
              tabBarBackground: '#184D47',
            }}
            initialRouteName="Home">
            <Tabs.Screen
              name="Home"
              children={() => (
                <Home
                  user={this.state.userInfo}
                  project={this.state.selectedProject}
                  userPermissions={this.state.userPermissions}
                  setSelectedProject={this.setSelectedProject}
                />
              )}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <FeatherTabBarIcon
                    focused={focused}
                    tintColor={color}
                    name="home"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Project Tree"
              children={() => 
                <Graph 
                  project={this.state.selectedProject} 
                  userPermissions={this.state.userPermissions}
                />}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <EntypoTabBarIcon
                    focused={focused}
                    tintColor={color}
                    name="tree"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Notice Board"
              children={() => (
                <NoticeBoard
                  project={this.state.selectedProject}
                  user={this.state.userInfo}
                />
              )}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <MaterialTabBarIcon
                    focused={focused}
                    tintColor={color}
                    name="notifications"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Settings"
              children={() => <Settings setLogout={this.setLogout} />}
              options={{
                tabBarIcon: ({focused, color}) => (
                  <FeatherTabBarIcon
                    focused={focused}
                    tintColor={color}
                    name="settings"
                  />
                ),
              }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
      );
    } else {
      if (this.state.switchToLog) {
        if (this.state.switch)
          return (
            <LoginScreen
              handleLogin={this.handleLogin}
              switchScreen={this.switchScreen}
            />
          );
        else {
          return (
            <RegisterScreen
              handleLogin={this.handleLogin}
              switchScreen={this.switchScreen}
            />
          );
        }
      } else return <SplashScreen switchScreen={this.switchScreen} />;
    }
  }
}
