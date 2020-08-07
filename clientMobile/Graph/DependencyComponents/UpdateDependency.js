import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button } from 'native-base';
import {ButtonGroup} from 'react-native-elements'

class UpdateDependency extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal animationType="slide" transparent={true} visible={this.props.modalVisibility} onRequestClose={()=>this.props.toggleVisibility(true, false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <UpdateDependencyForm dependency={this.props.dependency} toggleVisibility={this.props.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} displayTaskDependency={this.props.displayTaskDependency} name={this.props.name}/>
						<TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>this.props.toggleVisibility(true, false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
		)
	}
}

class UpdateDependencyForm extends Component{
    constructor(props){
        super(props);
        
        this.state ={  
            dependencyRelationship : this.props.dependency.relationshipType,
            selectedIndex: this.props.dependency.relationshipType === "ss" ? 0 : 1,
            dependencyDuration: this.props.dependency.duration
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.formatValidateInput = this.formatValidateInput.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
    }

    updateIndex (selectedIndex) {
        if(selectedIndex == 0){
            this.setState({selectedIndex:0, dependencyRelationship:"ss"});
        }

        else{
            this.setState({selectedIndex:1, dependencyRelationship:"fs"})
        }
    }

    formatValidateInput(){
        let data = {
            ud_did: this.props.dependency.id,
            ud_duration : parseInt(this.state.dependencyDuration),
            ud_relationshipType : this.state.dependencyRelationship
        }

        return data;
    }

    async handleSubmit(){
        let input = this.formatValidateInput();
        if(input === null) return;

        let projectData = await this.props.getProjectInfo();
        projectData.changedInfo = input;
        projectData = JSON.stringify(projectData);
        
        const response = await fetch('http://projecttree.herokuapp.com/dependency/update', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: projectData,
        }); 
        
        const body = await response.json();  
        this.props.toggleVisibility(true, false);
        this.props.displayTaskDependency(null, null);
        this.props.setProjectInfo(body.nodes, body.rels);
    }

    render()
    {
        const component1 = () => <Text>Start→Start</Text>
        const component2 = () => <Text>Finish→Start</Text>
        const buttons = [{ element: component1 }, { element: component2 }]

        return(
            <View style={{width:300, height:300}}>
                <View>
                    <Text>
                        {this.props.name}
                    </Text>
                </View>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 100}} 
                />
                <Form>
                    <Item floatingLabel>
                        <Label>Duration (Days)</Label>
                        <Input 
                            value = {this.state.dependencyDuration.toString()}
                            onChangeText={val => this.setState({ dependencyDuration: val })}
                        />
                    </Item>
                </Form>
                <View style={{ padding: 5 }}>
                    <Button block light onPress={this.handleSubmit}>
                        <Text>
                            Submit
                        </Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		width: 0,
		height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
        elevation: 5,
        width : 350,
        height: 600
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center"
	},
    floatinBtn: {
        backgroundColor: 'lightgreen',
        width: 45,
        height: 45,
        borderRadius: 45,
        position: 'absolute',
        bottom: 12,
        right: 12,
	},
	container: { flex: 1, paddingTop: 30, backgroundColor: '#fff', width: "100%" },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});

export default UpdateDependency;