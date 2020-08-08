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
            <Modal animationType="fade" transparent={true} visible={this.props.modalVisible} onRequestClose={() => this.props.setModalVisible(!this.props.modalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.hideButton} onPress={() => this.props.setModalVisible(!this.props.modalVisible)}>
                            <Icon type="FontAwesome" name="close" />
                        </TouchableOpacity>
                        {this.props.project !== undefined ? <UpdateProjectForm setProjectInfo={this.props.setProjectInfo} setModalVisible={this.props.setModalVisible} project={this.props.project} /> : null}
                    </View>
                </View>
            </Modal>
        )
    }
}

class UpdateProjectForm extends Component{
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
                <Form>
                    <Item>
                        <Input onChangeText={val => this.setState({ projName: val })} value={this.state.projName}/>
                    </Item>
                    <Item floatingLabel>
                        <Input onChangeText={val => this.setState({ projDescription: val })} value={this.state.projDescription}/>
                    </Item>
                </Form>
                <PermissionsTable tableFormData={this.state.tableFormData} setElementClicked={this.setElementClicked}/>
                <View styles={{padding:10}}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.handleSubmit}>
                        <Text>
                            Submit
                        </Text>
                    </TouchableOpacity>
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
                    <Text style={styles.text}>{value}</Text>
                </View>
            </TouchableOpacity>
        );

        let tableHead = ['', 'Create', 'Delete', 'Update']
        let tableData = [
                ['Package Managers', elementButton(this.props.tableFormData[0], 0), elementButton(this.props.tableFormData[1], 1), elementButton(this.props.tableFormData[2], 2)],
                ['Responsible Persons', elementButton(this.props.tableFormData[3], 3), elementButton(this.props.tableFormData[4], 4), elementButton(this.props.tableFormData[5], 5)],
                ['Resources', elementButton(this.props.tableFormData[6], 6), elementButton(this.props.tableFormData[7], 7), elementButton(this.props.tableFormData[8], 8)]
            ];

        return (
            <View style={styles.container}>
                <Table borderStyle={{borderWidth:1}}>
                    <Row data={tableHead} flexArr={[2,1,1,1]} style={styles.head} textStyle={styles.text}/>
                    <TableWrapper style={styles.wrapper}>
                            <Rows data={tableData} flexArr={[2,1,1,1]} style={styles.row} textStyle={styles.text}/>
                    </TableWrapper>
                </Table>
            </View>
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
    text: { margin: 6, textAlign: 'center' },
    hideButton:{
        flex:0.15,
        backgroundColor:'#fff',
        alignItems:'flex-end',
        marginRight:10,
        marginTop:10
    },
    submitButton:{
        backgroundColor:'#96BB7C',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        borderColor:'#EEBB4D',
        borderWidth:2,
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
    container:{
        flex:1,
        paddingTop:20,
        backgroundColor:'#fff',
    },
    head:{
        height:40,
        backgroundColor:'#96BB7C',
    },
    wrapper:{
        flexDirection:'row'
    },
    row:{
        height:40
    },
});

export default UpdateProject