import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';

class SettingsScreen extends Component{
    render(){
        return(
            <Container>
                <Content>
                    <CreateProjectForm />
                </Content>
            </Container>
        );
    }
}

export default SettingsScreen;

class CreateProjectForm extends Component{
    constructor(props) {
		super(props);
		this.state = {projName:null, projDescription:null, permissions:"key0"}
    }
    
    onPermissionsChange(value) {
        this.setState({permissions: value});
    }

    render()
    {
        return(
            <Container>
                <Form>
                    <Item floatingLabel>
                        <Label>Name of project</Label>
                        <Input 
                            onChangeText={val => this.setState({ projName: val })}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>Description of project</Label>
                        <Input 
                            onChangeText={val => this.setState({ projDescription: val })}
                        />
                    </Item>
                    <Item picker>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            placeholder="Select Permissions"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.permissions}
                            onValueChange={this.onPermissionsChange.bind(this)}
                        >
                            <Picker.Item label="Select who else has permissions or leave as is" value="key0" />
                            <Picker.Item label="Package Managers" value="key1" />
                            <Picker.Item label="Package Managers, Responsible Persons" value="key2" />
                            <Picker.Item label="Package Managers, Responsible Persons, Resources" value="key3" />
                        </Picker>
                    </Item>
                </Form>
                <Button onPress={()=>
                    {
                        console.log(this.state.projName)
                        console.log(this.state.projDescription)
                        console.log(this.state.permissions)
                    }}>
                    <Text>Howzit</Text>
                </Button>
            </Container>
        );
    }
}