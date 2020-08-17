import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button } from 'native-base';
import {ButtonGroup} from 'react-native-elements'
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';

class UpdateProgress extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal animationType="fade" transparent={true} visible={this.props.modalVisibility} onRequestClose={()=>this.props.toggleProgressModal(true, false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.hideButton} onPress={() => this.props.toggleProgressModal(true,false)}>
                            <Icon type="FontAwesome" name="close" />
                        </TouchableOpacity>
                        <View style={{alignItems:'center', flex:1}}>
                            <Text style={{fontSize:25, color:'#184D47'}}>
                                Update Progress
                            </Text>
                            <View style={{backgroundColor: '#EEBB4D', height: 1, width: "60%"}}></View>
                        </View>
                        <UpdateProgressModal task={this.props.task} toggleProgressModal={this.props.toggleProgressModal} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo}/>
                    </View>
                </View>
            </Modal>
		)
	}
}

class UpdateProgressModal extends Component{
    constructor(props){
        super(props);
        
        this.state ={  
            id: this.props.task.id,
            progress: this.props.task.progress,
            selectedIndex: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
    }

    updateIndex (selectedIndex) {
        if(selectedIndex === 0){
            this.setState({progress:"Incomplete",selectedIndex:selectedIndex})
        }
        if(selectedIndex === 1){
            this.setState({progress:"Issue",selectedIndex:selectedIndex})
        }
        if(selectedIndex === 2){
            this.setState({progress:"Complete",selectedIndex:selectedIndex})
        }
    }

    setProgress(prog){
        this.setState({progress:prog})
    }

    componentDidMount(){
        if(this.props.task.progress === "Incomplete"){
            this.setState({selectedIndex:0})
        }
        else if(this.props.task.progress === "Issue"){
            this.setState({selectedIndex:1})
        }
        else{
            this.setState({selectedIndex:2})
        }
    }

    async handleSubmit(){
        let data = {
            id: this.state.id,
            progress: this.state.progress
        }

        await fetch('http://projecttree.herokuapp.com/task/progress', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        let projInfo = this.props.getProjectInfo();
        console.log(projInfo)
        let nodes = projInfo.nodes;
        for(let x = 0; x < nodes.length; x++){
            if(nodes[x].id === this.state.id){
                nodes[x].progress = this.state.progress;
            }
        }
        
        this.props.setProjectInfo(nodes,projInfo.rels)
        this.props.toggleProgressModal(true, false)
    }

    render(){
        const component1 = () => <Text>Incomplete</Text>
        const component2 = () => <Text>Issue</Text>
        const component3 = () => <Text>Complete</Text>
        const { selectedIndex } = this.state
        const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }]
        return(
            <View style={{flex:3}}>
                <View style={{flex:1}}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{height: 40}} 
                        selectedButtonStyle={{backgroundColor: '#EEBB4D'}}
                    />
                </View>
                
                <View styles={{flex:1}}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.handleSubmit}>
                        <Text style={{color:'white'}}>
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
        height: 250,
        width: 350
    },
    hideButton:{
        flex:0.5,
        backgroundColor:'#fff',
        alignItems:'flex-end',
        marginRight:10
    },
    submitButton:{
        backgroundColor:'#184D47',
        alignItems:'center',
        justifyContent:'center',
        height:45,
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

export default UpdateProgress;