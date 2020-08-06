import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Container, Header, Picker ,Textarea, Tab, Tabs, TabHeading, Label, Form, Item, Input, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, StyleProvider } from 'native-base';
import { WebView } from 'react-native-webview';
import ProjectModal from './GraphProjectModal';
import CreateTask from './CreateTask';
import TaskModal from './TaskModal';

class GraphScreen extends Component{
    constructor(props) {
		super(props);
        this.state = {nodes: null, links:null, selectedTask:null, selectedDependency:null, key:0}
        this.getProjectInfo = this.getProjectInfo.bind(this);
        this.displayTaskDependency = this.displayTaskDependency.bind(this);
        this.setProjectInfo = this.setProjectInfo.bind(this);
    }
    
    reload(){
        this.setState({key : this.state.key+1})
    }

    async componentDidMount(){
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
        if (response.status !== 200) throw Error(body.message)

        this.setState({nodes:body.tasks, links:body.rels})
    }

    getProjectInfo(){
        return {nodes:this.state.nodes, rels:this.state.links}
    }

    setProjectInfo(nodes, rels){
        this.setState({nodes:nodes, rels:rels});
        this.reload();
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

        this.setState({selectedTask:task, selectedDependency:dependency});
    }

    render(){
        if(this.props.project == null){
            return(
                <View>
                    <Text>
                        Please select a project to view
                    </Text>
                </View>
            );
        }

        return this.state.nodes ? (
            <View style={styles.container}>
                <View style={{flex:30}}>
                    <WebViewWrapper nodes={this.state.nodes} links={this.state.links} webKey={this.state.key} displayTaskDependency={this.displayTaskDependency}/>
                </View>
                
                <TaskModal selectedTask={this.state.selectedTask} displayTaskDependency={this.displayTaskDependency} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />

                <View style={{flex:1}}>
                    <CreateTask projectID={this.props.project.id} getProjectInfo={this.getProjectInfo} setProjectInfo={this.setProjectInfo} />
                </View>

                <View style={{flex:1}}>
                    <ProjectModal project={this.props.project}/>
                </View>
            </View>
        ) : null;
    }
}

class WebViewWrapper extends Component{
    render(){
        return(
            <WebView
                key={this.props.webKey}
                ref={(ref) => this.myWebView = ref}
                renderLoading={this.ActivityIndicatorLoadingView}
                startInLoadingState={true}
                source={{uri:'http://10.0.2.2:5000/mobile',
                        method: 'POST',
                        body:'nodes='+JSON.stringify(this.props.nodes)+'&links='+JSON.stringify(this.props.links)+''}}
                onMessage={event => this.props.displayTaskDependency(parseInt(event.nativeEvent.data), null)}
            />
        );
    }
}
      
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default GraphScreen;