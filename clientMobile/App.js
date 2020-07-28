/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import ProjectListPage from './Project/ProjectList'
import tabStyling from './native-base-theme/variables/tabStyling';
import getTheme from './native-base-theme/components';

export default class App extends Component {
	render() {
		return (
			<StyleProvider style={getTheme(tabStyling)}>
				<Container>
					<Tabs>
						<Tab heading={ <TabHeading><Icon type="SimpleLineIcons" name="home" /></TabHeading>}>
						</Tab>
						<Tab heading={ <TabHeading><Icon type="FontAwesome5" name="project-diagram" /></TabHeading>}>
							<ProjectListPage />
						</Tab>
						<Tab heading={ <TabHeading><Icon type="SimpleLineIcons" name="settings" /></TabHeading>}>
						</Tab>
					</Tabs>
				</Container>
			</StyleProvider>
		);
	}
}