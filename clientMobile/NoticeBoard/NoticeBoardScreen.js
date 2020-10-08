import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  TouchableHighlight,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {isEmpty} from 'lodash';
import {Spinner} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import TopBar from '../TopBar';

function GoToHome() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../Images/notice.png')}
      style={{flex: 1}}
      resizeMode="cover">
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={{
            backgroundColor: '#184D47',
            alignItems: 'center',
            justifyContent: 'center',
            height: 45,
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 3,
          }}>
          <Text style={{color: 'white', padding: 5}}>Select a project</Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
  );
}

class NoticeBoard extends Component {
  render() {
    if (this.props.project === null) {
      return (
        <React.Fragment>
          <TopBar useMenu={false} />
          <GoToHome />
        </React.Fragment>
      );
    }

    return (
      <View style={{backgroundColor: "white", flex: 1}}>
        <TopBar useMenu={false} />
        <NoticeBoardScreen
          project={this.props.project}
          user={this.props.user}
        />
      </View>
    );
  }
}

class NoticeBoardScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {messages: null, allUsers: null};
  }

  async componentDidMount() {
    this._isMounted = true;

    data = {
      projID: this.props.project.id,
      userID: this.props.user.id,
    };

    data = JSON.stringify(data);
    const response = await fetch(
      'http://projecttree.herokuapp.com/retrieveNotifications',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      },
    );
    const body = await response.json();

    const response2 = await fetch(
      'http://projecttree.herokuapp.com/people/getAllUsers',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: this.props.project.id}),
      },
    );

    const body2 = await response2.json();
    if (response2.status !== 200) throw Error(body2.message);

    if (this._isMounted === true)
      this.setState({messages: body.notifications, allUsers: body2.users});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.messages === null) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        <NotificationList
          messages={this.state.messages}
          allUsers={this.state.allUsers}
        />
      </React.Fragment>
    );
  }
}

class NotificationList extends Component {
  constructor(props) {
    super(props);
  }

  sortMessages() {
    let messages = [];
    let dailyMessages = [];
    let currentMessage = this.props.messages[0];
    for (var count = 0; count < this.props.messages.length; count++) {
      if (
        this.props.messages[count].timestamp.day.low ==
          currentMessage.timestamp.day.low &&
        this.props.messages[count].timestamp.month.low ==
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
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let messageList = messages.map((dailyMessages, i) => (
      <View key={i}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              paddingTop: 30,
              fontWeight: 'bold',
              fontSize: 25,
              color: '#184D47',
            }}>
            {monthNames[dailyMessages[0].timestamp.month.low - 1] +
              ' ' +
              dailyMessages[0].timestamp.day.low}
          </Text>
          <View
            style={{
              backgroundColor: '#EEBB4D',
              height: 2,
              width: '70%',
            }}></View>
        </View>
        {this.createDailyMessageList(dailyMessages)}
      </View>
    ));

    return messageList;
  }

  returnRandomUser(profileId) {
    if (profileId === 'undefined') {
      return (
        <Image
          source={require('../Assets/projectTree.png')}
          style={styles.profilePicture}
        />
      );
    } else {
      for (let x = 0; x < this.props.allUsers.length; x++) {
        if (this.props.allUsers[x].id === parseInt(profileId)) {
          let Image_Http_URL = {
            uri: `${this.props.allUsers[x].profilePicture}`,
          };
          return (
            <Image source={Image_Http_URL} style={styles.profilePicture} />
          );
        }
      }
    }
  }

  createDailyMessageList(messages) {
    let messageList = messages.map((message, i) => (
      <View
        key={i}
        style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row'}}>
        <View style={{width: '25%', alignItems: 'center'}}>
          {this.returnRandomUser(message.profileId, message.type)}
          <Text style={{textAlign: 'center'}}>{message.fromName}</Text>
        </View>
        <View style={{paddingLeft: 5, marginRight: 10}}>
          <Text>
            <Text style={{fontWeight: 'bold'}}>
              {message.type === 'project' ? 'Project Wide' : null}
              {message.type === 'task' ? message.taskName : null}
              {message.type === 'auto' ? 'Auto' : null}{' '}
            </Text>
            <Text style={{color: 'grey'}}>
              {message.timestamp.hour.low < 10
                ? '0' + message.timestamp.hour.low
                : message.timestamp.hour.low}
              {':'}
              {message.timestamp.minute.low < 10
                ? '0' + message.timestamp.minute.low
                : message.timestamp.minute.low}
            </Text>
          </Text>
          <View
            style={{
              backgroundColor: '#96BB7C',
              height: 1,
              width: 250,
            }}></View>
          <View
            style={{
              width: '85%',
            }}>
            <Text style={{paddingTop: 15, fontSize: 17}}>
              {message.message}
            </Text>
          </View>
        </View>
      </View>
    ));

    return messageList;
  }

  render() {
    let messages = this.sortMessages();
    let messageComponents = this.createMessageList(messages);

    return (
      <React.Fragment>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            flex: 1,
            marginBottom: 60,
            backgroundColor: "white"
          }}>
          <ScrollView>{messageComponents}</ScrollView>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },
});

export default NoticeBoard;
