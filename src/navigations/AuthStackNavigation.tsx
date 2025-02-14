import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SignupScreen from '../screens/authScreens/SignupScreen';

const AuthStackNavigator = createStackNavigator();

export type AuthStackNavigatorParamsList = {
    "Login-Screen": undefined;
    "Signup-Screen": undefined;
}

// AuthStackNavigator
// const AuthStackNavigator = createStackNavigator<AuthStackNavigatorParamsList>();

const AuthStackNavigation = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{
            headerShown: false
        }}>
            <AuthStackNavigator.Screen
                name="Signup-Screen"
                component={SignupScreen}
            />
            <AuthStackNavigator.Screen
                name="Login-Screen"
                component={LoginScreen}
            />
        </AuthStackNavigator.Navigator>
    )
}

export default AuthStackNavigation