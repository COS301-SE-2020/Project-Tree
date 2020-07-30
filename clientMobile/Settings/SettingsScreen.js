import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';

class SettingsScreen extends Component{
    render(){
        return(
            <Container>
                <Content>
                    <Text>
                        Settings
                    </Text>
                </Content>
            </Container>
        );
    }
}

export default SettingsScreen;

