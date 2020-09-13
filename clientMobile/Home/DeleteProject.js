import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';

export default class DeleteProject extends Component {
  constructor(props) {
    super(props);
    this.deleteConfirmation = this.deleteConfirmation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  deleteConfirmation() {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete ' + this.props.project.name + '?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: () => this.handleSubmit()},
      ],
    );
  }

  async handleSubmit() {
    let data = {
      data: JSON.stringify({
        token: this.props.token,
        project: this.props.project,
      }),
    };

    const response = await fetch(
      'http://projecttree.herokuapp.com/project/delete',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    const body = await response.json();
    this.props.setProjectInfo(body);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => this.deleteConfirmation()}>
        <Icon type="FontAwesome" name="trash" style={{color: '#FFF'}}></Icon>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});
