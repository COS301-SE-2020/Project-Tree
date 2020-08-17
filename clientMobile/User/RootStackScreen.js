import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

export default function ({navigation}) {
  return (
    <NavigationContainer>
      <RootStack.Screen name={'AuthStack'} component={AuthStack} />
    </NavigationContainer>
  );
}
