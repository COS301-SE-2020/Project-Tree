import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

export default function({navigation})
{
    return(
    <NavigationContainer>
        <RootStack.Screen name={'AuthStack'} component={AuthStack}/>
    </NavigationContainer>
    )
};
