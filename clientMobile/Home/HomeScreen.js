import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { Alert, Modal, StyleSheet, Text, View, TouchableHighlight } from "react-native";
import buttonStyling from '../native-base-theme/variables/buttonStylingProjList';
import getTheme from '../native-base-theme/components';
import ProjectModal from './ProjectModal'
import CreateProject from './CreateProject'
import UpdateProject from './UpdateProject'

class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {projects:null, project:null, modalVisible:false, tableData: null, editing:false };
        this.toggleActionSheet = this.toggleActionSheet.bind(this);
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
    
    toggleActionSheet = (selectedProject) => {
        this.setState({project: selectedProject});
        this.setModalVisible(true);
    }
  
    setModalVisible = (visible, edit) => {
        if(edit !== undefined){
            this.setState({editing: edit})
        }
        else{
            this.setState({ modalVisible: visible, editing:false });
        }
            
    }

    async componentDidMount(){
        const response = await fetch('http://projecttree.herokuapp.com/project/get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:null,
        });
        const body = await response.json();
        this.setState({projects:body.nodes});
    }
  
    render() {
        return (
            <Content>
                <View padder style={{ padding: 5 }}>
                    {this.state.project !== null && this.state.editing !== true ? <ProjectModal project={this.state.project} modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} setProjectInfo={this.setProjectInfo} setEditing={this.setEditing} setCurrentProject={this.props.setCurrentProject}/> : null}
                    {this.state.project !== null && this.state.editing === true ? <UpdateProject project={this.state.project} modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} setProjectInfo={this.setProjectInfo} setEditing={this.setEditing} /> : null}
                    <ProjectList projects={this.state.projects} toggleActionSheet={this.toggleActionSheet}/>
                    <CreateProject setProjectInfo={this.setProjectInfo}/>
                </View>
            </Content>
        );
    }
}
  
class ProjectList extends React.Component{
    render(){
        if(this.props.projects === null) return null;
        const projects = this.props.projects;
        const listItems = projects.map((project, i) =>
            <View key={i} style={{ padding: 5 }}>
                <StyleProvider style={getTheme(buttonStyling)}>
                    <Button block light onPress={() => this.props.toggleActionSheet(project)}>
                        <Text>
                            {project.name}
                        </Text>
                    </Button>
                </StyleProvider>
            </View>
        );

        return(
            <React.Fragment>
                {listItems}
            </React.Fragment>
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

export default HomeScreen;