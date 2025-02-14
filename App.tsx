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
      console.log("userDataAsyncStorage:", userDataAsyncStorage);

      const userDataObject = JSON.parse(userDataAsyncStorage || "");
      console.log("userDataObject:", userDataObject);

      if (!userDataAsyncStorage && Object.keys(userDataObject).length === 0) {
        console.log("No Data in Async Storage");
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