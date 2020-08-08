import React, { Component } from 'react'
import {View, Text} from 'react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import Drawer from 'react-native-drawer'
// import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
import ProjectList from './ProjectList'
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

class HomeScreen extends Component{
  render(){
    return(
      <View>
        <Text>
          {this.props.project!==null ? this.props.project.name : "Select a project"}
        </Text>
      </View>
    )
  }
}

class Home extends Component{
	constructor(props) {
    super(props);
    this.state = {selectedProject:null}
		this.setCurrentProject = this.setCurrentProject.bind(this);
	}


	setCurrentProject(project){
    this.setState({selectedProject:project});
    globalSelectedProject = project;
	}

	render(){
    let project = globalSelectedProject;
		return(
			<Screen>
				<Drawer
          type="overlay"
          open={false}
          content={<ProjectList setCurrentProject={this.setCurrentProject}/>}
          tapToClose={false}
          openDrawerOffset={0.2} 
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
          })}
        >
          <HomeScreen project={project} />
        </Drawer>
			</Screen>
		)
	}
}

class Graph extends Component{
  constructor(props) {
    super(props);
    this.state = {selectedProject:null}
		this.setCurrentProject = this.setCurrentProject.bind(this);
	}


	setCurrentProject(project){
    this.setState({selectedProject:project});
    globalSelectedProject = project;
  }
  
	render(){
    let project = globalSelectedProject;
		return(
      <Screen>
				<Drawer
          type="overlay"
          open={false}
          content={<ProjectList setCurrentProject={this.setCurrentProject}/>}
          tapToClose={false}
          openDrawerOffset={0.2} 
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
          })}
        >
          <GraphScreen project={project}/>
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