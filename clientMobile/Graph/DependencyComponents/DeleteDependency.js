import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';

class DeleteDependency extends Component {
  constructor(props) {
    super(props);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  deleteConfirmation() {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete ' + this.props.name + '?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: () => this.handleSubmit()},
      ],
    );
  }

  async handleSubmit() {
    let projectData = await this.props.getProjectInfo();
    projectData.changedInfo = {
      dd_did: this.props.dependency.id,
    };
    projectData = JSON.stringify(projectData);

    const response = await fetch(
      'http://projecttree.herokuapp.com/dependency/delete',
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

export default DeleteDependency;
