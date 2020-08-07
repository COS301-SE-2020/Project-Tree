import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button } from 'native-base';
import {ButtonGroup} from 'react-native-elements'

class CreateDependency extends Component{
    constructor(props){
        super(props);
        this.state = {createDependencyVisibility : false, source:null, target:null}
        this.setCreateDependencyVisibility = this.setCreateDependencyVisibility.bind(this);
        this.handleCreateDependency = this.handleCreateDependency.bind(this);
    }

    setCreateDependencyVisibility(visible){
        this.setState({createDependencyVisibility:visible})
    }

    handleCreateDependency(){
        if(this.props.sourceCreateDependency === null || this.props.targetCreateDependency === null){
            return;
        }

        this.setState({source:this.props.sourceCreateDependency, target:this.props.targetCreateDependency})
        this.setCreateDependencyVisibility(true);
        this.props.setCreateDependency(null);
    }
    
    render(){
        return(
            <React.Fragment>
                <CreateDependencyModal 
                    createDependencyVisibility={this.state.createDependencyVisibility} 
                    setCreateDependencyVisibility={this.setCreateDependencyVisibility} 
                    name={this.props.getName(this.state.source)+'→'+this.props.getName(this.state.target)}
                    source={this.state.source}
                    target={this.state.target}
                    projID={this.props.projID}
                    getProjectInfo={this.props.getProjectInfo}
                    setProjectInfo={this.props.setProjectInfo}
                />
                
                {this.props.sourceCreateDependency !== null ?
                    <React.Fragment>
                        <TouchableOpacity onPress={this.handleCreateDependency} style={{backgroundColor:'green', height:30}}>
                            <Text>
                                {this.props.getName(this.props.sourceCreateDependency)+'→'+this.props.getName(this.props.targetCreateDependency)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.setCreateDependency(null)} style={{backgroundColor:'red', height:30}}>
                            <Text>
                                clear
                            </Text>
                        </TouchableOpacity>
                    </React.Fragment>
                : null}
            </React.Fragment>
        )
    }
}

class CreateDependencyModal extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal animationType="slide" transparent={true} visible={this.props.createDependencyVisibility} onRequestClose={()=>this.props.setCreateDependencyVisibility(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <CreateDependencyForm 
                            setCreateDependencyVisibility={this.props.setCreateDependencyVisibility}
                            getProjectInfo={this.props.getProjectInfo} 
                            setProjectInfo={this.props.setProjectInfo} 
                            name={this.props.name}
                            source={this.props.source}
                            target={this.props.target}
                            projID={this.props.projID}
                        />
						<TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>this.props.setCreateDependencyVisibility(false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
		)
	}
}

class CreateDependencyForm extends Component{
    constructor(props){
        super(props);
        
        this.state ={  
            dependencyRelationship: "ss",
            selectedIndex: 0,
            dependencyDuration: 0
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
            cd_fid: this.props.target,
            cd_sid: this.props.source,
            cd_pid: this.props.projID,
            cd_relationshipType: this.state.dependencyRelationship,
            cd_duration : parseInt(this.state.dependencyDuration)
        }

        return data;
    }

    async handleSubmit(){
        let input = this.formatValidateInput();
        if(input === null) return;

        let projectData = await this.props.getProjectInfo();
        projectData.changedInfo = input;
        projectData = JSON.stringify(projectData);
        
        const response = await fetch('http://projecttree.herokuapp.com/dependency/add', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: projectData,
        }); 
        
        const body = await response.json();  
        this.props.setCreateDependencyVisibility(false);
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

export default CreateDependency;