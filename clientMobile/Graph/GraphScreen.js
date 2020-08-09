import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphProjectModal';
import CreateTask from './TaskComponents/CreateTask';
import TaskModal from './TaskComponents/TaskModal';
import DependencyModal from './DependencyComponents/DependencyModal';
import CreateDependnecy from './DependencyComponents/CreateDependency'

class GraphScreen extends Component{
    _isMounted = false;

    constructor(props) {
		super(props);
        this.state = {nodes: null, links:null, selectedTask:null, selectedDependency:null, key:0, sourceCreateDependency: null, targetCreateDependency: null}
        this.getProjectInfo = this.getProjectInfo.bind(this);
        this.displayTaskDependency = this.displayTaskDependency.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
        this.reload = this.reload.bind(this);
        this.getName = this.getName.bind(this);
        this.setCreateDependency = this.setCreateDependency.bind(this);
    }
    
    reload(){
        this.setState({key: this.state.key+1})
    }

    async componentDidUpdate(){
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
        this.reload();
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
                <CreateDependnecy 
                    sourceCreateDependency={this.state.sourceCreateDependency} 
                    targetCreateDependency={this.state.targetCreateDependency} 
                    setCreateDependency={this.setCreateDependency} 
                    getName={this.getName} 
                    projID={this.props.project.id}
                    setProjectInfo={this.setProjectInfo}
                    getProjectInfo={this.getProjectInfo}
                />

                <View style={{flex:1}}>
                    <WebViewWrapper nodes={this.state.nodes} links={this.state.links} webKey={this.state.key} displayTaskDependency={this.displayTaskDependency} setCreateDependency={this.setCreateDependency}/>
                    {/* <CreateTask projectID={this.props.project.id} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} /> */}                    
                </View>
                
                <TaskModal project={this.props.project} selectedTask={this.state.selectedTask} displayTaskDependency={this.displayTaskDependency} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />
                <DependencyModal project={this.props.project} selectedDependency={this.state.selectedDependency} displayTaskDependency={this.displayTaskDependency} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} getName={this.getName}/>

                <View>
                    <CreateTask projectID={this.props.project.id} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />
                </View>
            </View>
        ) : null;
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
                        body:'nodes='+JSON.stringify(this.props.nodes)+'&links='+JSON.stringify(this.props.links)+''}}
                onMessage={event => this.handleOnMessage(event)}
            />
        );
    }
}
      
let deviceWidth = Math.round(Dimensions.get('window').width);
let deviceHeight = Math.round(Dimensions.get('window').height)-30;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        marginBottom: 60,
    }
});

export default GraphScreen;