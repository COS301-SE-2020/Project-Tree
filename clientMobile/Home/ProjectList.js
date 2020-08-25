import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CreateProject from './CreateProject';

class ProjectListDrawer extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      projects: null,
      project: null,
      modalVisible: false,
      tableData: null,
      editing: false,
    };
    this.toggleActionSheet = this.toggleActionSheet.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }

  setEditing(val) {
    this.setState({editing: val});
  }

  toggleActionSheet = (selectedProject) => {
    this.setState({project: selectedProject});
    this.setModalVisible(true);
  };

  setModalVisible = (visible, edit) => {
    if (edit !== undefined) {
      this.setState({editing: edit});
    } else {
      this.setState({modalVisible: visible, editing: false});
    }
  };

  render() {
    if (this.props.projects === null) return null;

    return (
      <View style={{flex: 1, backgroundColor: '#303030', paddingBottom: 60}}>
        <View style={{flex: 5}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 25, color: '#FFF'}}>Owned Projects</Text>
            <View
              style={{
                backgroundColor: '#FFF',
                height: 1,
                width: '60%',
                marginBottom: 10,
              }}></View>
          </View>
          <ScrollView>
            <ProjectList
              projects={this.props.projects}
              setCurrentProject={this.props.setCurrentProject}
              setDrawerVisible={this.props.setDrawerVisible}
            />
          </ScrollView>
        </View>
        <View style={{flex: 5, marginTop: 30}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 25, color: '#FFF'}}>Other Projects</Text>
            <View
              style={{
                backgroundColor: '#FFF',
                height: 1,
                width: '60%',
                marginBottom: 10,
              }}></View>
          </View>
          <ScrollView>
            <ProjectList
              projects={this.props.otherProjects}
              setCurrentProject={this.props.setCurrentProject}
              setDrawerVisible={this.props.setDrawerVisible}
            />
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <CreateProject
            token={this.props.token}
            setProjectInfo={this.props.setProjectInfo}
            setDrawerVisible={this.props.setDrawerVisible}
            setCurrentProject={this.props.setCurrentProject}
          />
        </View>
        <View style={{height: 20}}></View>
      </View>
    );
  }
}

class ProjectList extends React.Component {
  render() {
    if (this.props.projects === null) {
      return null;
    }

    const projects = this.props.projects;
    const listItems = projects.map((project, i) => (
      <View key={i} style={{padding: 5}}>
        <TouchableOpacity
          style={i % 2 == 0 ? styles.projectButtons1 : styles.projectButtons2}
          onPress={() => {
            this.props.setCurrentProject(project);
            this.props.setDrawerVisible(false);
          }}>
          <Text style={i % 2 == 0 ? styles.buttonText1 : styles.buttonText2}>
            {project.name}
          </Text>
        </TouchableOpacity>
      </View>
    ));

    return <React.Fragment>{listItems}</React.Fragment>;
  }
}

const styles = StyleSheet.create({
  projectButtons1: {
    backgroundColor: '#EEBB4D',
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
  },
  projectButtons2: {
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
  },
  buttonText1: {
    color: '#000',
  },
  buttonText2: {
    color: '#FFF',
  },
});

export default ProjectListDrawer;
