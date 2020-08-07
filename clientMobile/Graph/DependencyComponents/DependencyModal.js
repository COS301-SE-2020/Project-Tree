import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button, Container } from 'native-base';
// import DeleteTask from './DeleteTask';
// import UpdateTask from './UpdateTask';

class DependencyModal extends Component {
	constructor(props){
        super(props);
        this.state = {displayTaskModal:true, displayUpdateModal:false, displayProgressModal:false}
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }
    
    toggleVisibility(taskModal, updateModal, selectedTask){
        if(selectedTask !== undefined){
            this.setState({displayTaskModal: taskModal, displayUpdateModal: updateModal});
        }

        this.setState({displayTaskModal: taskModal, displayUpdateModal: updateModal});
    }

	render(){      
        if(this.props.selectedDependency === null) return null;

        return(
            <React.Fragment>
                {/* <UpdateTask task={this.props.selectedTask} modalVisibility={this.state.displayUpdateModal} toggleVisibility={this.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} displayTaskDependency={this.props.displayTaskDependency}/> */}
                <Modal animationType="slide" transparent={true} visible={this.state.displayTaskModal} onRequestClose={()=>this.props.displayTaskDependency(null, null)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View>
                                <Text>
                                    {this.props.getName(this.props.selectedDependency.source)+"→"+this.props.getName(this.props.selectedDependency.target)}
                                </Text>
                                <Text>
                                    {this.props.selectedDependency.relationshipType === "fs" ? "Finish→Start" : "Start→Start"}
                                </Text>
                                <Text>
                                    {"Duration: "+this.props.selectedDependency.duration}
                                </Text>
                            </View>

                            {/* <Container>
                                <View style={{flex:1, marginTop:200}}>
                                    <TouchableHighlight onPress={()=>this.toggleVisibility(false, true)}>
                                        <Icon type="AntDesign" name="edit" />
                                    </TouchableHighlight>
                                    <DeleteTask task={this.props.selectedTask} toggleVisibility={this.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} />
                                </View>
                            </Container> */}
                            
                            <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>this.props.displayTaskDependency(null, null)} toggleVisibility={this.toggleVisibility}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </React.Fragment>
		)
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
        width : 400,
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

export default DependencyModal;