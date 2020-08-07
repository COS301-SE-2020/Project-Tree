import React, { Component } from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import IconFeather from 'react-native-vector-icons/Feather'
import IconEntypo from 'react-native-vector-icons/Entypo'
import styled from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';
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

const Screen = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
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
						topPadding: 10,
						horizontalPadding: 10,
						shadow: true,
						tabBarBackground: '#184D47'
					}}
					initialRouteName="Home"
				>
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
							tabBarIcon: ({ focused, color, size }) => (
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


// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, { Component } from 'react';
// import {BackHandler} from 'react-native'
// import { Container, Header, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
// import HomeScreen from './Home/HomeScreen';
// import GraphScreen from './Graph/GraphScreen';
// import SettingsScreen from './Settings/SettingsScreen';
// import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
// import { NavigationContainer } from '@react-navigation/native';

// const Tabs = AnimatedTabBarNavigator();

// export default () => (
// 	<NavigationContainer>
// 		<Tabs.Navigator
// 			tabBarOptions={{
// 			activeTintColor: "#2F7C6E",
// 			inactiveTintColor: "#222222"
// 		}}
// 	>
// 		<Tabs.Screen name="Home" component={Settings} />

// 	</Tabs.Navigator>
// 	</NavigationContainer>
  
// )

// class Settings extends React.Component{
// 	render(){
// 		return(
// 			<Screen>
// 				<View>
// 					<Text>
// 						Hello
// 					</Text>
// 				</View>
// 			</Screen>
// 		)
// 	}
// }

// export default class App extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {home:true, graph:false, settings:false, currentProject: null}
// 		this.handlePageChange = this.handlePageChange.bind(this);
// 		this.setCurrentProject = this.setCurrentProject.bind(this);
// 	}

// 	componentDidMount(){
// 		BackHandler.addEventListener('hardwareBackPress', ()=>{
// 			if(this.state.home === true){
// 				return false;
// 			}

// 			else{
// 				this.setState({home:true, graph:false, settings:false});
// 				return true;
// 			}
// 		});
// 	}

// 	setCurrentProject(project){
// 		this.setState({home:false, graph:true, settings:false, currentProject:project})
// 	}

// 	handlePageChange(index){
// 		if(index===0) this.setState({home:true, graph:false, settings:false});
// 		else if(index===1) this.setState({home:false, graph:true, settings:false});
// 		else this.setState({home:false, graph:false, settings:true});
// 	}

// 	render() {
// 		let homeColor = this.state.home ? 'white' : 'black';
// 		let graphColor = this.state.graph ? 'white' : 'black';
// 		let settingsColor = this.state.settings ? 'white' : 'black';

// 		return (
// 			<NavigationContainer>
// 				<TABS.Navigator
// 				// default configuration from React Navigation
// 				tabBarOptions={{
// 				activeTintColor: "#2F7C6E",
// 				inactiveTintColor: "#222222"
// 				}}
// 			>

// 				// Home Screen
// 				<TABS.Screen name="Settings" component={SettingsScreen} />

// 				// Other screens go here.
// 				...
//   				</TABS.Navigator>
// 			</NavigationContainer>
			
// 			// <Container>
// 			// 	<Container>
// 			// 		{this.state.home ? <HomeScreen setCurrentProject={this.setCurrentProject}/> : null}
// 			// 		{this.state.graph ? <GraphScreen project={this.state.currentProject}/> : null}
// 			// 		{this.state.settings ? <SettingsScreen /> : null}
// 			// 	</Container>
// 			// 	<Footer>
// 			// 		<FooterTab style={{backgroundColor:'grey'}}>
// 			// 			<Button vertical onPress={()=>this.handlePageChange(0)}>
// 			// 				<Icon type="SimpleLineIcons" name="home" style={{color : homeColor}} />
// 			// 			</Button>
// 			// 			<Button vertical onPress={()=>this.handlePageChange(1)}>
// 			// 				<Icon type="FontAwesome5" name="project-diagram" style={{color : graphColor}} />
// 			// 			</Button>
// 			// 			<Button vertical onPress={()=>this.handlePageChange(2)}>
// 			// 				<Icon type="SimpleLineIcons" name="settings" style={{color : settingsColor}} />
// 			// 			</Button>
// 			// 		</FooterTab>
// 			// 	</Footer>		
// 			// </Container>
// 		);
// 	}
// }