import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from '../screens/appScreens/TasksScreen';
import ProfileScreen from '../screens/appScreens/ProfileScreen';
import { taskInterface } from '../jotaiStores/userTasksStore';
import CreateTaskScreen from '../screens/appScreens/CreateTaskScreen';

export type AppBottomTabNavigatorParamsList = {
    "Tasks-Screen": undefined;
    "Profile-Screen": undefined;
    "Create-Task-Screen": {
        task?: taskInterface,
        isEdit?: boolean
    };
}

const AppBoottomTabNavigator = createBottomTabNavigator<AppBottomTabNavigatorParamsList>();

const AppNavigation = () => {
    return (
        <AppBoottomTabNavigator.Navigator screenOptions={{
            headerShown: false
        }}>
            <AppBoottomTabNavigator.Screen name="Tasks-Screen" component={TasksScreen} />
            <AppBoottomTabNavigator.Screen name="Create-Task-Screen" component={CreateTaskScreen} />
            <AppBoottomTabNavigator.Screen name="Profile-Screen" component={ProfileScreen} />
        </AppBoottomTabNavigator.Navigator>
    )
}

export default AppNavigation;