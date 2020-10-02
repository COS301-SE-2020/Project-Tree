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
      <View style={{width:400, height:200}}>
        <View>
          <Form>
            <Item floatingLabel disabled>
              <Label>Access Code</Label>
              <Input
                value={this.props.project.accessCode}
              />
            </Item>
          </Form>
        </View>

        <View>
          <TouchableOpacity onPress={()=>this.setClipboard()}>
              <Text>
                Copy
              </Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

export default GetAccessCode;