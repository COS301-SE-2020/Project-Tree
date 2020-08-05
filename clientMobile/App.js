/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {BackHandler} from 'react-native'
import { Container, Header, Tab, Tabs, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import HomeScreen from './Home/HomeScreen';
import GraphScreen from './Graph/GraphScreen';
import SettingsScreen from './Settings/SettingsScreen';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {home:true, graph:false, settings:false, currentProject: null}
		this.handlePageChange = this.handlePageChange.bind(this);
		this.setCurrentProject = this.setCurrentProject.bind(this);
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', ()=>{
			if(this.state.home === true){
				return false;
			}

			else{
				this.setState({home:true, graph:false, settings:false});
				return true;
			}
		});
	}

	setCurrentProject(project){
		this.setState({home:false, graph:true, settings:false, currentProject:project})
	}

	handlePageChange(index){
		if(index===0) this.setState({home:true, graph:false, settings:false});
		else if(index===1) this.setState({home:false, graph:true, settings:false});
		else this.setState({home:false, graph:false, settings:true});
	}

	render() {
		let homeColor = this.state.home ? 'white' : 'black';
		let graphColor = this.state.graph ? 'white' : 'black';
		let settingsColor = this.state.settings ? 'white' : 'black';

		return (
			<Container>
				<Container>
					{this.state.home ? <HomeScreen setCurrentProject={this.setCurrentProject}/> : null}
					{this.state.graph ? <GraphScreen project={this.state.currentProject}/> : null}
					{this.state.settings ? <SettingsScreen /> : null}
				</Container>
				<Footer>
					<FooterTab style={{backgroundColor:'grey'}}>
						<Button vertical onPress={()=>this.handlePageChange(0)}>
							<Icon type="SimpleLineIcons" name="home" style={{color : homeColor}} />
						</Button>
						<Button vertical onPress={()=>this.handlePageChange(1)}>
							<Icon type="FontAwesome5" name="project-diagram" style={{color : graphColor}} />
						</Button>
						<Button vertical onPress={()=>this.handlePageChange(2)}>
							<Icon type="SimpleLineIcons" name="settings" style={{color : settingsColor}} />
						</Button>
					</FooterTab>
				</Footer>		
			</Container>
		);
	}
}