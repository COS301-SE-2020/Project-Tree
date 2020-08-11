import React, {Component} from 'react';
import {Content} from 'native-base';
import {Text, View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import CreateProject from './Home/CreateProject'

class ProjectListDrawer extends Component {
    _isMounted = false;

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

    async componentDidUpdate(){
        this._isMounted = true
        const response = await fetch('http://projecttree.herokuapp.com/project/get',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:null,
        });
        const body = await response.json();

        if(this._isMounted === true) this.setState({projects:body.projects});
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:"#303030", paddingBottom:60}}>
                <View style={{flex:9}}>
                    <ScrollView>
                        <ProjectList 
                            projects={this.state.projects} 
                            setCurrentProject={this.props.setCurrentProject}
                            setDrawerVisible={this.props.setDrawerVisible}
                        />
                    </ScrollView>
                </View>
                <View style={{flex:1}}>
                    <CreateProject 
                        setProjectInfo={this.setProjectInfo} 
                        setDrawerVisible={this.props.setDrawerVisible}
                        setCurrentProject={this.props.setCurrentProject}
                    />
                </View>
            </View>
        );
    }
}
  
class ProjectList extends React.Component{
    render(){
        if(this.props.projects === null) return null;
        const projects = this.props.projects;
        const listItems = projects.map((project, i) =>
            <View key={i} style={{ padding: 5 }}>
                <TouchableOpacity 
                    style={(i%2)==0 ? styles.projectButtons1 : styles.projectButtons2}
                    onPress={() => {
                        this.props.setCurrentProject(project);
                        this.props.setDrawerVisible(false);
                    }}>
                    <Text style={(i%2)==0 ? styles.buttonText1 : styles.buttonText2}>
                        {project.name}
                    </Text>
                </TouchableOpacity>
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
    projectButtons1:{
        backgroundColor:'#EEBB4D',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        borderRadius:5,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:1
        },
        shadowOpacity:0.8,
        shadowRadius:2,  
        elevation:3
    },
    projectButtons2:{
        backgroundColor:'#184D47',
        alignItems:'center',
        justifyContent:'center',
        height:45,
        borderRadius:5,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:1
        },
        shadowOpacity:0.8,
        shadowRadius:2,  
        elevation:3
    },
    buttonText1:{
        color:'#000'
    },
    buttonText2:{
        color:'#FFF'
    }
})

export default ProjectListDrawer;