import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, TouchableHighlight, StyleSheet, Text, Dimensions } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphDrawer';
import CreateTask from './TaskComponents/CreateTask';
import TaskModal from './TaskComponents/TaskModal';
import DependencyModal from './DependencyComponents/DependencyModal';
import CreateDependency from './DependencyComponents/CreateDependency';
import IconEntypo from 'react-native-vector-icons/AntDesign';
import Drawer from 'react-native-drawer'
import styled from 'styled-components/native'
import GraphDrawer from './GraphDrawer';
import { useNavigation } from '@react-navigation/native';
import {Spinner} from 'native-base';

function GoToHome() {
    const navigation = useNavigation();
  
    return (
        <View style={{
        justifyContent:"center", 
        alignItems:"center",
        flex:1}}
        >
            <TouchableHighlight 
            onPress={() => {navigation.navigate('Home');}} 
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
    );
}


const Screen = styled.View
`
	flex: 1;
  background-color: #f2f2f2;
`

class Graph extends Component{
	constructor(props) 
	{
		super(props);
		this.state = {drawerVisible:false, direction:"TB", key:0, displayCriticalPath:false};
        this.setDrawerVisible = this.setDrawerVisible.bind(this);
        this.toggleDirection = this.toggleDirection.bind(this);
        this.reload = this.reload.bind(this);
        this.toggleCriticalPath = this.toggleCriticalPath.bind(this);
    }
    
    reload(){
        this.setState({key: this.state.key+1, drawerVisible:false})
    }
  
	setDrawerVisible(mode){
		this.setState({drawerVisible:mode});
    }
    
    toggleDirection(){
        if(this.state.direction=="TB"){
            this.setState({direction:"LR"})
        }
        else{
            this.setState({direction:"TB"})
        }

        this.setState({key: this.state.key+1})
    }

    toggleCriticalPath(){
        this.setState({displayCriticalPath:!this.state.displayCriticalPath})
        this.reload();
    }
  
	render(){
		if(this.props.project === null){
			return(
				<GoToHome />
			)
		}

		return(
			<Screen>
				<Drawer
				type="overlay"
				open={this.state.drawerVisible}
                content={<GraphDrawer 
                    setDrawerVisible={this.setDrawerVisible} 
                    project={this.props.project} 
                    navigation={this.props.navigation}
                    direction={this.state.direction}
                    toggleDirection={this.toggleDirection}
                    displayCriticalPath={this.state.displayCriticalPath}
                    toggleCriticalPath={this.toggleCriticalPath}
                    />}
				tapToClose={true}
				openDrawerOffset={0.2} 
				panCloseMask={0.2}
				closedDrawerOffset={-3}
				tweenHandler={(ratio) => ({
					main: { opacity:(2-ratio)/2 }
				})}
				>
					<React.Fragment>
						<GraphScreen 
						project={this.props.project}
						navigation={this.props.navigation}
                        setDrawerVisible={this.setDrawerVisible}
                        direction={this.state.direction}
                        reloadKey = {this.state.key}
                        reload = {this.reload}
                        displayCriticalPath = {this.state.displayCriticalPath}
						/>
					</React.Fragment>
				</Drawer>
			</Screen>
		)
	}
}

class GraphScreen extends Component{
    _isMounted = false;

    constructor(props) {
		super(props);
        this.state = {nodes: null, links:null, selectedTask:null, selectedDependency:null, key:0, sourceCreateDependency: null, targetCreateDependency: null}
        this.getProjectInfo = this.getProjectInfo.bind(this);
        this.displayTaskDependency = this.displayTaskDependency.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
        this.getName = this.getName.bind(this);
        this.setCreateDependency = this.setCreateDependency.bind(this);
    }
    
    

    async componentDidMount(){
        this._isMounted = true;

        if(this.props.project === null){
            return;
        }

        const response = await fetch('http://projecttree.herokuapp.com/getProject',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ id:this.props.project.id })
        });

		const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        if(this._isMounted === true) this.setState({nodes:body.tasks, links:body.rels});
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    getProjectInfo(){
        return {nodes:this.state.nodes, rels:this.state.links}
    }

    getName(id){
        for(var x=0; x<this.state.nodes.length; x++)
        {
            if(id === this.state.nodes[x].id)
            {
                return this.state.nodes[x].name
            }
        }

        return null;
    }

    setProjectInfo(nodes, rels){
        this.setState({nodes:nodes, links:rels});
        this.props.reload();
    }
    
    setCreateDependency(id){
        if(id === null){
            this.setState({sourceCreateDependency: null, targetCreateDependency:null})
        }

        else if(this.state.sourceCreateDependency === null){
            this.setState({sourceCreateDependency : id});
        }

        else{
            if(id === this.state.sourceCreateDependency) return null;
            this.setState({targetCreateDependency : id});
        }
    }

    displayTaskDependency(taskID, dependencyID){
        let task = null;
        let dependency = null;

        if(taskID != null){
            for(var x=0; x<this.state.nodes.length; x++)
            {
                if(taskID === this.state.nodes[x].id)
                {
                    task = this.state.nodes[x]
                }
            }
        }

        else if(dependencyID != null)
        {
            for(var x=0; x<this.state.links.length; x++)
            {
                if(dependencyID === this.state.links[x].id)
                {
                    dependency = this.state.links[x];
                }
            }
        }


        this.setState({selectedTask:task, selectedDependency:dependency});
    }

    render(){
        if(this.props.project === null){
            return null;
        }

        return this.state.nodes ? (
            <View style={styles.container}>
                <View style={{flex:8}}>
                    <WebViewWrapper 
                        nodes={this.state.nodes} 
                        links={this.state.links} 
                        direction={this.props.direction}
                        webKey={this.props.reloadKey} 
                        projID={this.props.project.id}
                        displayTaskDependency={this.displayTaskDependency} 
                        setCreateDependency={this.setCreateDependency}
                        displayCriticalPath={this.props.displayCriticalPath}
                    />
                </View>
                
                <TaskModal project={this.props.project} selectedTask={this.state.selectedTask} displayTaskDependency={this.displayTaskDependency} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />
                <DependencyModal project={this.props.project} selectedDependency={this.state.selectedDependency} displayTaskDependency={this.displayTaskDependency} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} getName={this.getName}/>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <TouchableOpacity style={styles.floatinBtn} onPress={()=>{this.props.setDrawerVisible(true)}}>
                        <IconEntypo name="menu-fold" size={25}/>
                    </TouchableOpacity>
                    <CreateDependency 
                        sourceCreateDependency={this.state.sourceCreateDependency} 
                        targetCreateDependency={this.state.targetCreateDependency} 
                        setCreateDependency={this.setCreateDependency} 
                        getName={this.getName} 
                        projID={this.props.project.id}
                        setProjectInfo={this.setProjectInfo}
                        getProjectInfo={this.getProjectInfo}
                    />
                    <CreateTask projectID={this.props.project.id} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />
                </View>
            </View>
        ) : <Spinner />;
    }
}

class WebViewWrapper extends Component{
    constructor(props){
        super(props);
        this.handleOnMessage = this.handleOnMessage.bind(this);
    }

    handleOnMessage(event){
        let message = event.nativeEvent.data;
        
        if(message[0] === 'n'){
            this.props.displayTaskDependency(parseInt(message.substr(1)), null)
        }
        
        else if(message[0] === 'l'){
            this.props.displayTaskDependency(null, parseInt(message.substr(1)))
        }

        else{
            this.props.setCreateDependency(parseInt(message.substr(1)))
        }
    }

    render(){
        return(
            <WebView
                key={this.props.webKey}
                ref={(ref) => this.myWebView = ref}
                renderLoading={this.ActivityIndicatorLoadingView}
                startInLoadingState={true}
                source={{uri:'http://projecttree.herokuapp.com/mobile',
                        method: 'POST',
                        body:`nodes=${JSON.stringify(this.props.nodes)}&links=${JSON.stringify(this.props.links)}&graphDir=${JSON.stringify(this.props.direction)}&criticalPath=${this.props.displayCriticalPath}&projId=${this.props.projID}`}}
                onMessage={event => this.handleOnMessage(event)}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        marginBottom: 60,
    },
    floatinBtn:{
        height: 50,
        width: 50,
        borderRadius: 200,
        position: 'absolute',
        bottom: 72,
        left: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#EEBB4D'
    }
});

export default Graph;