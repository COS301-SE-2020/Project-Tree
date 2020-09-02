import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {WebView} from 'react-native-webview';
import CreateTask from './TaskComponents/CreateTask';
import TaskModal from './TaskComponents/TaskModal';
import DependencyModal from './DependencyComponents/DependencyModal';
import CreateDependency from './DependencyComponents/CreateDependency';
import IconEntypo from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import Drawer from 'react-native-drawer';
import styled from 'styled-components/native';
import GraphDrawer from './GraphDrawer';
import {useNavigation} from '@react-navigation/native';
import {Spinner} from 'native-base';
import Filter from './FilterComponent'

function GoToHome() {
  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor="#303030" barStyle="light-content" />
      <ImageBackground
        source={require('../Images/graph.png')}
        style={{flex: 1}}
        resizeMode="contain">
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
              marginTop: 50,
            }}>
            <Text style={{color: 'white', padding: 5}}>Select a project</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}

const Screen = styled.View`
  flex: 1;
  background-color: #fff;
`;

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,
      direction: 'TB',
      key: 0,
      displayCriticalPath: false,
    };
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
    this.toggleDirection = this.toggleDirection.bind(this);
    this.reload = this.reload.bind(this);
    this.toggleCriticalPath = this.toggleCriticalPath.bind(this);
  }

  reload() {
    this.setState({key: this.state.key + 1, drawerVisible: false});
  }

  setDrawerVisible(mode) {
    this.setState({drawerVisible: mode});
  }

  toggleDirection() {
    if (this.state.direction == 'TB') {
      this.setState({direction: 'LR'});
    } else {
      this.setState({direction: 'TB'});
    }

    this.setState({key: this.state.key + 1});
  }

  toggleCriticalPath() {
    this.setState({displayCriticalPath: !this.state.displayCriticalPath});
    this.reload();
  }

  render() {
    if (this.props.project === null) {
      return <GoToHome />;
    }

    return (
      <Screen>
        <StatusBar backgroundColor="#303030" barStyle="light-content" />
        <Drawer
          type="overlay"
          open={this.state.drawerVisible}
          content={
            <GraphDrawer
              setDrawerVisible={this.setDrawerVisible}
              project={this.props.project}
              userPermissions={this.props.userPermissions}
              navigation={this.props.navigation}
              direction={this.state.direction}
              toggleDirection={this.toggleDirection}
              displayCriticalPath={this.state.displayCriticalPath}
              toggleCriticalPath={this.toggleCriticalPath}
            />
          }
          tapToClose={true}
          openDrawerOffset={0.2}
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          tweenHandler={(ratio) => ({
            main: {opacity: (2 - ratio) / 2},
          })}>
          <React.Fragment>
            <GraphScreen
              project={this.props.project}
              userPermissions={this.props.userPermissions}
              navigation={this.props.navigation}
              setDrawerVisible={this.setDrawerVisible}
              direction={this.state.direction}
              reloadKey={this.state.key}
              reload={this.reload}
              displayCriticalPath={this.state.displayCriticalPath}
              user={this.props.user}
            />
          </React.Fragment>
        </Drawer>
      </Screen>
    );
  }
}

class GraphScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      nodes: null,
      links: null,
      selectedTask: null,
      selectedDependency: null,
      key: 0,
      sourceCreateDependency: null,
      targetCreateDependency: null,
      allUsers:null, 
      assignedProjUsers:null,
      filterVisibility:false,
      filterOn:false,
    };
    this.getProjectInfo = this.getProjectInfo.bind(this);
    this.displayTaskDependency = this.displayTaskDependency.bind(this);
    this.setProjectInfo = this.setProjectInfo.bind(this);
    this.getName = this.getName.bind(this);
    this.setCreateDependency = this.setCreateDependency.bind(this);
    this.setFilterVisibility = this.setFilterVisibility.bind(this);
    this.setFilterOn = this.setFilterOn.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;

    if (this.props.project === null) {
      return;
    }

    const response = await fetch(
      'http://projecttree.herokuapp.com/getProject',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: this.props.project.id}),
      },
    );

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    if (this._isMounted === true)
      this.setState({nodes: body.tasks, links: body.rels});

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

    this.setState({ allUsers: body2.users });

    const response3 = await fetch(
      'http://projecttree.herokuapp.com/people/assignedProjectUsers',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: this.props.project.id}),
      },
    );

    const body3 = await response3.json();
    if (response3.status !== 200) throw Error(body3.message);

    this.setState({ assignedProjUsers:body3.projectUsers });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProjectInfo() {
    return {nodes: this.state.nodes, rels: this.state.links};
  }

  getName(id) {
    for (var x = 0; x < this.state.nodes.length; x++) {
      if (id === this.state.nodes[x].id) {
        return this.state.nodes[x].name;
      }
    }

    return null;
  }

  setFilterVisibility(value){
    this.setState({filterVisibility:value})
  }

  setFilterOn(value){
    this.setState({filterOn:value})
  }

  async setProjectInfo(nodes, rels, assignedPeople) {
    if(nodes !== undefined && rels !== undefined){
      this.setState({nodes: nodes, links: rels});
      if(assignedPeople !== undefined){
        this.setState({assignedProjUsers: assignedPeople});
      }
    }

    else{
      const response = await fetch(
        'http://projecttree.herokuapp.com/getProject',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id: this.props.project.id}),
        },
      );
  
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      this.setState({nodes: body.tasks, links: body.rels});
    }

    this.props.reload();
  }

  setCreateDependency(id) {
    if ( this.props.userPermissions["create"] === false) {
      alert("You do not have permissions to create any dependencies.");
      return;
    }
    if (id === null) {
      this.setState({
        sourceCreateDependency: null,
        targetCreateDependency: null,
      });
    } else if (this.state.sourceCreateDependency === null) {
      this.setState({sourceCreateDependency: id});
    } else {
      if (id === this.state.sourceCreateDependency) return null;
      this.setState({targetCreateDependency: id});
    }
  }

  displayTaskDependency(taskID, dependencyID) {
    let task = null;
    let dependency = null;

    if (taskID != null) {
      for (var x = 0; x < this.state.nodes.length; x++) {
        if (taskID === this.state.nodes[x].id) {
          task = this.state.nodes[x];
        }
      }
    } else if (dependencyID != null) {
      for (var x = 0; x < this.state.links.length; x++) {
        if (dependencyID === this.state.links[x].id) {
          dependency = this.state.links[x];
        }
      }
    }

    this.setState({selectedTask: task, selectedDependency: dependency});
  }

  render() {
    if (this.props.project === null) {
      return null;
    }

    return this.state.nodes ? (
      <View style={styles.container}>
        <View style={{flex: 8}}>
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

        <TaskModal
          project={this.props.project}
          userPermissions={this.props.userPermissions}
          selectedTask={this.state.selectedTask}
          displayTaskDependency={this.displayTaskDependency}
          getProjectInfo={this.getProjectInfo}
          setProjectInfo={this.setProjectInfo}
          assignedProjUsers={this.state.assignedProjUsers}
          allUsers={this.state.allUsers}
          user={this.props.user}
        />
        <DependencyModal
          project={this.props.project}
          userPermissions={this.props.userPermissions}
          selectedDependency={this.state.selectedDependency}
          displayTaskDependency={this.displayTaskDependency}
          getProjectInfo={this.getProjectInfo}
          setProjectInfo={this.setProjectInfo}
          getName={this.getName}
        />

        {this.state.filterOn === false?
        <Filter 
          filterVisibility={this.state.filterVisibility} 
          setFilterVisibility={this.setFilterVisibility}
          nodes={this.state.nodes} 
          users={this.state.assignedProjUsers} 
          setProjectInfo={this.setProjectInfo} 
          links={this.state.links}
          filterOn={this.state.filterOn}
          setFilterOn={this.setFilterOn}
          user={this.props.user}
        />
        :
        null
        }

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.floatinBtn1}
            onPress={() => {
              this.props.setDrawerVisible(true);
            }}>
            <IconEntypo name="menu-fold" size={25} />
          </TouchableOpacity>
          
          {this.state.filterOn === false?
            <TouchableOpacity
              style={styles.floatinBtn2}
              onPress={() => {
                this.setFilterVisibility(true);
              }}>
              <IconFeather name="search" size={25} />
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={styles.floatinBtn2}
              onPress={() => {
                this.setFilterOn(false);
                this.setProjectInfo();
              }}>
              <IconMaterial name="clear" size={25} />
            </TouchableOpacity>
          }
          

          <CreateDependency
            sourceCreateDependency={this.state.sourceCreateDependency}
            targetCreateDependency={this.state.targetCreateDependency}
            setCreateDependency={this.setCreateDependency}
            getName={this.getName}
            projID={this.props.project.id}
            setProjectInfo={this.setProjectInfo}
            getProjectInfo={this.getProjectInfo}
            links = {this.state.links}
          />
          {this.props.userPermissions["create"] === true?
          <CreateTask
            projectID={this.props.project.id}
            project={this.props.project}
            getProjectInfo={this.getProjectInfo}
            setProjectInfo={this.setProjectInfo}
            assignedProjUsers={this.state.assignedProjUsers}
            allUsers={this.state.allUsers}
          />
          :
            null
          }
        </View>
      </View>
    ) : (
      <Spinner />
    );
  }
}

class WebViewWrapper extends Component {
  constructor(props) {
    super(props);
    this.handleOnMessage = this.handleOnMessage.bind(this);
  }

  handleOnMessage(event) {
    let message = event.nativeEvent.data;

    if (message[0] === 'n') {
      this.props.displayTaskDependency(parseInt(message.substr(1)), null);
    } else if (message[0] === 'l') {
      this.props.displayTaskDependency(null, parseInt(message.substr(1)));
    } else {
      this.props.setCreateDependency(parseInt(message.substr(1)));
    }
  }

  render() {
    return (
      <WebView
        key={this.props.webKey}
        ref={(ref) => (this.myWebView = ref)}
        renderLoading={this.ActivityIndicatorLoadingView}
        startInLoadingState={true}
        source={{
          uri: 'http://10.0.2.2:5000/mobile',
          method: 'POST',
          body: `nodes=${JSON.stringify(
            this.props.nodes,
          )}&links=${JSON.stringify(
            this.props.links,
          )}&graphDir=${JSON.stringify(this.props.direction)}&criticalPath=${
            this.props.displayCriticalPath
          }&projId=${this.props.projID}`,
        }}
        onMessage={(event) => this.handleOnMessage(event)}
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
  floatinBtn1: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    left: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  floatinBtn2: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    left: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
});

export default Graph;
