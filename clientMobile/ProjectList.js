import React, {Component} from 'react';
import {Content} from 'native-base';
import {Text, View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
// import ProjectModal from './ProjectModal'
// import CreateProject from './CreateProject'
// import UpdateProject from './UpdateProject'

class ProjectListDrawer extends Component {
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
            <View style={{flex:1, backgroundColor:"#184D47"}}>
                <ProjectList projects={this.state.projects} setCurrentProject={this.props.setCurrentProject}/>
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
                    style={styles.projectButtons}
                    onPress={() => this.props.setCurrentProject(project)}>
                    <Text style={styles.buttonText}>
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
    projectButtons:{
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
    buttonText:{
        color:'#000'
    }
})

export default ProjectListDrawer;