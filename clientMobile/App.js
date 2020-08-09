import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TouchableHighlight} from 'react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import Drawer from 'react-native-drawer'
import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
import ProjectList from './ProjectList';
import GraphDrawer from './Graph/GraphDrawer';
console.disableYellowBox = true; 
//import { createAppContainer } from 'react-navigation';
//import { createStackNavigator} from '@react-navigation/stack';

// import Splash from './User/Splash';
// import Login from './User/Login';
// import Register from './User/Register';
// import drawerNav from './User/DrawerNav';

// const Auth = createStackNavigator({
// 	//Stack Navigator for Login and Sign up Screen
// 	LoginScreen: {
// 	  screen: LoginScreen,
// 	  navigationOptions: {
// 		headerShown: false,
// 	  },
// 	},
// 	RegisterScreen: {
// 	  screen: RegisterScreen,
// 	  navigationOptions: {
// 		title: 'Register',
// 		headerStyle: {
// 		  backgroundColor: '#307ecc',
// 		},
// 		headerTintColor: '#fff'r,
// 	  },
// 	},
//   });

const Tabs = AnimatedTabBarNavigator()

const Screen = styled.View
`
	flex: 1;
  background-color: #f2f2f2;
`

var globalSelectedProject = null

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

class Home extends Component{
	constructor(props) {
		super(props);
		let drawerState = globalSelectedProject === null ? true : false;
		this.state = {drawerVisible:drawerState, selectedProject:globalSelectedProject};
		this.setCurrentProject = this.setCurrentProject.bind(this);
		this.setDrawerVisible = this.setDrawerVisible.bind(this);
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
					content={<ProjectList setCurrentProject={this.setCurrentProject} setDrawerVisible={this.setDrawerVisible}/>}
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
  constructor(props) {
    super(props);
    let drawerState = globalSelectedProject === null ? true : false;
    this.state = {drawerVisible:drawerState, selectedProject:null};
    this.setCurrentProject = this.setCurrentProject.bind(this);
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
	}
  
  setDrawerVisible(mode){
    this.setState({drawerVisible:mode});
  }

	setCurrentProject(project){
    this.setState({selectedProject:project});
    globalSelectedProject = project;
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
          	{globalSelectedProject !== null ?
            <React.Fragment>
				<TouchableOpacity style={{height:60}} onPress={()=>{this.setState({drawerVisible:true})}}>
					<IconEntypo name="menu" color="#184D47" size={50} style={{marginLeft:5, marginTop:5}}/>
				</TouchableOpacity>
				<GraphScreen 
					project={globalSelectedProject}
					navigation={this.props.navigation}
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

class Settings extends Component{
	render(){
		return(
			<Screen>
				<SettingsScreen/>
			</Screen>
		)
	}
}

export default class App extends Component{
	render(){
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
						name="Settings"
						component={Settings}
						options={{
							tabBarIcon: ({ focused, color }) => (
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
		)
	}
}