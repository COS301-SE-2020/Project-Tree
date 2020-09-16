import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';

class CloneTask extends Component {
  constructor(props) {
    super(props);
    this.cloneConfirmation = this.cloneConfirmation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cloneConfirmation() {
    Alert.alert(
      'Clone ' + this.props.task.name + '?',
      'Are you sure you want to create a view of this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Create', onPress: () => this.handleSubmit()},
      ],
    );
  }

  async handleSubmit() {
    await fetch('http://projecttree.herokuapp.com/task/createClone', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: this.props.task.id}),
    });

    await this.props.setProjectInfo(undefined, undefined, undefined);

    this.props.toggleVisibility(true, false, null);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.cloneButton}
        onPress={() => this.cloneConfirmation()}>
        <Icon type="FontAwesome" name="clone" style={{color: 'white'}}>
          <Text>&nbsp;Clone</Text>
        </Icon>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cloneButton: {
    backgroundColor: '#184D47',
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

export default CloneTask;
