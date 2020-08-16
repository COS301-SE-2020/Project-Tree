import React, { Component } from 'react';
import { Image, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import {Spinner} from 'native-base';

export default class ProgressDashboardWrapper extends Component {
    constructor(props){
        super(props);
        this.state = {tasks:null, criticalPath:null}
    }

    async componentDidMount(){
        var response = await fetch('http://projecttree.herokuapp.com/project/projecttasks',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ projId:this.props.project.id })
        });

		var body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        else{
            this.setState({tasks:body.tasks});
        }

        response = await fetch('http://projecttree.herokuapp.com/project/criticalpath',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ projId:this.props.project.id })
        });

		body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        else{
            this.setState({criticalPath:body});
        }
    }
    

    render(){
        if(this.state.tasks === null || this.state.criticalPath === null){
            return(
                <Spinner />
            )
        }
        return(
            <ProgressDashboard tasks={this.state.tasks} criticalPath={this.state.criticalPath}/>
        )
    }
}

class ProgressDashboard extends Component{
    getProjectProgress(){
        let totalDur = 0, completeDur = 0, percentage = 0, color = "success";
        this.props.tasks.forEach(task => {
          if(task.progress === "Complete") completeDur = completeDur + task.duration;
          totalDur += task.duration;
        });
        if(totalDur !== 0) percentage = completeDur / totalDur * 100;
        else percentage = 0;

        return Math.round(percentage);
    }
    
    getCPProgress(){
        let totalDur = 0, completeDur = 0, percentage = 0, color = "success";
        if (this.props.criticalPath !== null && this.props.criticalPath.path !== null)
          this.props.criticalPath.path.segments.forEach((el, i) => {
            if(i === 0){
              if(el.start.properties.progress === "Complete") completeDur = completeDur + el.start.properties.duration.low;
              totalDur += el.start.properties.duration.low;
            }
            if(el.end.properties.progress === "Complete") completeDur = completeDur + el.end.properties.duration.low;
            totalDur += el.end.properties.duration.low;
          });
        if(totalDur !== 0) percentage = completeDur / totalDur * 100;
        else percentage = 0;

        return Math.round(percentage);
    }

    render(){
        let cp= this.getCPProgress();
        let pp= this.getProjectProgress();

        let cpColor=null;
        let ppColor=null;

        if(cp < 33) cpColor='red';
        else if(cp < 66) cpColor='#EEBB4D'
        else cpColor='green'

        if(pp < 33) ppColor='red';
        else if(pp < 66) ppColor='#EEBB4D'
        else ppColor='green'

        return(
            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-evenly'}}>
                <View style={{alignItems:'center'}}>
                    <Progress.Circle progress={pp/100} size={100} showsText={true} formatText={progress=>{return `${pp}%`}} color={ppColor}/>
                    <Text>Project Progress</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <Progress.Circle progress={cp/100} size={100} showsText={true} formatText={progress=>{return `${cp}%`}} color={cpColor}/>
                    <Text>Critical Path Progress</Text>
                </View>
            </View>
        )
    }
}