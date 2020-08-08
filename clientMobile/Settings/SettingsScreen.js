import React, { Component } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import DeleteProject from '../Home/DeleteProject'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class SettingsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            projects:null
        }
    }

    async componentDidMount(){
        const response = await fetch('http://projecttree.herokuapp.com/project/get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        const body = await response.json();
        this.setState({projects:body.nodes});
    }

    settingPermissions(proj){
        const tableData = []
        const tempData = ['Package Managers',null,null,null,'Responsible Persons',null,null,null,'Resources',null,null,null]
        const tempArr = []
        for(let x = 0; x < proj.permissions.length; x++){
            if(proj.permissions[x] === true){
                tempArr.push('x')
            }
            else{
                tempArr.push('')
            }
        }

        let tempIndex = 0
        for(let x = 0; x < tempData.length; x++){
            if(tempData[x] === null){
                tempData[x] = tempArr[tempIndex];
                tempIndex++;
            }
        }

        while(tempData.length) tableData.push(tempData.splice(0,4));

        return(
            <View style={styles.container}>
                <Table borderStyle={{borderWidth:1}}>
                    <Row data={['','Create','Delete','Update']} flexArr={[2,1,1,1]} style={styles.head} textStyle={styles.text}/>
                    <TableWrapper style={styles.wrapper}>
                        <Rows data={tableData} flexArr={[2,1,1,1]} style={styles.row} textStyle={styles.text}/>
                    </TableWrapper>
                </Table>
            </View>
        )
    }
    render() {
        if(this.state.projects === null) return null;
        const projects = this.state.projects;
        const listItems = projects.map((project, i) =>
            <View key={i} style={{ padding: 5, height:400, margin:5}}>
                <Content>
                    <Card style={styles.centeredView}>
                        <CardItem>
                            <Left>
                                <Body style={{alignItems:'center', justifyContent:'center'}}>
                                    <Text>{project.name}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <ScrollView style={{height:40}}>
                                    <Text>
                                        {project.description}
                                    </Text>
                                </ScrollView>
                                {this.settingPermissions(project)}
                            </Body>
                        </CardItem>
                        <CardItem style={{flex:1, flexDirection:'row'}}>
                            <TouchableOpacity style={styles.viewButton}>
                                <Icon type="FontAwesome" name="eye"></Icon>
                            </TouchableOpacity>
                            <DeleteProject project={this.props.project} setProjectInfo={this.props.setProjectInfo} modalVisible={this.props.modalVisible} setModalVisible={this.props.setModalVisible}/>
                            <TouchableOpacity style={styles.editButton}>
                                <Icon type="FontAwesome" name="edit" ></Icon>
                            </TouchableOpacity>
                        </CardItem>
                    </Card>
                </Content>
            </View>
            // <View key={i} style={{ padding: 5 }}>
            //     <TouchableOpacity 
            //         style={styles.projectButtons}
            //         onPress={() => this.props.toggleActionSheet(project)}>
            //         <Text style={styles.buttonText}>
            //             {project.name}
            //         </Text>
            //     </TouchableOpacity>
            // </View>
        );

        return (
            <ScrollView style={{marginBottom:15}}>
                {listItems}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        //flex:1,
        margin:5,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container:{
        flex:1,
        paddingTop:20,
        backgroundColor:'#fff',
        width:'100%'
    },
    head:{
        height:40,
        backgroundColor:'#96BB7C',
    },
    wrapper:{
        flexDirection:'row'
    },
    title:{
        flex:1,
        backgroundColor:'#f6f8fa'
    },
    row:{
        height:40
    },
    text:{
        margin:6, 
        textAlign:'center'
        
    },
    viewButton:{
        backgroundColor:'#96BB7C',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        width:'33%',
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
    editButton:{
        backgroundColor:'#96BB7C',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        width:'33%',
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
    }
})