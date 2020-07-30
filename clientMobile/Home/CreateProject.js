import React, { Component } from 'react';
import { Alert, Modal, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from "react-native";
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';

class CreateProject extends Component{
    constructor(props){
        super(props);
        this.state = {modalVisible:false};
        this.setModalVisible = this.setModalVisible.bind(this)
    }

    setModalVisible(visible){
        this.setState({ modalVisible: visible });
    }

    render(){
        return(
            <React.Fragment>
                <CreateProjectModal modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} setProjectInfo={this.props.setProjectInfo}/>
                <View style={{ padding: 5 }}>
                    <StyleProvider style={getTheme(buttonStyling)}>
                        <Button block dark onPress={()=>this.setModalVisible(true)}>
                            <Text>
                                Create Project
                            </Text>
                        </Button>
                    </StyleProvider>
                </View>
            </React.Fragment>
        )
    }
}

class CreateProjectModal extends Component{
    render(){
        return(
            <Modal animationType="slide" transparent={true} visible={this.props.modalVisible} onRequestClose={() => this.props.setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <CreateProjectForm setProjectInfo={this.props.setProjectInfo} setModalVisible={this.props.setModalVisible}/>
                        <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.props.setModalVisible(false)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
}

class CreateProjectForm extends Component{
    constructor(props){
		super(props);
        this.state = {projName:null, projDescription:null, tableFormData : [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']};
        this.setElementClicked = this.setElementClicked.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setElementClicked(index){
        let array = this.state.tableFormData;
        array[index] === ' ' ? array[index] = 'x' : array[index] = ' ';
        this.setState({tableFormData:array});
    }

    async handleSubmit(){
        if(this.state.projName == null){
            alert("Please enter a project name");
            return;
        }

        if(this.state.projDescription == null){
            alert("Please enter a project description");
            return;
        }

        this.props.setModalVisible(false);

        let permissions = this.state.tableFormData;
        for(var count=0; count<9; count++){
            permissions[count] == 'x' ? permissions[count] = true : permissions[count] = undefined;
        }

        let data = {
            cp_Name : this.state.projName,
            cp_Description : this.state.projDescription,
            cp_pm_Create : permissions[0],
            cp_pm_Delete : permissions[1],
            cp_pm_Update : permissions[2],
            cp_rp_Create : permissions[3],
            cp_rp_Delete : permissions[4],
            cp_rp_Update : permissions[5],
            cp_r_Create : permissions[6],
            cp_r_Delete : permissions[7],
            cp_r_Update : permissions[8],
        }

        data = JSON.stringify(data);

        const response = await fetch('http://projecttree.herokuapp.com/project/add', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }); 

        const body = await response.json();
        this.props.setProjectInfo(body)
    }

    render()
    {
        return(
            <React.Fragment>
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
                <PermissionsTable tableFormData={this.state.tableFormData} setElementClicked={this.setElementClicked}/>
                <View style={{ padding: 5 }}>
                    <StyleProvider style={getTheme(buttonStyling)}>
                        <Button block light onPress={this.handleSubmit}>
                            <Text>
                                Submit
                            </Text>
                        </Button>
                    </StyleProvider>
                </View>
            </React.Fragment>
        );
    }
}

class PermissionsTable extends Component{
    render() {
        const elementButton = (value, index) => (
          <TouchableOpacity onPress={() => this.props.setElementClicked(index)}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{value}</Text>
            </View>
          </TouchableOpacity>
        );

        tableData = [
            [' ', 'Package Managers', 'Responsible Persons', 'Resources'],
            ['Create', elementButton(this.props.tableFormData[0], 0), elementButton(this.props.tableFormData[3], 3), elementButton(this.props.tableFormData[6], 6)],
            ['Delete', elementButton(this.props.tableFormData[1], 1), elementButton(this.props.tableFormData[4], 4), elementButton(this.props.tableFormData[7], 7)],
            ['Update', elementButton(this.props.tableFormData[2], 2), elementButton(this.props.tableFormData[5], 5), elementButton(this.props.tableFormData[8], 8)]
        ]

        return (
            <View style={styles.container}>
                <Table style={{flexDirection: 'row'}} borderStyle={{borderWidth: 1}}>
                <TableWrapper style={{flex:1}}>
                    <Cols data={tableData} heightArr={[40, 30, 30, 30, 30]} textStyle={styles.text}/>
                </TableWrapper>
                </Table>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
        height: 440,
        width: 350
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

export default CreateProject