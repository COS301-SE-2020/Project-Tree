import React, { Component } from "react";
import { isEmpty } from "lodash";
import { Row, Col, Container } from "react-bootstrap";
import f1 from "../Images/female1.png";
import f2 from "../Images/female2.png";
import m1 from "../Images/male1.png";
import m2 from "../Images/male2.png";
import $ from "jquery";

let global_pfp = " "

class NoticeBoard extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    if (this.props.messages === null || this.props.messages === undefined) {
      return null;
    }

    return <NotificationList messages={this.props.messages} />;
  }
}

class NotificationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null, pfp: "https://i.ibb.co/MRpbpHN/default.pngusers.profilePicture", imageHash: Date.now()};
    this.returnRandomUser = this.returnRandomUser.bind(this);
  }

  async componentDidMount() 
  {
    $.post("/people/getAllUsers",
      { token: localStorage.getItem("sessionToken") },
      (response) => {
       this.setState({ user: response});
        console.log(this.state.user)
        console.log(response)
      }
    )
    .fail((response) => {
      throw Error(response.message);
    });
  }

  returnRandomUser(profileId) {
    console.log(profileId[0])
    // console.log(this.state.user.profilePicture)
     if(this.state.user != null)
     {
      if(this.state.user.users != undefined ||  this.state.user != null){
      let messageList = this.state.user.users.map(function(users, i) {
        if(users.id == profileId[0] && users.profilePicture != null)
        {
          console.log("PICTURE SUCCESS")
          console.log(users.profilePicture)
          let x = "https://i.ibb.co/MRpbpHN/default.pngusers.profilePicture" 
          let hash = Date.now();
          //this.setState({pfp: users.profilePicture})
          return (
           //<img src={this.state.pfp} alt="user" style={{ height: "70px", width: "70px" }} />
            <img src={users.profilePicture} alt="user" style={{ height: "70px", width: "70px" }} />
           //<img src={'${this.state.pfp}?${hash}'} alt="user" style={{ height: "70px", width: "70px" }} />
            );
        }     
      });
      }
    }
    else
    {
      console.log("picture not loaded")
      //return (<img src={this.state.pfp} alt="user" style={{ height: "70px", width: "70px" }} />)
    }
    // let index = Math.round(Math.random() * (4 - 1) + 1);
    // if (index === 1){
    //   return (
    //     <img src={f1} alt="user" style={{ height: "70px", width: "70px" }} />
    //   );}
    // if (index === 2)
    //   return (
    //     <img src={f2} alt="user" style={{ height: "70px", width: "70px" }} />
    //   );
    // if (index === 3)
    //   return (
    //     <img src={m1} alt="user" style={{ height: "70px", width: "70px" }} />
    //   );
    // if (index === 4)
    //   return (
    //     <img src={m2} alt="user" style={{ height: "70px", width: "70px" }} />
    //   );
    //else
    // return 
    // (
    //   <img src={global_pfp} alt="user" style={{ height: "70px", width: "70px" }} />
    // );  
    // return (
    //       <img src={m2} alt="user" style={{ height: "70px", width: "70px" }} />
    //     );
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
    //console.log(messages)
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
          <Col>{this.returnRandomUser([message.profileId])}</Col>
          <Col xs={8}>
            <em>{message.type === "task" ? message.taskName : null}
            {message.type === "project" ? "Project Wide" : null}
            {message.type === "auto" ? "Auto" : null}{" "} </em>
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
      <React.Fragment>
        <Row>
          <Col className="text-center" style={{ color: "#EEBB4D" }}>
            <h3>
              Notice Board <hr />
            </h3>
          </Col>
        </Row>
        {messageComponents}
      </React.Fragment>
    );
  }
}

export default NoticeBoard;
