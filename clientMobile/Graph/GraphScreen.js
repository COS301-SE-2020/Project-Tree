import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';

class GraphScreen extends Component{
    render(){
        return(
            <Container>
                <Content>
                    <View>
                        <Text>
                            Graph
                        </Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default GraphScreen;