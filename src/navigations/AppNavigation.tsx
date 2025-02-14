import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from '../screens/appScreens/TasksScreen';
import ProfileScreen from '../screens/appScreens/ProfileScreen';

export type AppBottomTabNavigatorParamsList = {
    "Tasks-Screen": undefined;
    "Profile-Screen": undefined;
}

const AppBoottomTabNavigator = createBottomTabNavigator<AppBottomTabNavigatorParamsList>();

const AppNavigation = () => {
    return (
        <AppBoottomTabNavigator.Navigator>
            <AppBoottomTabNavigator.Screen name="Tasks-Screen" component={TasksScreen} />
            <AppBoottomTabNavigator.Screen name="Profile-Screen" component={ProfileScreen} />
        </AppBoottomTabNavigator.Navigator>
    )
}

export default AppNavigation;