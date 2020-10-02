import React from 'react';
import {Label, Form, Item, Input, Icon} from 'native-base';
import {View, TouchableOpacity, Text} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

class GetAccessCode extends React.Component {
  setClipboard(){
    Clipboard.setString(this.props.project.accessCode)
  }

  render() {
    return (
        <View style={{width:'100%'}}>
          <Form>
            <Item floatingLabel disabled>
              <Label>Access Code</Label>
              <Input
                value={this.props.project.accessCode}
              />
              <Icon
                type="Feather"
                name="clipboard"
                onPress={()=>this.setClipboard()}
              />
            </Item>
          </Form>
        </View>
    );
  }
}

export default GetAccessCode;