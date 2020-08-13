import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { Row, Col, Container} from 'react-bootstrap';
import f1 from '../Images/female1.png';
import f2 from '../Images/female2.png';
import m1 from '../Images/male1.png';
import m2 from '../Images/male2.png';


class NoticeBoard extends Component{
    _isMounted = false;

    constructor(props) {
		super(props);
        this.state = {messages:null};
        // this.sendNotification = this.sendNotification.bind(this);
    }

    // async sendNotification(){
    //     let data = {
    //         fromName: "D",
    //         recipients: [{email:"u18052071@tuks.co.za", id:211}],
    //         timestamp: new Date("2020-08-13T08:46:17.672000000Z"),
    //         message: "general kenobi",
    //         taskName: "Task A",
    //         projName: "Project 1",
    //         projID: 212,
    //         mode:1
    //     }

    //     data = JSON.stringify(data);

    //     const response = await fetch('/sendNotification',{
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: data
    //     });

    //     console.log("sent")
    // }

    async componentDidMount(){
        this._isMounted = true;

        let data = {
            projID : 212,
            userID : 211
        }

        data = JSON.stringify(data);

        const response = await fetch('/retrieveNotifications',{
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
                null
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

    returnRandomUser(){
        let index = Math.round((Math.random() * (4 - 1) + 1));
        if(index===1) return <img src={f1} alt="user"style={{height:"70px", width:"70px"}} />
        if(index===2) return <img src={f2} alt="user" style={{height:"70px", width:"70px"}} />
        if(index===3) return <img src={m1} alt="user"style={{height:"70px", width:"70px"}} />
        if(index===4) return <img src={m2} alt="user" style={{height:"70px", width:"70px"}} />
    }

    sortMessages(){
        let messages = [];
        let dailyMessages = [];
        let currentMessage = this.props.messages[0];
        for(var count=0; count<this.props.messages.length; count++){
            if(this.props.messages[count].timestamp.day.low === currentMessage.timestamp.day.low && this.props.messages[count].timestamp.month.low === currentMessage.timestamp.month.low){
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
            <Container key={i}>
                <Row>
                    <Col className="text-center" style={{fontSize: "20px", color: "#184D47"}}>
                         {monthNames[dailyMessages[0].timestamp.month.low-1]+" "+dailyMessages[0].timestamp.day.low} 
                    </Col>
                </Row>
                <hr style={{backgroundColor: "#EEBB4D"}}/>
                <Row>{this.createDailyMessageList(dailyMessages)}</Row>
            </Container>
        );

        return messageList;
    }

    createDailyMessageList(messages){
        let messageList = messages.map((message, i) =>
            <Container key={i}>
                <Row>
                    <Col>{this.returnRandomUser()}</Col>
                    <Col xs={8} >
                        {message.fromName}
                        {" - "}
                        {message.taskName !== undefined ? message.taskName : null}
                        {" "}
                    </Col>
                    <Col className="text-right">
                        {message.timestamp.hour.low < 10 ? "0"+message.timestamp.hour.low : message.timestamp.hour.low}
                        {":"}
                        {message.timestamp.minute.low < 10 ? "0"+message.timestamp.minute.low : message.timestamp.minute.low}
                    </Col>
                </Row>
                <Row>
                    <Col>
                    {message.message}
                    </Col>
                </Row>
                <hr  align="left" style={{backgroundColor: "#96BB7C", width: "75%"}}/>
            </Container>
        );

        return messageList;
    }
    render(){
        let messages = this.sortMessages();
        let messageComponents = this.createMessageList(messages);

        return(
            <React.Fragment>
                    {messageComponents}
            </React.Fragment>            
        )
    }
}

export default NoticeBoard;