import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import {Icon} from 'native-base';

class DeleteTask extends Component {
  constructor(props) {
    super(props);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  deleteConfirmation() {
    if(this.props.clonedNode !== null){
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to delete the view of ' + this.props.task.name + '?',
        [
          {text: 'NO', style: 'cancel'},
          {text: 'YES', onPress: () => this.handleSubmit()},
        ],
      );
    }
    else{
      Alert.alert(
        'Are you sure?',
        'Are you sure you want to delete ' + this.props.task.name + '?',
        [
          {text: 'NO', style: 'cancel'},
          {text: 'YES', onPress: () => this.handleSubmit()},
        ],
      );
    }
  }

  async handleSubmit() {
    if(this.props.clonedNode !== null){
      let changedInfo={
        changedInfo:{viewId: this.props.clonedNode}
      }
      const response = await fetch(
        'http://10.0.2.2:5000/task/deleteClone',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            changedInfo:{
              viewId: this.props.clonedNode
            }
          }),
        },
      );
  
      const body = await response.json();
      this.props.toggleVisibility(true, false, null);
    }
    else{
      let projectData = await this.props.getProjectInfo();
      projectData.changedInfo = {
        id: this.props.task.id,
      };
      projectData = JSON.stringify(projectData);

      const response = await fetch(
        'http://10.0.2.2:5000/task/delete',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: projectData,
        },
      );

      const body = await response.json();
      this.props.toggleVisibility(true, false, null);
      this.props.setProjectInfo(body.nodes, body.rels);
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => this.deleteConfirmation()}>
        <Icon type="FontAwesome" name="trash" style={{color: 'white'}}>
          <Text>&nbsp;Delete</Text>
        </Icon>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 3,
  },
});

export default DeleteTask;
