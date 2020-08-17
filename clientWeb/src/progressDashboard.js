import React, { Component } from "react";
import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";

export default class progressDashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, margin: 100 }}>
        <Progress.Circle
          progress={0.5}
          size={100}
          showsText={true}
          formatText={(progress) => {
            return `${50}%`;
          }}
          color={"#EEBB4D"}
        />
      </View>
    );
  }
}
