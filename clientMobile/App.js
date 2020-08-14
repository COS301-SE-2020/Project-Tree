import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TouchableHighlight, ActivityIndicator} from 'react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import Drawer from 'react-native-drawer'
import Home from './Home/HomeScreen';
import Graph from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
import NoticeBoard from './NoticeBoard/NoticeBoardScreen'
console.disableYellowBox = true; 
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from '@react-navigation/stack';
import {Auth} from "./User/Components/Auth";
import RootStackScreen from './User/RootStackScreen';

import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from './User/LoginScreen'
import RegisterScreen from './User/RegisterScreen'
import { forEach } from 'lodash'


const Tabs = AnimatedTabBarNavigator()

const Screen = styled.View
`
	flex: 1;
  background-color: #f2f2f2;
`

const FeatherTabBarIcon = (props) => {
	return (
		<IconFeather
			name={props.name}
			size={props.size ? props.size : 24}
			color={props.tintColor}
		/>
	)
}

const EntypoTabBarIcon = (props) => {
	return (
		<IconEntypo
			name={props.name}
			size={props.size ? props.size : 24}
			color={props.tintColor}
		/>
	)
}

const AntDesignTabBarIcon = (props) => {
	return (
		<IconAntDesign
			name={props.name}
			size={props.size ? props.size : 24}
			color={props.tintColor}
		/>
	)
}

class SplashScreen extends Component{
	render(){
		return(
			<Screen>
				<SplashScreen/>
			</Screen>
		)
	}
}


class Register extends Component{
	render(){
		return(
			<Screen>
				<RegisterScreen/>
			</Screen>
		)
	}
}

class Settings extends Component{
	
	constructor(props) 
	{
		super(props);		
		this.handleLogout = this.handleLogout.bind(this);
	}

	async handleLogout() 
	{	
		try {
			console.log("Deleting Key ....")
			const keys = await AsyncStorage.getAllKeys();
			await AsyncStorage.multiRemove(keys);
			this.props.setLogout(false);
		}
		catch(exception) {
			return false;
		}
	}
	
	render(){
		return(
			<Screen>
				<SettingsScreen handleLogout={this.handleLogout}/>
			</Screen>
		)
	}
}

export default class App extends Component{
	constructor(props) 
	{
		super(props);
		this.state =
		{ 
		  loggedInStatus: true,
		  user: {},
		  sessionToken: null,
		  switch: true,
		  selectedProject: null,
		  userInfo: null
		};
		
		this.handleLogin = this.handleLogin.bind(this);
		this.switchScreen = this.switchScreen.bind(this);
		this.setLogout = this.setLogout.bind(this);		
		this.checkKey = this.checkKey.bind(this);		
		this.setSelectedProject = this.setSelectedProject.bind(this);
	}

	setSelectedProject(project){
		this.setState({selectedProject:project});
	}

	async setLogout(mode)
	{
		this.setState(
			{
				loggedInStatus: mode,
				user: {},
				sessionToken: null
			});
	}

	async checkKey()
	{
		AsyncStorage.getItem('sessionToken')
		.then((value) => {
		const data = JSON.parse(value);
		console.log("checkKey:	",data);
		});
	}

	switchScreen(flag)
	{
		if(flag == "Register")
		{
			this.setState
			({
				switch: false,
			});
		}
		else{
			this.setState
			({
				switch: true,
			});
		}
	}
	
	async handleLogin(data)
	{
		try {
			await AsyncStorage.setItem('sessionToken', JSON.stringify('eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IndkYTE5OTlAZ21haWwuY29tIiwiaGFzaCI6IiQyYiQxMCRJeEcxS0pDMzg5NkFmU0xPRnJtS3JPOWthV0lDN3UyUUVUQ2FrWENxbkpwelFJUi4zNEFZbSIsImlhdCI6MTU5NzM0MjM4Nn0.-Z6CKRelWiNDdgdv4KK_OmeQYkbknweJqrJGeQ-SYeA'));
			} 
			catch(e) {
				console.log("Could not set key");
			}  
			this.setState(
			{
				loggedInStatus: data.status,
				user: data.id,
				sessionToken: data.sessionToken
			});
	}	

	async setUserInfo(){
		if(this.state.userInfo != null) return;
		let token = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IndkYTE5OTlAZ21haWwuY29tIiwiaGFzaCI6IiQyYiQxMCRJeEcxS0pDMzg5NkFmU0xPRnJtS3JPOWthV0lDN3UyUUVUQ2FrWENxbkpwelFJUi4zNEFZbSIsImlhdCI6MTU5NzM0MjM4Nn0.-Z6CKRelWiNDdgdv4KK_OmeQYkbknweJqrJGeQ-SYeA'
		let userToken = {token: token};

		const response = await fetch('http://10.0.2.2:5000/user/get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(userToken)
        });

		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);

		this.setState({userInfo:body.user});
	}

	render(){
		if(this.state.loggedInStatus === true)
		{ 
			this.setUserInfo()
			return(
				<NavigationContainer>
					<Tabs.Navigator
					tabBarOptions={{
						activeTintColor: 'black',
						inactiveTintColor: 'white',
						activeBackgroundColor: '#96BB7C',
						labelStyle: {
							fontWeight: 'bold',
						},
						tabStyle:{
							height:60
						}
					}}
					appearence={{
						floating: false,
						topPadding: 5,
						horizontalPadding: 10,
						shadow: true,
						tabBarBackground: '#184D47'
					}}
					initialRouteName="Home">
					
					<Tabs.Screen
						name="Home"
						children={()=><Home user={this.state.userInfo} project={this.state.selectedProject} setSelectedProject={this.setSelectedProject} />}
						options={{
							tabBarIcon: ({ focused, color }) => (
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
						children={()=><Graph project={this.state.selectedProject} />}
						options={{
							tabBarIcon: ({ focused, color }) => (
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
						children={()=><NoticeBoard project={this.state.selectedProject} user={this.state.userInfo}/>}
						options={{
							tabBarIcon: ({ focused, color }) => (
								<AntDesignTabBarIcon
									focused={focused}
									tintColor={color}
									name="notification"
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="Settings"
						children={()=><Settings setLogout={this.setLogout}/>}						
						options={{
							tabBarIcon: ({ focused, color }) => (
								<FeatherTabBarIcon
									focused={focused}
									tintColor={color}
									name="settings"
								/>
							),
						
						}
					}															
					/>
				</Tabs.Navigator>				
				</NavigationContainer>
			)
		}
		else
		{	
			if(this.state.switch)	
				return(<LoginScreen handleLogin={this.handleLogin} switchScreen={this.switchScreen}/>)
			else
				return(<RegisterScreen handleLogin={this.handleLogin} switchScreen={this.switchScreen}/>)

		}		
	}
}

