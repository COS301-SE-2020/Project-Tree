import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TouchableHighlight, ActivityIndicator} from 'react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import Drawer from 'react-native-drawer'
import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
import NoticeBoardScreen from './NoticeBoard/NoticeBoardScreen'
import ProjectList from './ProjectList';
import GraphDrawer from './Graph/GraphDrawer';
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
const RootStack = createStackNavigator();

const Screen = styled.View
`
	flex: 1;
  background-color: #f2f2f2;
`

var globalSelectedProject = null;
// globalLogout = true Logged in
// 				= false Logged out
var globalLogout = false;


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

class Home extends Component{
	constructor(props) {
		super(props);
		let drawerState = globalSelectedProject === null ? true : false;
		this.state = {drawerVisible:drawerState, selectedProject:globalSelectedProject, token: null};
		this.setCurrentProject = this.setCurrentProject.bind(this);
		this.setDrawerVisible = this.setDrawerVisible.bind(this);
	}

	async componentDidMount()
	{
		AsyncStorage.getItem('sessionToken')
		.then((value) => {
			const data = JSON.parse(value);
			this.setState({token: data});
		});
	}

	setDrawerVisible(mode){
		this.setState({drawerVisible:mode});
	}

	setCurrentProject(project){
		this.setState({selectedProject:project});
		globalSelectedProject = project;
	}

	render(){
		return(
			<Screen>
				<Drawer
					type="overlay"
					open={this.state.drawerVisible}
					content={this.state.token !== null ? <ProjectList setCurrentProject={this.setCurrentProject} setDrawerVisible={this.setDrawerVisible} token={this.state.token}/>:null}
					tapToClose={true}
					openDrawerOffset={0.2} 
					panCloseMask={0.2}
					closedDrawerOffset={-3}
					tweenHandler={(ratio) => ({
						main: {
							opacity:(2-ratio)/2
						}
					})}
        		>
					<TouchableOpacity style={{height:45}} onPress={()=>{this.setState({drawerVisible:true})}}>
						<IconEntypo name="menu" color="#184D47" size={50} style={{marginLeft:5, marginTop:5}}/>
					</TouchableOpacity>
					<HomeScreen 
						project={this.state.selectedProject} 
						setCurrentProject={this.setCurrentProject} 
						setDrawerVisible={this.setDrawerVisible}
						navigation={this.props.navigation}
					/>
			  	</Drawer>
			</Screen>
		)
	}
}

class Graph extends Component{
	constructor(props) 
	{
		super(props);
		let drawerState = globalSelectedProject === null ? true : false;
		this.state = {drawerVisible:drawerState, selectedProject:globalSelectedProject};
		this.setDrawerVisible = this.setDrawerVisible.bind(this);
	}
  
	setDrawerVisible(mode){
		this.setState({drawerVisible:mode});
	}
  
	render(){
		if(globalSelectedProject === null){
			return(
				<View style={{
				justifyContent:"center", 
				alignItems:"center",
				flex:1}}
				>
					<TouchableHighlight onPress={()=>{this.props.navigation.navigate("Home")}} style={{backgroundColor:'#184D47',
						alignItems:'center',
						justifyContent:'center',
						height:45,
						borderColor:'#EEBB4D',
						borderWidth:2,
						borderRadius:5,
						shadowColor:'#000',
						shadowOffset:{
							width:0,
							height:1
						},
						shadowOpacity:0.8,
						shadowRadius:2,  
						elevation:3}}
					>
						<Text style={{color:'white'}}>
						Please select a project
						</Text>
					</TouchableHighlight>
				</View>
			)
		}

		return(
			<Screen>
				<Drawer
				type="overlay"
				open={this.state.drawerVisible}
				content={<GraphDrawer setDrawerVisible={this.setDrawerVisible} project={globalSelectedProject} navigation={this.props.navigation}/>}
				tapToClose={true}
				openDrawerOffset={0.2} 
				panCloseMask={0.2}
				closedDrawerOffset={-3}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
					{this.state.selectedProject !== null ?
					<React.Fragment>
						<GraphScreen 
						project={this.state.selectedProject}
						navigation={this.props.navigation}
						setDrawerVisible={this.setDrawerVisible}
						/>
					</React.Fragment>
					: 
					<TouchableOpacity style={{height:60}} onPress={()=>{this.setDrawerVisible(true)}}>
						<IconEntypo name="menu" color="#184D47" size={50} style={{marginLeft:5, marginTop:5}}/>
					</TouchableOpacity>
					}
				</Drawer>
			</Screen>
		)
	}
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
			//console.log(this.props.setLogout())
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

class NoticeBoard extends Component{
	constructor(props) {
		super(props);
		this.state = {selectedProject:globalSelectedProject};
	}
	render(){
		// if(globalSelectedProject === null){
		// 	return(
		// 		<View style={{
		// 		justifyContent:"center", 
		// 		alignItems:"center",
		// 		flex:1}}
		// 		>
		// 		<TouchableHighlight onPress={()=>{this.props.navigation.navigate("Home")}} style={{backgroundColor:'#184D47',
		// 			alignItems:'center',
		// 			justifyContent:'center',
		// 			height:45,
		// 			borderColor:'#EEBB4D',
		// 			borderWidth:2,
		// 			borderRadius:5,
		// 			shadowColor:'#000',
		// 			shadowOffset:{
		// 				width:0,
		// 				height:1
		// 			},
		// 			shadowOpacity:0.8,
		// 			shadowRadius:2,  
		// 			elevation:3}}
		// 		>
		// 			<Text style={{color:'white'}}>
		// 			Please select a project
		// 			</Text>
		// 		</TouchableHighlight>
		// 		</View>
		// 	)
		// }

		return(
			<NoticeBoardScreen project={this.state.selectedProject}/>
		)
	}
}

export default class App extends Component{

	constructor(props) 
	{
		super(props);
		this.state =
		{ 
		  loggedInStatus: false,
		  user: {},
		  sessionToken: null,
		  switch: true,
		};
		
		this.handleLogin = this.handleLogin.bind(this);
		this.switchScreen = this.switchScreen.bind(this);
		this.setLogout = this.setLogout.bind(this);		
		this.checkKey = this.checkKey.bind(this);		
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
			await AsyncStorage.setItem('sessionToken', JSON.stringify(data.sessionToken));
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
			//globalLogout=true;
			// console.log(globalLogout)
			// console.log(this.state)
	}

	async componentDidMount()
	{
	
	}	

	render(){
		console.log(this.state.loggedInStatus, "::	loggedInStatus")
		console.log(globalLogout, "::	global variable")
		this.checkKey()
		if(this.state.loggedInStatus === true)
		{ 
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
					initialRouteName="Notice Board">
					
					<Tabs.Screen
						name="Home"
						component={Home}
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
						component={Graph}
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
						component={NoticeBoard}
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
						name="Settings"/*  children={()=><handleLogout propName={propValue}/>} */
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
				</NavigationContainer>)
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

