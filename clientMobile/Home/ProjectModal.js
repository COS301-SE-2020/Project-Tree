import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, Button } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Icon } from 'native-base';
import DeleteProject from './DeleteProject'

class ProjectModal extends Component {
    render() {
        const tableData = []
        const tempArr = []
        for(let x = 0; x < this.props.project.permissions.length; x++){
            if(this.props.project.permissions[x] === true){
                tempArr.push("x")
            }
            else{
                tempArr.push("")
            }
        }

        while(tempArr.length) tableData.push(tempArr.splice(0,3));

        return (
            <Modal animationType="slide" transparent={true} visible={this.props.modalVisible} onRequestClose={()=>this.props.setModalVisible(!this.props.modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{this.props.project.name}</Text>
                        <Text style={styles.modalText}>{this.props.project.description}</Text>
                        <View style={styles.container}>
                            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                <Row data={["","Create","Delete","Update"]} style={styles.head} textStyle={styles.text}/>
                                <TableWrapper style={styles.wrapper}>
                                    <Col data={["Package Manager","Responsible Person","Resource"]} style={styles.title} heightArr={[40,40,40]} textStyle={styles.text}/>
                                    <Rows data={ tableData } flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                                </TableWrapper>
                            </Table>
                        </View>
                        <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={()=>{
                                this.props.setModalVisible(!this.props.modalVisible);
                                this.props.setCurrentProject(this.props.project);
                            }}>
                            <Icon type="FontAwesome" name="eye"><Text>&nbsp;View</Text></Icon>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.props.setModalVisible(!this.props.modalVisible)}>
                            <Icon type="FontAwesome" name="close" />
                        </TouchableHighlight>
                        <DeleteProject project={this.props.project} setProjectInfo={this.props.setProjectInfo} modalVisible={this.props.modalVisible} setModalVisible={this.props.setModalVisible}/>
                        <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.props.setModalVisible(!this.props.modalVisible,true)}>
                            <Icon type="FontAwesome" name="edit" />
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
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

export default ProjectModal;