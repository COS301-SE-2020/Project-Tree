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
import tabStyling from './native-base-theme/variables/tabStyling';
import getTheme from './native-base-theme/components';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {initialPage: 0, activeTab: 0};
		this.setCurrentTab = this.setCurrentTab.bind(this);
	}

	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', ()=>{
			if(this.state.activeTab == 0){
				return false;
			}

			else{
				this.setState({activeTab : 0});
				return true;
			}
		});
	}

	setCurrentTab(event){
		this.setState({activeTab:event.i})
	}

	render() {
		return (
			<StyleProvider style={getTheme(tabStyling)}>
				<Container>
					<Tabs initialPage={this.state.initialPage} page={this.state.activeTab} onChangeTab={this.setCurrentTab}>
						<Tab heading={ <TabHeading><Icon type="SimpleLineIcons" name="home" /></TabHeading>}>
							<HomeScreen />
						</Tab>
						<Tab heading={ <TabHeading><Icon type="FontAwesome5" name="project-diagram" /></TabHeading>}>
							<GraphScreen />
						</Tab>
						<Tab heading={ <TabHeading><Icon type="SimpleLineIcons" name="settings" /></TabHeading>}>
							<SettingsScreen />
						</Tab>
					</Tabs>
				</Container>
			</StyleProvider>
		);
	}
}