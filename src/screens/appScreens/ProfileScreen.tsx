import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { isLoggedInAtom, userAtom } from '../../jotaiStores/userAtomStore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../utils/ToastMessage';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { textColors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const [userData, setUserData] = useAtom(userAtom);
    const navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useAtom<boolean>(isLoggedInAtom);

    const handleLogout = async () => {
        try {
            await auth().signOut();
            setUserData({ email: "", name: "", uid: "" });
            await AsyncStorage.removeItem("userData");
            setIsLoggedIn(false);
            showToast({
                text1: "User Logged out Successfully.",
                type: "success"
            });
        } catch (error) {
            console.error("Logout Error: ", error);
            showToast({
                text1: "Failed to Log out.",
                text2: "Please try again.",
                type: "error"
            })
        }
    };

    return (
        <View style={styles.container}>
            <FontAwesome5 name='user-alt' size={50} color={textColors?.secondaryColor} />

            <Text style={styles.email}>{userData?.email || 'No Email'}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProfileScreen;
