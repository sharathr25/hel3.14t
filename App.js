// packages
import React, { useState } from 'react';
import { createAppContainer } from 'react-navigation';
import geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Alert, Text } from "react-native";
import { useScreens } from 'react-native-screens';
import { useAuth } from './auth';
useScreens();

import mainStackNavigatorWithUser from './navigators/mainStackNavigatorWithUser';
import mainStackNavigatorWithoutUser from './navigators/mainStackNavigatorWithoutUser';

import Context from './context';
import { useQueue } from './effects';

const AppContainerWithUser = createAppContainer(mainStackNavigatorWithUser);
const AppContainerWithoutUser = createAppContainer(mainStackNavigatorWithoutUser);

function App(props) {
  const { initializing, user } = useAuth();
  const [latitude, setLattitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationProviderAvailable, setLocationProviderAvailable] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const notifications = useQueue(`users/${user ? user.uid : ''}/notifications`);

  setLocation = (position) => {
    const { coords } = position;
    const { latitude, longitude } = coords;
    setLattitude(latitude);
    setLongitude(longitude);
    setLocationProviderAvailable(true);
    setLocationErrorMessage('');
  }

  setLocationError = (error) => {
    console.log(error.code, error.message);
    let locationErrorMessage;
    switch (error.code) {
      case 1: locationErrorMessage = "Please grant permission to access location"; break;
      case 2: locationErrorMessage = "Please turn on GPS"; break;
      case 3: locationErrorMessage = "Location request timed out"; break;
      case 4: locationErrorMessage = "Google play service is not installed or has an older version"; break;
      case 5: locationErrorMessage = "Location service is not enabled or location mode is not appropriate for the current request"; break;
    }

    setLocationErrorMessage(locationErrorMessage);
    setLocationProviderAvailable(false);
  }

  watchPosition = () => {
    geolocation.watchPosition(
      (position) => setLocation(position),
      (error) => setLocationError(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  getPosition = () => {
    geolocation.getCurrentPosition(
      (position) => setLocation(position),
      (error) => setLocationError(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    .then(() => getPosition())
    .catch((err) => Alert.alert("GPS can't be accessed"));
  watchPosition();

  if (initializing) {
    return <Text>Loading</Text>
  }

  if (user) {
    return (
      <Context.Provider value={{ latitude, longitude, locationErrorMessage, locationProviderAvailable, getPosition: getPosition, navigation: props.navigation, currentUser: user, notifications }}>
        <AppContainerWithUser />
      </Context.Provider>
    );
  }

  return <AppContainerWithoutUser />
}

export default App;
