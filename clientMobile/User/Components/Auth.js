import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './../SplashScreen';
import LoginScreen from './../LoginScreen';
import RegisterScreen from './../RegisterScreen';

const AuthStack = createStackNavigator();

export function Auth ()
{
    return(
        <AuthStack.Navigator screenOptions={{
            headerShown: false
          }}>
            <AuthStack.Screen name={'Login'} component={LoginScreen}/>
            <AuthStack.Screen name={'Register'} component={RegisterScreen}/>
        </AuthStack.Navigator>
    )
};
