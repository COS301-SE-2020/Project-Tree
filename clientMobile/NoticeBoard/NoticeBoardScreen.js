import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, StyleSheet, Text, Dimensions, TouchableHighlight, ScrollView } from 'react-native'
import { isEmpty } from 'lodash';

class NoticeBoardScreen extends Component{
    _isMounted = false;

    constructor(props) {
		super(props);
        this.state = {messages:null};
        this.sendNotification = this.sendNotification.bind(this);
    }

    async sendNotification(){
        data = {
            fromName: "D",
            recipients: [{email:"u18052071@tuks.co.za", id:211}],
            timestamp: new Date("2020-08-13T08:46:17.672000000Z"),
            message: "general kenobi",
            taskName: "Task A",
            projName: "Project 1",
            projID: 212,
            mode:1
        }

        data = JSON.stringify(data);

        const response = await fetch('http://10.0.2.2:5000/sendNotification',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        });

        console.log("sent")
    }

    async componentDidMount(){
        this._isMounted = true;

        data = {
            projID : 212,
            userID : 211
        }

        data = JSON.stringify(data);

        const response = await fetch('http://10.0.2.2:5000/retrieveNotifications',{
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
                <View>
                    <Text>
                        Waiting - Spinner
                    </Text>
                </View>
            )
        }

        return(
                // <TouchableHighlight onPress={()=>{this.sendNotification()}}>
                //     <Text>
                //         Send Notification
                //     </Text>
                // </TouchableHighlight>
                <NotificationList messages={this.state.messages}/>
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
                <Text style={{paddingTop:30, fontWeight:'bold', fontSize:25}}>
                    {monthNames[dailyMessages[0].timestamp.month.low-1]+" "+dailyMessages[0].timestamp.day.low}
                </Text>
                {this.createDailyMessageList(dailyMessages)}
            </View>
        );

        return messageList;
    }

    createDailyMessageList(messages){
        let messageList = messages.map((message, i) =>
            <View key={i} style={{paddingTop:10, paddingBottom:10}}>
                <Text>
                    <Text style={{fontWeight:'bold', fontSize:20}}>
                        {message.fromName}
                        {" - "}
                        {message.taskName !== undefined ? message.taskName : null}
                        {" "}
                    </Text>
                    <Text>
                        {message.timestamp.hour.low < 10 ? "0"+message.timestamp.hour.low : message.timestamp.hour.low}
                        {":"}
                        {message.timestamp.minute.low < 10 ? "0"+message.timestamp.minute.low : message.timestamp.minute.low}
                    </Text>
                </Text>
                <Text>
                    {message.message}
                </Text>
            </View>
        );

        return messageList;
    }

    render(){
        let messages = this.sortMessages();
        let messageComponents = this.createMessageList(messages);

        return(
            <React.Fragment>
                <View style={{paddingLeft:20, flex:1, marginBottom:60}}>
                    <ScrollView>
                        {messageComponents}
                    </ScrollView>
                </View>
            </React.Fragment>            
        )
    }
}

export default NoticeBoardScreen;