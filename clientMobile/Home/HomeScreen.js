import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { Container, Header, Tab, Tabs, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';

class HomeScreen extends Component{
    render(){
        return(
            <View>
                <Text>Home</Text>
            </View>
        );
    }
}

export default HomeScreen;