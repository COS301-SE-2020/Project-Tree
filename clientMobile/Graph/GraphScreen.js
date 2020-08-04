import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphProjectModal'

class GraphScreen extends Component{
    render(){
        if(this.props.project === null){
            return(
                <View>
                    <Text>
                        Please select a project to view from the home page
                    </Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={{flex:30}}>
                    <WebView source={{ uri: 'http://10.0.2.2:3030' }} />
                </View>
                <View style={{flex:1}}>
                    <ProjectModal project={this.props.project}/>
                </View>
            </View>
        );
    }
}
      
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default GraphScreen;