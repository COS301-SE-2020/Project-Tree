import React from 'react';
import AddProjectManager from './AddProjectManager';
import GetAccessCode from './GetAccessCode';
import AuthoriseMembers from './AuthoriseMembers';
import {View} from 'react-native';

class MemberWrapperComponent extends React.Component {
  constructor() {
    super();
    this.state = {users: null};
  }

  render() {
    return (
      <View style={{width: '100%'}}>
        <GetAccessCode project={this.props.project} />
        <AuthoriseMembers project={this.props.project} />
        <AddProjectManager project={this.props.project} />
      </View>
    );
  }
}

export default MemberWrapperComponent;
