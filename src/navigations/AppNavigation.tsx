import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksScreen from '../screens/appScreens/TasksScreen';
import ProfileScreen from '../screens/appScreens/ProfileScreen';
import { taskInterface } from '../jotaiStores/userTasksStore';
import CreateTaskScreen from '../screens/appScreens/CreateTaskScreen';
import { Text } from 'react-native-gesture-handler';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import { textColors } from '../constants/colors';

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
            <AppBoottomTabNavigator.Screen
                name="Tasks-Screen"
                component={TasksScreen}
                options={{
                    tabBarLabel: ({ focused }) => {
                        return <Text style={{
                            color: textColors?.secondaryColor,
                            marginTop: -5,
                            fontSize: 12
                        }}>
                            Tasks
                        </Text>
                    },
                    tabBarIcon: ({ focused }) => {
                        console.log("focused", focused)
                        return <FontAwesome5
                            name="tasks"
                            size={20}
                            color={focused ? textColors?.primaryColor : textColors?.teriaryColor}
                        />
                    },
                }}
            />
            <AppBoottomTabNavigator.Screen
                name="Create-Task-Screen"
                component={CreateTaskScreen}
                options={{
                    tabBarLabel: ({ focused }) => {
                        return <Text style={{
                            color: textColors?.secondaryColor,
                            marginTop: -5,
                            fontSize: 12
                        }}>
                            New Task
                        </Text>
                    },
                    tabBarIcon: ({ focused }) => {
                        console.log("focused", focused)
                        return <MaterialIcons
                            name="create"
                            size={24}
                            color={focused ? textColors?.primaryColor : textColors?.teriaryColor}
                        />
                    },
                }}
            />
            <AppBoottomTabNavigator.Screen
                name="Profile-Screen"
                component={ProfileScreen}
                options={{
                    tabBarLabel: ({ focused }) => {
                        return <Text style={{
                            color: textColors?.secondaryColor,
                            marginTop: -5,
                            fontSize: 12
                        }}>
                            Profile
                        </Text>
                    },
                    tabBarIcon: ({ focused }) => {
                        console.log("focused", focused)
                        return <FontAwesome5
                            name="user-circle"
                            size={22}
                            color={focused ? textColors?.primaryColor : textColors?.teriaryColor}
                        />
                    },
                }}
            />
        </AppBoottomTabNavigator.Navigator>
    )
}

export default AppNavigation;