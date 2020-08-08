import React, { Component } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import DeleteProject from '../Home/DeleteProject'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import UpdateProject from './UpdateProject'

export default class SettingsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {projects:null, project:null, modalVisible:false, tableData: null, editing:false };
        //this.toggleActionSheet = this.toggleActionSheet.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
        this.setEditing = this.setEditing.bind(this)
    }

    setProjectInfo(project){
        let projects = this.state.projects;
        if(project.delete === undefined){
            projects = projects.map((proj) => {
                if(proj.id === project.id) proj = project;
                return proj;
            });
            if(JSON.stringify(projects) === JSON.stringify(this.state.projects)) projects.push(project)
            this.setState({projects: projects, project: project})
        }
        else{
            projects = projects.filter(proj => proj.id !== project.delete);
            this.setState({projects: projects});
        } 
    }

    setEditing(val){
        this.setState({editing: val})
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible});
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
        this.setState({projects:body.nodes, project:body.nodes[0]});
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
        return (
            <ScrollView style={styles.cardView}>
                <View>
                    <Content>
                        {this.state.project !== null && this.state.modalVisible === true ? <UpdateProject project={this.state.project} modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} setProjectInfo={this.setProjectInfo} setEditing={this.setEditing} /> : null}
                        <Card>
                            <CardItem>
                                <Body style={{alignItems:'center', justifyContent:'center'}}>
                                    <Text>{this.state.project.name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text>
                                        {this.state.project.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <TouchableOpacity style={styles.viewButton} onPress={()=>{this.props.setCurrentProject(this.state.project);}}>
                                    <Icon type="FontAwesome" name="eye"></Icon>
                                </TouchableOpacity>
                                <DeleteProject project={this.state.project} setProjectInfo={this.props.setProjectInfo}/>
                                <TouchableOpacity style={styles.editButton} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                    <Icon type="FontAwesome" name="edit" ></Icon>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    {this.settingPermissions(this.state.project)}
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>
                                    <Text>MORE INFO</Text>

                                </Body>
                            </CardItem>
                        </Card>
                    </Content>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardView: {
        marginBottom:60,
        margin:10
    },
    container:{
        flex:1,
        paddingTop:20,
        backgroundColor:'#fff',
        width:'100%'
    },
    descriptionView:{
        minHeight:90,
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
        //margin:3,
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
        //margin:3,
    }
})