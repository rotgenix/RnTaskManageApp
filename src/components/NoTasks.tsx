import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppBottomTabNavigatorParamsList } from '../navigations/AppNavigation';
import { backgroundColors, textColors } from '../constants/colors';

type AppNavigationProp = BottomTabNavigationProp<AppBottomTabNavigatorParamsList, "Tasks-Screen">;

const NoTaskScreen = () => {
    const navigation = useNavigation<AppNavigationProp>();

    return (
        <View style={styles.container}>
            {/* Illustration */}
            {/* <Image
                source={require('../../assets/no-tasks.png')}
                style={styles.image}
                resizeMode="contain"
            /> */}

            <Text style={styles.title}>No Tasks Available</Text>
            <Text style={styles.subtitle}>Please Change Filter or Create a new Task!!!</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Create-Task-Screen", {})}
            >
                <Text style={styles.buttonText}>Create New Task</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColors?.primaryColor || '#F5F5F5',
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#020000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: "#eceaea",
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "#FFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NoTaskScreen;
