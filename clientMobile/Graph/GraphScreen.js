import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphProjectModal';

class GraphScreen extends Component{
    reload(){
        this.myWebView.reload()
    }

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
                    <WebView 
                        ref={(ref) => this.myWebView = ref}
                        renderLoading={this.ActivityIndicatorLoadingView}
                        startInLoadingState={true}
                        source={{uri:'http://192.168.137.1:5000/mobile'}} />
                    <Button onPress={()=>this.reload() }><Text>Reload</Text></Button>
                </View>
                <View style={{flex:1}}>
                
                    {/* <ProjectModal project={this.props.project}/> */}
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