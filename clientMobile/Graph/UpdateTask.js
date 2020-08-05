import React, { Component } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from "react-native";
import { Icon, Label, Form, Item, Input, StyleProvider, Button } from 'native-base';
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';
import DateTimePicker from '@react-native-community/datetimepicker';

class UpdateTask extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal animationType="slide" transparent={true} visible={this.props.modalVisibility} onRequestClose={()=>this.props.toggleVisibility(true, false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <UpdateTaskForm task={this.props.task} toggleVisibility={this.props.toggleVisibility}/>
						<TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>this.props.toggleVisibility(true, false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
		)
	}
}

class UpdateTaskForm extends Component{
    constructor(props){
        super(props);
        
        let startDate = this.props.task.startDate.year.low+"-"+this.props.task.startDate.month.low+"-"+this.props.task.startDate.day.low;
        console.log(new Date(startDate));
        // console.log(this.props.task.startDate.year.low, this.props.task.startDate.month.low, this.props.task.startDate.day.low)
        // console.log(new Date(this.props.task.startDate.year.low, (this.props.task.startDate.month.low-1), this.props.task.startDate.day.low))

        this.state ={  
                    taskName:this.props.task.name,
                    taskDescription:this.props.task.description, 
                    startDate: new Date(this.props.task.startDate.year.low, this.props.task.startDate.month.low, this.props.task.startDate.day.low), 
                    endDate: new Date(this.props.task.endDate.year.low, this.props.task.endDate.month.low, this.props.task.endDate.day.low), 
                    taskDuration:this.props.task.duration, 
                    startDatePickerVisible:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartDateSelect = this.handleStartDateSelect.bind(this);
        this.handleDuration = this.handleDuration.bind(this);
        this.formatValidateInput = this.formatValidateInput.bind(this);
    }

    handleStartDateSelect(event, selectedDate){
        this.setState({startDate:selectedDate, startDatePickerVisible:false});
        this.setEndDate(selectedDate, undefined);
    }

    handleDuration(duration){
        this.setState({taskDuration:duration});
        this.setEndDate(undefined, duration);
    }

    setEndDate(startDate, duration){
        if(duration != undefined){
            duration = parseInt(duration);
            if(isNaN(duration)) return;
            let result = new Date(this.state.startDate);
            result.setDate(result.getDate() + duration);
            this.setState({endDate:result});
        }

        else{
            let result = new Date(startDate);
            result.setDate(result.getDate() + parseInt(this.state.taskDuration));
            this.setState({endDate:result});
        }
    }

    formatValidateInput(){
        if(this.state.taskName === null || this.state.taskDescription === null)
        {
            alert("You have not entered all the details");
            return null;
        }

        let data = {
            ct_Name : this.state.taskName,
            ct_startDate : this.state.startDate.toISOString().substr(0, 10),
            ct_duration : parseInt(this.state.taskDuration),
            ct_endDate : this.state.endDate.toISOString().substr(0, 10),
            ct_description : this.state.taskDescription,
            ct_pid : this.props.projectID
        }

        return data;
    }

    async handleSubmit(){
        // let input = this.formatValidateInput();
        // if(input === null){
        //     return;
        // }

        // let projectData = await this.props.getProjectInfo();
        // projectData.changedInfo = input;
        // projectData = JSON.stringify(projectData)
        
        // const response = await fetch('http://projecttree.herokuapp.com/task/add', {
        //     method: 'POST',
        //     headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     },
        //     body: projectData,
        // }); 
        
        // const body = await response.json();  
        // console.log(body);
        // this.props.setModalVisible(false);
        //await this.props.setTaskInfo(body.nodes, body.rels, body.displayNode, body.displayRel);
    }

    render()
    {
        return(
            <View style={{width:300, height:300}}>
                <Form>
                    <Item floatingLabel>
                        <Label>Name of Task</Label>
                        <Input 
                            value = {this.state.taskName}
                            onChangeText={val => this.setState({ taskName: val })}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>Description of Task</Label>
                        <Input 
                            value = {this.state.taskDescription}
                            onChangeText={val => this.setState({ taskDescription: val })}
                        />
                    </Item>
                    <Item floatingLabel disabled>
                        <Label>Start Date</Label>
                        <Input value={this.state.startDate.toISOString().substr(0, 10)}
                        />
                        <Icon type="AntDesign" name="plus" onPress={()=>{this.setState({startDatePickerVisible:true})}}/>
                    </Item>
                    <Item floatingLabel disabled>
                        <Label>Duration (days)</Label>
                        <Input value={this.state.taskDuration.toString()}
                            onChangeText={this.handleDuration}
                        />
                    </Item>
                    <Item floatingLabel disabled>
                        <Label>End Date</Label>
                        <Input value={this.state.endDate.toISOString().substr(0, 10)}
                        />
                    </Item>
                </Form>
                {this.state.startDatePickerVisible && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.startDate}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={this.handleStartDateSelect}
                    />
                )}
                <View style={{ padding: 5 }}>
                    <StyleProvider style={getTheme(buttonStyling)}>
                        <Button block light onPress={this.handleSubmit}>
                            <Text>
                                Submit
                            </Text>
                        </Button>
                    </StyleProvider>
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

export default UpdateTask;