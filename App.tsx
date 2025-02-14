import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AuthStackNavigation from './src/navigations/AuthStackNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './src/navigations/AppNavigation';
import { useAtom } from 'jotai';
import { userAtom } from './src/jotaiStores/userAtomStore';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useAtom(userAtom);

  useEffect(() => {
    const getData = async () => {
      const userDataAsyncStorage = await AsyncStorage.getItem("userData");
      const userDataObject = JSON.parse(userDataAsyncStorage || "");

      if (!userDataAsyncStorage && Object.keys(userDataObject).length === 0) {
        setIsLoggedIn(false);
      } else {
        setUserData(userDataObject);
        setIsLoggedIn(true);
      }
    }
    getData();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigation /> : <AuthStackNavigation />}
    </NavigationContainer>
  )
}

export default App;