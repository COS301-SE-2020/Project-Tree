import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, Button } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Container, Icon, Form, Item, Label, Input, Picker } from 'native-base';

export default class UpdateProject extends Component {
    constructor(props){
        super(props);
        this.state = {
            projName: null,
            projDescription:null
        }
    }
    // constructor(props){
    //     super(props);
    //     this.state = { 
    //         show:false, 
    //         id: this.props.project.id,
    //         name: this.props.project.name, 
    //         description: this.props.project.description,
    //         up_pm_Create: this.props.project.permissions[0] === true,
    //         up_pm_Delete: this.props.project.permissions[1] === true,
    //         up_pm_Update: this.props.project.permissions[2] === true,
    //         up_rp_Create: this.props.project.permissions[3] === true,
    //         up_rp_Delete: this.props.project.permissions[4] === true,
    //         up_rp_Update: this.props.project.permissions[5] === true,
    //         up_r_Create: this.props.project.permissions[6] === true,
    //         up_r_Delete: this.props.project.permissions[7] === true,
    //         up_r_Update: this.props.project.permissions[8] === true
    //     };
    //     this.showModal = this.showModal.bind(this);
    //     this.hideModal = this.hideModal.bind(this);
    //     this.handleSubmit = this.handleSubmit.bind(this);
    //     this.refreshState = this.refreshState.bind(this);
    // }

    // refreshState(){
    //     this.setState({
    //         id: this.props.project.id,
    //         name: this.props.project.name, 
    //         description: this.props.project.description,
    //         up_pm_Create: this.props.project.permissions[0] === true,
    //         up_pm_Delete: this.props.project.permissions[1] === true,
    //         up_pm_Update: this.props.project.permissions[2] === true,
    //         up_rp_Create: this.props.project.permissions[3] === true,
    //         up_rp_Delete: this.props.project.permissions[4] === true,
    //         up_rp_Update: this.props.project.permissions[5] === true,
    //         up_r_Create: this.props.project.permissions[6] === true,
    //         up_r_Delete: this.props.project.permissions[7] === true,
    //         up_r_Update: this.props.project.permissions[8] === true
    //     })
    // }

    // async handleSubmit(event){
    //     event.preventDefault();
    //     let data = stringifyFormData(new FormData(event.target));
    //     $.post( "/project/update", JSON.parse(data) , response => {
    //         this.props.setProjectInfo(response);
    //     })
    //     .done(() => {
    //         this.setState({ show:false })
    //     })
    //     .fail(() => {
    //         alert( "Unable to uodate project" );
    //     })
    //     .always(() => {
    //         //alert( "finished" );
    //     });
    // }

    render(){
        return(
            <Modal animationType="slide" transparent={true} visible={this.props.modalVisible} onRequestClose={() => { this.props.setModalVisible(!this.props.modalVisible); }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
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
                            </Form>
                            <Button onPress={()=>
                                {
                                    console.log(this.state.projName)
                                    console.log(this.state.projDescription)
                                }} title="hi">
                            </Button>
                        </Container>
                    </View>
                </View>
            </Modal>
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
    container: { flex: 1, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff', width: 200 },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { margin: 6, textAlign: 'center' }
});