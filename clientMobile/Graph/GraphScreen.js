import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphProjectModal';

class GraphScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <View style={{flex:30}}>
                    <WebView 
                        source={{ uri: 'http://10.0.2.2:5000/mobile' }} 
                        onMessage={event => {
                            alert(event.nativeEvent.data);
                        }}
                    />
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