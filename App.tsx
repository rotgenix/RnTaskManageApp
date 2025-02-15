import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AuthStackNavigation from './src/navigations/AuthStackNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './src/navigations/AppNavigation';
import { useAtom } from 'jotai';
import { isLoggedInAtom, userAtom } from './src/jotaiStores/userAtomStore';
import SplashScreen from 'react-native-splash-screen';

import Toast from 'react-native-toast-message';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom<boolean>(isLoggedInAtom);
  const [userData, setUserData] = useAtom(userAtom);

  useEffect(() => {
    const getData = async () => {
      try {
        const userDataAsyncStorage = await AsyncStorage.getItem("userData");

        if (!userDataAsyncStorage) {
          setIsLoggedIn(false);
        }
        else {
          const userDataObject = JSON.parse(userDataAsyncStorage || "");
          if (Object.keys(userDataObject).length === 0) {
            setIsLoggedIn(false);
          } else {
            setUserData(userDataObject);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.log("error", error)
      }
    }
    getData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  }, []);

  useEffect(() => { }, [userData]);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigation /> : <AuthStackNavigation />}
      <Toast />
    </NavigationContainer>
  )
}

export default App;