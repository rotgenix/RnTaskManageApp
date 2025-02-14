import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { backgroundColors, textColors } from '../../constants/colors'
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackNavigatorParamsList } from '../../navigations/AuthStackNavigation';

import auth from '@react-native-firebase/auth';

type AuthStackNavigationProp = StackNavigationProp<AuthStackNavigatorParamsList, "Login-Screen">;

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation<AuthStackNavigationProp>();

    const handleLogin = async () => {
        // signInWithEmailAndPassword
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log("login res:", res);
                Alert.alert("Login successs");
                console.log('Logged in!');
            })
            .catch(error => {
                console.log("login error:", error);

                // if (error.code === 'auth/email-already-in-use') {
                //     console.log('That email address is already in use!');
                // }

                // if (error.code === 'auth/invalid-email') {
                //     console.log('That email address is invalid!');
                // }
                // console.error(error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back!</Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup-Screen")}>
                <Text style={styles.footerText}>Dont't have an account? Get Started!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: textColors?.primaryColor
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: '10%',
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 5,
        color: textColors?.teriaryColor
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: backgroundColors?.primaryColor,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    footerText: {
        marginTop: 20,
        color: '#6200ea',
    },
});
