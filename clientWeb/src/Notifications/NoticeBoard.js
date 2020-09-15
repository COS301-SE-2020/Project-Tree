import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Row, Col, Container } from "react-bootstrap";
import $ from "jquery";
import "./style.css";


let global_pfp = " "

class NoticeBoard extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { users:null };
  }

  async componentDidMount() 
  {
    $.post("/people/getAllUsers",
      { token: localStorage.getItem("sessionToken") },
      (response) => {
       this.setState({ users: response});
      }
    )
    .fail((response) => {
      throw Error(response.message);
    });
  }

  render() {
    if (this.props.messages === null || this.props.messages === undefined) {
      return null;
    }

    if(this.state.users === null){
      return null;
    }
    
    return <NotificationList messages={this.props.messages} users={this.state.users}/>;
  }
}

class NotificationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.users, pfp: "https://i.ibb.co/MRpbpHN/default.pngusers.profilePicture", imageHash: Date.now()};
    this.returnRandomUser = this.returnRandomUser.bind(this);
  }

  

  returnRandomUser(profileId, type) {
    let users = this.state.user.users;
    if(type == "auto")
    {
      return <img class="circular" src={this.state.pfp} alt="user" width="70" height="70"/>
    }

    for(var x=0; x<users.length; x++){
      if(parseInt(users[x].id) === parseInt(profileId[0])){
        return <img class="circular" src={users[x].profilePicture} alt="user" width="70" height="70"/>
      }
    }
  }

  sortMessages() {
    let messages = [];
    let dailyMessages = [];
    let currentMessage = this.props.messages[0];
    for (var count = 0; count < this.props.messages.length; count++) {
      if (
        this.props.messages[count].timestamp.day.low ===
          currentMessage.timestamp.day.low &&
        this.props.messages[count].timestamp.month.low ===
          currentMessage.timestamp.month.low
      ) {
        dailyMessages.push(this.props.messages[count]);
        currentMessage = this.props.messages[count];
      } else {
        messages.push([...dailyMessages]);
        dailyMessages = [];
        dailyMessages.push(this.props.messages[count]);
        currentMessage = this.props.messages[count];
      }
    }

    if (!isEmpty(dailyMessages)) {
      messages.push(dailyMessages);
    }
    return messages;
  }

  createMessageList(messages) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let messageList = messages.map((dailyMessages, i) => (
      <Container key={i}>
        <Row>
          <Col
            className="text-center"
            style={{ fontSize: "20px", color: "#184D47" }}
          >
            {dailyMessages[0].timestamp.day.low +
              " " +
              monthNames[dailyMessages[0].timestamp.month.low - 1] +
              " " + dailyMessages[0].timestamp.year.low}
          </Col>
        </Row>
        <hr style={{ backgroundColor: "#EEBB4D" }} />
        <Row>{this.createDailyMessageList(dailyMessages)}</Row>
      </Container>
    ));
    return messageList;
  }

  createDailyMessageList(messages) {
    let messageList = messages.map((message, i) => (
      <Container key={i}>
        <Row>              
          <Col>{this.returnRandomUser([message.profileId], message.type)}</Col>       
          <Col xs={8}>
            <em>{message.type === "task" ? message.taskName : null}
            {message.type === "project" ? "Project Wide" : null}
            {message.type === "auto" ? "Task assigned" : null}{" "} </em>
            <br/>
            {message.message}
          </Col>
          <Col className="text-right">
            {message.timestamp.hour.low < 10
              ? "0" + message.timestamp.hour.low
              : message.timestamp.hour.low}
            {":"}
            {message.timestamp.minute.low < 10
              ? "0" + message.timestamp.minute.low
              : message.timestamp.minute.low}
          </Col>
        </Row>
        <Row>
          <Col>{message.fromName}</Col>
        </Row>
        <hr align="left" style={{ backgroundColor: "#96BB7C", width: "75%" }} />
      </Container>
    ));
    return messageList;
  }
  
  render() {
    let messages = this.sortMessages();
    let messageComponents = this.createMessageList(messages);

    return (
      <Container>
        <Row>
          <Col className="text-center" style={{ color: "#EEBB4D" }}>
            <h3>
              Notice Board <hr />
            </h3>
          </Col>
        </Row>
        <Row>
          <Col
            style={{height: "23em", overflowY: "auto" }}
          >
            {messageComponents}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default NoticeBoard;
