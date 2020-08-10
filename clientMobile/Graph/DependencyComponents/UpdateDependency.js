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
			<Modal animationType="fade" transparent={true} visible={this.props.modalVisibility} onRequestClose={()=>this.props.toggleVisibility(true, false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.hideButton} onPress={() => this.props.toggleVisibility(true,false)}>
                            <Icon type="FontAwesome" name="close" />
                        </TouchableOpacity>
                        <UpdateDependencyForm dependency={this.props.dependency} toggleVisibility={this.props.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} displayTaskDependency={this.props.displayTaskDependency} name={this.props.name}/>
						{/* <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>this.props.toggleVisibility(true, false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight> */}
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
            <View>
                <View>
                    <Text style={styles.modalText}>
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
                <View styles={{padding:10}}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.handleSubmit}>
                        <Text>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
	centeredView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(100,100,100, 0.8)',
        padding: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 100,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 450,
        width: 350
    },
    hideButton:{
        flex:0.5,
        backgroundColor:'#fff',
        alignItems:'flex-end',
        marginRight:10,
        marginTop:10
    },
    submitButton:{
        backgroundColor:'#96BB7C',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        borderColor:'#EEBB4D',
        borderWidth:2,
        borderRadius:5,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:0.1
        },
        shadowOpacity:0.8,
        shadowRadius:2,  
        elevation:1,
        margin:3,
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
	container: { flex: 1, paddingTop: 30, backgroundColor: '#fff', width: "100%" },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});

export default UpdateDependency;