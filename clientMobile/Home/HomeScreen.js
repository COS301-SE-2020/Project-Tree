import React, { Component } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Spinner } from 'native-base';
import DeleteProject from '../Home/DeleteProject'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import UpdateProject from './UpdateProject'
import Drawer from 'react-native-drawer'
import styled from 'styled-components/native'
import IconEntypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import ProjectList from './ProjectList';
import { useNavigation } from '@react-navigation/native';
import SendProjectNotification from '../NoticeBoard/ProjectWideNotification';
import ProgressDashboard from './ProgressDashboard';

function GoToTree() {
    const navigation = useNavigation();
  
    return (
        <TouchableOpacity style={styles.viewButton} onPress={() => {navigation.navigate('Project Tree');}} >
            <Icon type="FontAwesome" name="eye" style={{color:'white'}}></Icon>
        </TouchableOpacity>
    );
}

class SelectProject extends Component{
    render(){
        return(
            <View style={{
            justifyContent:"center", 
            alignItems:"center",
            flex:1}}
            >
                <TouchableHighlight 
                onPress={() => {this.props.setDrawerVisible(true)}} 
                style={{backgroundColor:'#184D47',
                    alignItems:'center',
                    justifyContent:'center',
                    height:45,
                    borderColor:'#EEBB4D',
                    borderWidth:2,
                    borderRadius:5,
                    shadowColor:'#000',
                    shadowOffset:{
                        width:0,
                        height:1
                    },
                    shadowOpacity:0.8,
                    shadowRadius:2,  
                    elevation:3}}
                >
                    <Text style={{color:'white'}}>
                    Please select a project
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const Screen = styled.View
`
	flex: 1;
  background-color: #f2f2f2;
`

class Home extends Component{
	constructor(props) {
		super(props);
		this.state = {drawerVisible:false, token: null, projects:null};
        this.setDrawerVisible = this.setDrawerVisible.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
	}

	async componentDidMount()
	{
        let token = null
		await AsyncStorage.getItem('sessionToken')
		.then(async (value) => {
            token = JSON.parse(value);
            const response = await fetch('http://10.0.2.2:5000/project/get',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({creatorID: token}),
            });
            const body = await response.json();

            this.setState({projects:body.projects, token:token});
        }); 
    }

    setProjectInfo(project){
        let projects = this.state.projects;
        if(project.delete === undefined){
            projects = projects.map((proj) => {
                if(proj.id === project.id) proj = project;
                return proj;
            });
            if(JSON.stringify(projects) === JSON.stringify(this.state.projects)) projects.push(project)
            this.setState({projects: projects});
            this.props.setSelectedProject(project);
        }
        else{
            projects = projects.filter(proj => proj.id !== project.delete);
            this.setState({projects: projects});
            this.props.setSelectedProject(null);
        } 
    }
        
    componentWillUnmount(){
        this._isMounted = false;
    }

	setDrawerVisible(mode){
		this.setState({drawerVisible:mode});
	}

	render(){
        if(this.state.projects === null){
            return <Spinner />
        } 

		return(
			<Screen>
				<Drawer
					type="overlay"
					open={this.state.drawerVisible}
                    content={this.state.token !== null && this.state.projects !== undefined? <ProjectList 
                        setCurrentProject={this.props.setSelectedProject} 
                        setDrawerVisible={this.setDrawerVisible} 
                        token={this.state.token}
                        projects={this.state.projects}
                        setProjectInfo={this.setProjectInfo}
                        /> : null}
					tapToClose={true}
					openDrawerOffset={0.2} 
					panCloseMask={0.2}
					closedDrawerOffset={-3}
					tweenHandler={(ratio) => ({
						main: {
							opacity:(2-ratio)/2
						}
					})}
        		>
					<TouchableOpacity style={{height:45}} onPress={()=>{this.setDrawerVisible(true)}}>
						<IconEntypo name="menu" color="#184D47" size={50} style={{marginLeft:5, marginTop:5}}/>
					</TouchableOpacity>
					<HomeScreen 
                        project={this.props.project}
                        user={this.props.user} 
						setCurrentProject={this.props.setSelectedProject} 
						setDrawerVisible={this.setDrawerVisible}
                        navigation={this.props.navigation}
                        setProjectInfo={this.setProjectInfo}
					/>
			  	</Drawer>
			</Screen>
		)
	}
}

class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {projects:null, project:null, modalVisible:false, tableData: null, editing:false };
        this.setModalVisible = this.setModalVisible.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
        this.setEditing = this.setEditing.bind(this)
    }

    setProjectInfo(project, drawerVisible){
        this.props.setCurrentProject(project);
        this.props.setDrawerVisible(drawerVisible);
    }

    setEditing(val){
        this.setState({editing: val})
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible});
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
        if(this.props.project === null) 
            return(
                    <SelectProject setDrawerVisible={this.props.setDrawerVisible}/>
            );

        return (
            <ScrollView style={styles.cardView}>
                <View>
                    <Content>
                        {this.props.project !== null && this.state.modalVisible === true ? <UpdateProject project={this.props.project} modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} setProjectInfo={this.props.setProjectInfo} setEditing={this.setEditing} /> : null}
                        <Card>
                            <CardItem>
                                <Body style={{alignItems:'center', justifyContent:'center'}}>
                                    <Text>{this.props.project.name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text>
                                        {this.props.project.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <GoToTree />
                                <DeleteProject project={this.props.project} setProjectInfo={this.props.setProjectInfo}/>
                                <TouchableOpacity style={styles.editButton} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                    <Icon type="FontAwesome" name="edit" style={{color:'white'}}></Icon>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem>
                                <SendProjectNotification project={this.props.project} user={this.props.user}/>
                            </CardItem>
                            <CardItem>
                                <View style={{width:'100%', alignItems:"center"}}>
                                    <ProgressDashboard project={this.props.project}/>
                                </View>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    {this.settingPermissions(this.props.project)}
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
        backgroundColor:'#184D47',
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
        backgroundColor:'#184D47',
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
        elevation:1
    }
});

export default Home;