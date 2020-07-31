import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity, TextInput } from "react-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Container, Icon, Form, Item, Label, Input, Picker, StyleProvider, Button } from 'native-base';
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';

class UpdateProject extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Modal animationType="slide" transparent={true} visible={this.props.modalVisible} onRequestClose={() => this.props.setModalVisible(!this.props.modalVisible,false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {this.props.project !== undefined ? <CreateProjectForm setProjectInfo={this.props.setProjectInfo} setModalVisible={this.props.setModalVisible} project={this.props.project} /> : null}
                        <TouchableHighlight style={{ ...styles.openButton, backgroundColor: "#2196F3" }} onPress={() => this.props.setModalVisible(!this.props.modalVisible,false)}>
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

        const tempArr = []
        for(let x = 0; x < this.props.project.permissions.length; x++){
            if(this.props.project.permissions[x] === true){
                tempArr.push('x')
            }else{
                tempArr.push('')
            }
        }

        this.state = {projName:this.props.project.name, projDescription:this.props.project.description, tableFormData: tempArr};
        this.setElementClicked = this.setElementClicked.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setElementClicked(index){
        let array = this.state.tableFormData;
        array[index] === '' ? array[index] = 'x' : array[index] = '';
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

        this.props.setModalVisible(false,false);

        let permissions = this.state.tableFormData;
        for(var count=0; count<9; count++){
            permissions[count] === 'x' ? permissions[count] = true : permissions[count] = undefined;
        }

        let data = {
            up_id: this.props.project.id,
            up_name: this.state.projName,
            up_description: this.state.projDescription,
            up_pm_Create: permissions[0],
            up_pm_Delete: permissions[1],
            up_pm_Update: permissions[2],
            up_rp_Create: permissions[3],
            up_rp_Delete: permissions[4],
            up_rp_Update: permissions[5],
            up_r_Create: permissions[6],
            up_r_Delete: permissions[7],
            up_r_Update: permissions[8],
        }

        data = JSON.stringify(data);

        const response = await fetch('http://projecttree.herokuapp.com/project/update', {
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

    render(){
        return(
            <React.Fragment>
                <Text>All fields are optional</Text>
                <Form>
                    <Item>
                        <Input onChangeText={val => this.setState({ projName: val })} value={this.state.projName}/>
                    </Item>
                    <Item floatingLabel>
                        <Input onChangeText={val => this.setState({ projDescription: val })} value={this.state.projDescription}/>
                    </Item>
                </Form>
                <PermissionsTable tableFormData={this.state.tableFormData} setElementClicked={this.setElementClicked}/>
                <View style={{ padding: 5 }}>
                    <StyleProvider style={getTheme(buttonStyling)}>
                        <Button block light onPress={this.handleSubmit}>
                            <Text>Submit</Text>
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

        let tableData = [
            ['', 'Package Managers', 'Responsible Persons', 'Resources'],
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

export default UpdateProject