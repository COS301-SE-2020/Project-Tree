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
import Filter from './FilterComponent';

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
      key: 0,
      displayCriticalPath: false,
    };
    this.setDrawerVisible = this.setDrawerVisible.bind(this);
    this.reload = this.reload.bind(this);
    this.toggleCriticalPath = this.toggleCriticalPath.bind(this);
  }

  reload() {
    this.setState({key: this.state.key + 1, drawerVisible: false});
  }

  setDrawerVisible(mode) {
    this.setState({drawerVisible: mode});
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
      allUsers: null,
      assignedProjUsers: null,
      filterVisibility: false,
      filterOn: false,
      views: null,
      clonedNode: null,
      source_viewId: null,
      target_viewId: null,
      delDep_sourceViewId: null,
      delDep_targetViewId: null,
      positionTasksMode: false,
      savePosition: false,
      autoPos: false,
    };
    this.getProjectInfo = this.getProjectInfo.bind(this);
    this.displayTaskDependency = this.displayTaskDependency.bind(this);
    this.setProjectInfo = this.setProjectInfo.bind(this);
    this.getName = this.getName.bind(this);
    this.setCreateDependency = this.setCreateDependency.bind(this);
    this.setFilterVisibility = this.setFilterVisibility.bind(this);
    this.setFilterOn = this.setFilterOn.bind(this);
    this.moveNode = this.moveNode.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;

    if (this.props.project === null) {
      return;
    }

    const response = await fetch(
      'https://projecttree.herokuapp.com/getProject',
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
      'https://projecttree.herokuapp.com/people/getAllProjectMembers',
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

    this.setState({allUsers: body2.users});

    const response3 = await fetch(
      'https://projecttree.herokuapp.com/people/assignedProjectUsers',
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

    this.setState({assignedProjUsers: body3.projectUsers});

    const response4 = await fetch(
      'https://projecttree.herokuapp.com/getProjectViews',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: this.props.project.id}),
      },
    );

    const body4 = await response4.json();
    if (response4.status !== 200) throw Error(body4.message);

    this.setState({views: body4.views});
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

  setFilterVisibility(value) {
    this.setState({filterVisibility: value});
  }

  setFilterOn(value) {
    this.setState({filterOn: value});
  }

  async setProjectInfo(nodes, rels, assignedPeople) {
    if (nodes !== undefined && rels !== undefined) {
      this.setState({nodes: nodes, links: rels});
      if (assignedPeople !== undefined) {
        this.setState({assignedProjUsers: assignedPeople});
      }
    } else {
      const response = await fetch(
        'https://projecttree.herokuapp.com/getProject',
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

    const response2 = await fetch(
      'https://projecttree.herokuapp.com/getProjectViews',
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

    this.setState({views: body2.views});

    this.props.reload();
  }

  setCreateDependency(id, cloned) {
    let clonedNode = null;
    let isNumber = false;

    isNumber = !Number.isNaN(cloned);
    if (isNumber) {
      clonedNode = cloned;
    }

    if (this.props.userPermissions['create'] === false) {
      alert('You do not have permissions to create any dependencies.');
      return;
    }
    if (id === null) {
      this.setState({
        sourceCreateDependency: null,
        targetCreateDependency: null,
      });
    } else if (this.state.sourceCreateDependency === null) {
      for (var x = 0; x < this.state.nodes.length; x++) {
        if (id === this.state.nodes[x].id) {
          this.setState({
            sourceCreateDependency: this.state.nodes[x],
            source_viewId: clonedNode,
          });
        }
      }
    } else {
      if (id === this.state.sourceCreateDependency.id) return null;
      for (var x = 0; x < this.state.nodes.length; x++) {
        if (id === this.state.nodes[x].id) {
          this.setState({
            targetCreateDependency: this.state.nodes[x],
            target_viewId: clonedNode,
          });
        }
      }
    }
  }

  async saveChanges(){
    let changedNodes = [];
    let nodes = [...this.state.nodes]
    let views = [...this.state.views]

    for(let x=0; x<nodes.length; x++){
      if(nodes[x].changedX !== undefined){
        changedNodes.push(nodes[x]);
      }
    }

    for(let y=0; y<views.length; y++){
      if(views[y].changedX !== undefined){
        changedNodes.push(views[y]);
      }
    }

    let data = {
      changedNodes: changedNodes
    };

    this.setState({savePosition:false, positionTasksMode:false, autoPos:false})
    this.props.reload();

    const response2 = await fetch(
      'https://projecttree.herokuapp.com/task/savePositions',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  }

  clearChanges(val){
    if(val){
      this.setState({positionTasksMode:!this.state.positionTasksMode, savePosition:false, autoPos:false});
      this.props.reload();
    }
    else{
      this.setState({savePosition:false, positionTasksMode:false, autoPos:false});
      this.setProjectInfo();
    }
  }

  moveNode(message){
    message = message.split(" ");
    let id = message[1];
    let xVal = message[2];
    let yVal = message[3];

    for(let x = 0; x < this.state.nodes.length; x++){
      if(this.state.nodes[x].id === parseInt(id)){
        this.state.nodes[x].changedX=parseInt(xVal)
        this.state.nodes[x].changedY=parseInt(yVal)
      }
    }

    for(let y = 0; y < this.state.views.length; y++){
      if(this.state.views[y].id === parseInt(id)){
        this.state.views[y].changedX=parseInt(xVal)
        this.state.views[y].changedY=parseInt(yVal)
      }
    }

    if(this.state.savePosition !== true){
			this.setState({savePosition:true});
		}
  }

  displayTaskDependency(
    taskID,
    dependencyID,
    clonedID,
    sourceView,
    targetView,
  ) {
    let task = null;
    let dependency = null;
    let clonedNode = null;
    let sourceViewId = null;
    let targetViewId = null;
    let isNumber = false;

    isNumber = !Number.isNaN(clonedID);
    if (isNumber) {
      clonedNode = clonedID;
      isNumber = false;
    }

    isNumber = !Number.isNaN(sourceView);
    if (isNumber) {
      sourceViewId = sourceView;
      isNumber = false;
    }

    isNumber = !Number.isNaN(targetView);
    if (isNumber) {
      targetViewId = targetView;
      isNumber = false;
    }

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

    this.setState({
      selectedTask: task,
      selectedDependency: dependency,
      clonedNode: clonedNode,
      delDep_sourceViewId: sourceViewId,
      delDep_targetViewId: targetViewId,
    });
  }

  filterButtonToggle(){
    if(this.state.positionTasksMode){
      return null;
    }

    else if(this.state.filterOn === false){
      return(
        <TouchableOpacity
          style={styles.floatinBtn2}
          onPress={() => {
            this.setFilterVisibility(true);
          }}>
          <IconFeather name="search" size={25} />
        </TouchableOpacity>
      )
    }

    else{
      return(
        <TouchableOpacity
          style={styles.floatinBtn2}
          onPress={() => {
            this.setFilterOn(false);
            this.setProjectInfo();
          }}>
          <IconMaterial name="clear" size={25} />
        </TouchableOpacity>
      )
    }
  }

  render() {
    if (this.props.project === null) {
      return null;
    }

    let leftPos = 145
    let color = '#EEBB4D'
    if(this.state.positionTasksMode){
      leftPos = 80;
      color = '#96BB7C'
    }

    return this.state.nodes ? (
      <View style={styles.container}>
        <View style={{flex: 8}}>
          <WebViewWrapper
            nodes={this.state.nodes}
            links={this.state.links}
            views={this.state.views}
            webKey={this.props.reloadKey}
            projID={this.props.project.id}
            displayTaskDependency={this.displayTaskDependency}
            setCreateDependency={this.setCreateDependency}
            displayCriticalPath={this.props.displayCriticalPath}
            positionTasksMode={this.state.positionTasksMode}
            moveNode={this.moveNode}
            autoPos={this.state.autoPos}
          />
        </View>

        <TaskModal
          project={this.props.project}
          userPermissions={this.props.userPermissions}
          selectedTask={this.state.selectedTask}
          clonedNode={this.state.clonedNode}
          displayTaskDependency={this.displayTaskDependency}
          getProjectInfo={this.getProjectInfo}
          setProjectInfo={this.setProjectInfo}
          assignedProjUsers={this.state.assignedProjUsers}
          allUsers={this.state.allUsers}
          user={this.props.user}
          rels={this.state.links}
        />
        <DependencyModal
          project={this.props.project}
          userPermissions={this.props.userPermissions}
          selectedDependency={this.state.selectedDependency}
          sourceViewId={this.state.delDep_sourceViewId}
          targetViewId={this.state.delDep_targetViewId}
          displayTaskDependency={this.displayTaskDependency}
          getProjectInfo={this.getProjectInfo}
          setProjectInfo={this.setProjectInfo}
          getName={this.getName}
        />

        {this.state.filterOn === false ? (
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
        ) : null}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.floatinBtn1}
            onPress={() => {
              this.props.setDrawerVisible(true);
            }}>
            <IconEntypo name="menu-fold" size={25} />
          </TouchableOpacity>

          {this.filterButtonToggle()}
          
          {this.props.userPermissions["update"] || this.props.userPermissions["create"]?
            <TouchableOpacity
              style={[styles.floatinBtn3, {left:leftPos, backgroundColor:color}]}
              onPress={() => { this.clearChanges(!this.state.savePosition); }}>
              <IconFeather name="move" size={25} />
            </TouchableOpacity>
            :
            null
          }
          

          {this.state.savePosition?
            <React.Fragment>
              <TouchableOpacity
                style={styles.floatinBtn4}
                onPress={() => {this.saveChanges()}}>
                <IconFeather name="save" size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatinBtn5}
                onPress={() => { this.clearChanges(false); }}>
                <IconMaterial name="clear" size={25} />
              </TouchableOpacity>
            </React.Fragment>
            :
            null
          }

          {this.state.positionTasksMode?
            <TouchableOpacity
              onPress={()=>{this.setState({autoPos:true}); this.props.reload()}}
              style={styles.autoPositionButton}>
              <Text style={{textAlign:'center'}}>
                Auto Position
              </Text>
            </TouchableOpacity>
            :
            null
          }
          
          {this.state.positionTasksMode === false?
            <CreateDependency
              sourceCreateDependency={this.state.sourceCreateDependency}
              targetCreateDependency={this.state.targetCreateDependency}
              source_viewId={this.state.source_viewId}
              target_viewId={this.state.target_viewId}
              setCreateDependency={this.setCreateDependency}
              getName={this.getName}
              project={this.props.project}
              setProjectInfo={this.setProjectInfo}
              getProjectInfo={this.getProjectInfo}
              links={this.state.links}
            />
            :
            null
          }
          

          {this.props.userPermissions['create'] === true && this.state.positionTasksMode === false? (
            <CreateTask
              projectID={this.props.project.id}
              project={this.props.project}
              getProjectInfo={this.getProjectInfo}
              setProjectInfo={this.setProjectInfo}
              assignedProjUsers={this.state.assignedProjUsers}
              allUsers={this.state.allUsers}
              rels={this.state.links}
            />
          ) : null}
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

    if (message[0] === 'm'){
      this.props.moveNode(message)
    }

    else if (message[0] === 'n') {
      message = message.split(' ');

      let node = parseInt(message[0].substr(1));
      let cloned = parseInt(message[1].substr(6));

      this.props.displayTaskDependency(node, null, cloned, NaN, NaN);
    } else if (message[0] === 'l') {
      message = message.split(' ');

      let node = parseInt(message[0].substr(1));
      let sourceView = parseInt(message[1].substr(10));
      let targetView = parseInt(message[2].substr(10));

      this.props.displayTaskDependency(
        null,
        node,
        null,
        sourceView,
        targetView,
      );
    } else {
      message = message.split(' ');

      let node = parseInt(message[0].substr(1));
      let cloned = parseInt(message[1].substr(6));

      this.props.setCreateDependency(node, cloned);
    }
  }

  render() {
    let s={
      uri: 'https://projecttree.herokuapp.com/mobile',
       method: 'POST',
       body: `nodes=${JSON.stringify(
        this.props.nodes
      )}&links=${JSON.stringify(
        this.props.links
      )}&criticalPath=${this.props.displayCriticalPath
      }&projId=${this.props.projID}&views=${JSON.stringify(
        this.props.views
      )}&positionMode=${this.props.positionTasksMode}&autoPos=${this.props.autoPos}`,
    }
    
    if (Platform.OS === 'ios') { 
      s={
        uri: 'https://projecttree.herokuapp.com/mobile',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
          body: `nodes=${JSON.stringify(
          this.props.nodes
        )}&links=${JSON.stringify(
          this.props.links
        )}&criticalPath=${this.props.displayCriticalPath
        }&projId=${this.props.projID}&views=${JSON.stringify(
          this.props.views
        )}&positionMode=${this.props.positionTasksMode}&autoPos=${this.props.autoPos}`,
      }
    }

    return this.props.views !== null ? (
      <WebView
        useWebKit={true}
        key={this.props.webKey}
        ref={(ref) => (this.myWebView = ref)}
        renderLoading={this.ActivityIndicatorLoadingView}
        startInLoadingState={true}
        source={s}
        onMessage={(event) => this.handleOnMessage(event)}
      />
    ) : (
      <Spinner />
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
  floatinBtn3: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatinBtn4: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    left: 148,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  floatinBtn5: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 72,
    left: 216,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
  autoPositionButton: {
    height: 50,
    borderRadius: 5,
    position: 'absolute',
    bottom: 72,
    right: 12,
    left:278,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEBB4D',
  },
});

export default Graph;
