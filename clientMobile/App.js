import React, { Component } from 'react'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';

const Tabs = AnimatedTabBarNavigator()

const Screen = styled.View
`
	flex: 1;
	background-color: #f2f2f2;
`
var selectedProject = null

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
		this.setCurrentProject = this.setCurrentProject.bind(this);
	}


	setCurrentProject(project){
		selectedProject = project;
		this.props.navigation.navigate('Project Tree')
	}

	render(){
		return(
			<Screen>
				<HomeScreen setCurrentProject={this.setCurrentProject}/>
			</Screen>
		)
	}
}

class Graph extends Component{
	render(){
		return(
			<Screen>
				<GraphScreen project={selectedProject}/>
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