import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text, Dimensions, TouchableHighlight, ScrollView, Image } from 'react-native'
import { isEmpty } from 'lodash';
import {Spinner} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../TopBar'

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

class NoticeBoard extends Component{
	render(){
		if(this.props.project === null){
			return(
                <React.Fragment>
                    <TopBar useMenu={false}/>
				    <GoToHome />
                </React.Fragment>
			)
		}

		return(
            <React.Fragment>
                <TopBar useMenu={false}/>
			    <NoticeBoardScreen project={this.props.project} user={this.props.user}/>
            </React.Fragment>
		)
	}
}

class NoticeBoardScreen extends Component{
    _isMounted = false;

    constructor(props) {
		super(props);
        this.state = {messages:null};
    }

    async componentDidMount(){
        this._isMounted = true;

        data = {
            projID : this.props.project.id,
            userID : this.props.user.id
        }

        data = JSON.stringify(data);

        const response = await fetch('http://projecttree.herokuapp.com/retrieveNotifications',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        });
        const body = await response.json();

        if(this._isMounted === true) this.setState({messages:body.notifications});
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    render(){
        if(this.state.messages === null){
            return(
                <Spinner />
            )
        }

        return(
            <React.Fragment>
                <NotificationList messages={this.state.messages}/>
            </React.Fragment>
        )
    } 
}

class NotificationList extends Component{
    constructor(props){
        super(props);   
    }

    sortMessages(){
        let messages = [];
        let dailyMessages = [];
        let currentMessage = this.props.messages[0];
        for(var count=0; count<this.props.messages.length; count++){
            if(this.props.messages[count].timestamp.day.low == currentMessage.timestamp.day.low && this.props.messages[count].timestamp.month.low == currentMessage.timestamp.month.low){
                dailyMessages.push(this.props.messages[count]);
                currentMessage = this.props.messages[count];
            }

            else{
                messages.push([...dailyMessages]);
                dailyMessages = [];
                dailyMessages.push(this.props.messages[count]);
                currentMessage = this.props.messages[count];
            }
        }

        if(!isEmpty(dailyMessages)){
            messages.push(dailyMessages);
        }

        return messages;
    }

    createMessageList(messages){
        const monthNames = ["January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"];

        let messageList = messages.map((dailyMessages, i) =>
            <View key={i}>
                <View style={{alignItems:"center"}}>
                    <Text style={{paddingTop:30, fontWeight:'bold', fontSize:25, color: '#184D47'}}>
                        {monthNames[dailyMessages[0].timestamp.month.low-1]+" "+dailyMessages[0].timestamp.day.low}
                    </Text>
                    <View style={{backgroundColor: '#EEBB4D', height: 2, width: "70%"}}></View>
                </View>
                {this.createDailyMessageList(dailyMessages)}
            </View>
        );

        return messageList;
    }

    returnRandomUser(){
        let index = Math.round((Math.random() * (4 - 1) + 1));
        if(index===1) return <Image source={require('../Assets/female1.png')} style={{height:70, width:70}} />
        if(index===2) return <Image source={require('../Assets/female2.png')} style={{height:70, width:70}} />
        if(index===3) return <Image source={require('../Assets/male1.png')} style={{height:70, width:70}} />
        if(index===4) return <Image source={require('../Assets/male2.png')} style={{height:70, width:70}} />
    }

    createDailyMessageList(messages){
        let messageList = messages.map((message, i) =>
            <View key={i} style={{paddingTop:10, paddingBottom:10, flexDirection:'row'}}>
                <View>
                    {this.returnRandomUser()}
                </View>
                <View style={{paddingLeft:5, marginRight:50}}>
                    <Text>
                        <Text style={{fontWeight:'bold'}}>
                            {message.fromName}
                            {message.type === "project" ? " - " + "Project Wide" : null}
                            {message.type === "task" ? " - " + message.taskName : null}
                            {" "}
                        </Text>
                        <Text style={{color:'grey'}}>
                            {message.timestamp.hour.low < 10 ? "0"+message.timestamp.hour.low : message.timestamp.hour.low}
                            {":"}
                            {message.timestamp.minute.low < 10 ? "0"+message.timestamp.minute.low : message.timestamp.minute.low}
                        </Text>
                    </Text>
                    <View style={{backgroundColor: '#96BB7C', height: 1, width: "100%"}}></View>
                    <Text style={{paddingTop:15, fontSize:17}}>
                        {message.message}
                    </Text>
                </View>
            </View>
        );

        return messageList;
    }

    render(){
        let messages = this.sortMessages();
        let messageComponents = this.createMessageList(messages);

        return(
            <React.Fragment>
                <View style={{paddingLeft:20, paddingRight:20, flex:1, marginBottom:60}}>
                    <ScrollView>
                        {messageComponents}
                    </ScrollView>
                </View>
            </React.Fragment>            
        )
    }
}

export default NoticeBoard;