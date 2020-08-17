import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button, Container } from 'native-base';
import DeleteTask from './DeleteTask';
import UpdateTask from './UpdateTask';
import UpdateProgress from '../UpdateProgress'

class TaskModal extends Component {
	constructor(props){
        super(props);
        this.state = {displayTaskModal:true, displayUpdateModal:false, displayProgressModal:false}
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.toggleProgressModal = this.toggleProgressModal.bind(this)
    }
    
    toggleVisibility(taskModal, updateModal, selectedTask){
        if(selectedTask !== undefined){
            this.setState({displayTaskModal: taskModal, displayUpdateModal: updateModal});
            this.props.displayTaskDependency(null, null)
        }

        this.setState({displayTaskModal: taskModal, displayUpdateModal: updateModal});
    }

    toggleProgressModal(taskModal, progressModal){
        this.setState({displayTaskModal: taskModal, displayProgressModal: progressModal});
    }

	render(){      
        if(this.props.selectedTask === null) return null;

		return(
            <React.Fragment>
                <UpdateTask task={this.props.selectedTask} modalVisibility={this.state.displayUpdateModal} toggleVisibility={this.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} displayTaskDependency={this.props.displayTaskDependency}/>
                <UpdateProgress project={this.props.project} task={this.props.selectedTask} modalVisibility={this.state.displayProgressModal} toggleProgressModal={this.toggleProgressModal} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} />
                <Modal animationType="fade" transparent={true} visible={this.state.displayTaskModal} onRequestClose={()=>this.props.displayTaskDependency(null, null)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={styles.hideButton} onPress={()=>this.props.displayTaskDependency(null, null)}>
                                <Icon type="FontAwesome" name="close" />
                            </TouchableOpacity>
                            <View style={{alignItems:'center'}}>
                                <Text style={{fontSize:30, color:'#184D47'}}>
                                {this.props.selectedTask.name}
                                </Text>
                                <View style={{backgroundColor: '#EEBB4D', height: 1, width: "60%", marginBottom:10}}></View>
                            </View>
                            <Text style={styles.modalText}>
                                {this.props.selectedTask.description}
                            </Text>
                            <Text style={styles.modalText}>
                                Start Date: {this.props.selectedTask.startDate.year.low+"-"+this.props.selectedTask.startDate.month.low+"-"+this.props.selectedTask.startDate.day.low}
                            </Text>
                            <Text style={styles.modalText}>
                                End Date: {this.props.selectedTask.endDate.year.low+"-"+this.props.selectedTask.endDate.month.low+"-"+this.props.selectedTask.endDate.day.low}
                            </Text>
                            <Text style={styles.modalText}>
                                Duration: {this.props.selectedTask.duration} days
                            </Text>
                            <View style={{flex:1}}>
                                <View style={{flex:1}}>
                                    <TouchableOpacity style={styles.editButton} onPress={()=>this.toggleVisibility(false, true)}>
                                        <Icon type="AntDesign" name="edit" style={{color:'white'}}><Text>&nbsp;Edit</Text></Icon>
                                    </TouchableOpacity>
                                </View>

                                <View style={{flex:1}}>
                                    <DeleteTask task={this.props.selectedTask} toggleVisibility={this.toggleVisibility} getProjectInfo={this.props.getProjectInfo} setProjectInfo={this.props.setProjectInfo} />
                                </View>

                                <View style={{flex:1}}>
                                    <TouchableOpacity style={styles.editButton} onPress={()=>this.toggleProgressModal(false, true)}>
                                        <Icon type="Entypo" name="progress-one" style={{color:'white', paddingBottom:10}}><Text>&nbsp;Update Progress</Text></Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </React.Fragment>
		)
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
        height: 470,
        width: 350
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalText: {
		marginBottom: 15,
        textAlign: "center",
        fontSize:20
	},
    hideButton:{
        flex:0.15,
        backgroundColor:'#fff',
        alignItems:'flex-end',
        marginRight:10,
        marginTop:10
    },
    editButton:{
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
	container: { flex: 1, paddingTop: 30, backgroundColor: '#fff', width: "100%" },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});

export default TaskModal;