import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native'

import AuthStackNavigation from './src/navigations/AuthStackNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigation from './src/navigations/AppNavigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      // setIsLoggedIn(true);
      console.log("userData:", userData);
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