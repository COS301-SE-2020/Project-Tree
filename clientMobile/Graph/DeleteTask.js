import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, Button } from "react-native";
import { Icon } from 'native-base';

class DeleteTask extends Component{ 
    constructor(props){
        super(props);
        this.deleteConfirmation = this.deleteConfirmation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    deleteConfirmation() {
        Alert.alert(
          'Are you sure?',
          'Are you sure you want to delete ' + this.props.task.name + '?',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'YES', onPress: () => this.handleSubmit()},
          ]
        );
    }

    async handleSubmit(){
        let projectData = await this.props.getProjectInfo();
        projectData.changedInfo = {
            id : this.props.task.id
        }
        projectData = JSON.stringify(projectData)
        
        const response = await fetch('http://projecttree.herokuapp.com/task/delete', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: projectData,
        }); 
        
        const body = await response.json();  
        this.props.toggleVisibility(false, false);
        this.props.setProjectInfo(body.nodes, body.rels);
    }
    
    render(){
        return(
            <TouchableHighlight onPress={() => this.deleteConfirmation()}>
                <Icon type="FontAwesome" name="trash" />
            </TouchableHighlight>
        );
    }
}

export default DeleteTask;