import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, Button } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Icon } from 'native-base';
import $ from 'jquery'

export default class DeleteProject extends Component{ 
    constructor(props){
        super(props);
        this.deleteConfirmation = this.deleteConfirmation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    deleteConfirmation() {
        Alert.alert(
          'Are you sure?',
          'Are you sure you want to delete ' + this.props.project.name + '?',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'YES', onPress: () => this.handleSubmit()},
          ]
        );
    }

    async handleSubmit(){
        this.props.setModalVisible(!this.props.modalVisible);

        let data = {
            dp_id: this.props.project.id
        }

        const response = await fetch('http://projecttree.herokuapp.com/project/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }); 
        
        const body = await response.json();
        this.props.setProjectInfo(body)
        
        // $.post( "http://projecttree.herokuapp.com/project/delete", JSON.stringify(data)).done(response => console.log(response))
    }
    
    render(){
        return(
            <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.deleteConfirmation()}>
                <Icon type="FontAwesome" name="trash" />
            </TouchableHighlight>
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
        elevation: 5
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
    container: { flex: 1, paddingTop: 30, backgroundColor: '#fff', width: "100%" },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});