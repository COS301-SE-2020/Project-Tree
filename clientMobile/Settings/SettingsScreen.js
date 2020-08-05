import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';

class SettingsScreen extends Component{
    render(){
        return(
            <WebView source={{ uri: 'https://projecttree.herokuapp.com' }} />
        );
    }
}

export default SettingsScreen;

