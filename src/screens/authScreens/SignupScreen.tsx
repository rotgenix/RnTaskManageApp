import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { backgroundColors, textColors } from '../../constants/colors';
import { AuthStackNavigatorParamsList } from '../../navigations/AuthStackNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import { useAtom } from 'jotai';
import { isLoggedInAtom, userAtom } from '../../jotaiStores/userAtomStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { showToast } from '../../utils/ToastMessage';

type AuthStackNavigationProp = StackNavigationProp<AuthStackNavigatorParamsList, "Signup-Screen">;

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useAtom(userAtom);
    const [isLoggedIn, setIsLoggedIn] = useAtom<boolean>(isLoggedInAtom);

    const navigation = useNavigation<AuthStackNavigationProp>();

    const handleSignup = async () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                showToast({ text1: "Signed up Successfully!!!", type: "success" });
                setUserData({
                    uid: res?.user?.uid,
                    email: res?.user?.email,
                    name: "",
                });

                await AsyncStorage.setItem("userData", JSON.stringify({
                    uid: res?.user?.uid,
                    email: res?.user?.email,
                    name: "",
                }));
                setIsLoggedIn(true);
            })
            .catch(error => {
                console.log("error", error)
                if (error.code === 'auth/email-already-in-use') {
                    showToast({ text1: "Email already registered!", type: "error" });
                }
                else if (error.code === 'auth/invalid-email') {
                    showToast({
                        type: "error",
                        text1: "Invalid Email!",
                        text2: "Please enter valid email!"
                    })
                } else if (error?.code === "auth/weak-password") {
                    showToast({
                        type: "error",
                        text1: "Weak Password!",
                        text2: "Please enter strong password!"
                    })
                }
                else {
                    showToast({ text1: "Sign up error!", text2: "Please try again", type: "error" });
                }
            });
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         SplashScreen.hide();
    //     }, 500);
    // }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's Get Started!</Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={textColors?.teriaryColor}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={textColors?.teriaryColor}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login-Screen")}>
                <Text style={styles.footerText}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        color: "#000"
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

export default SignupScreen;