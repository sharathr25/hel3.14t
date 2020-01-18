// packages
import React, { useState } from 'react';
import { createAppContainer } from 'react-navigation';
import geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Alert, Text } from "react-native";
import { useScreens } from 'react-native-screens';
import { useAuth } from './auth';
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://192.168.0.106:4000/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://192.168.0.106:4000/graphql`,
  options: {
    reconnect: true
  }
});

const terminationLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const link = ApolloLink.from([terminationLink]);

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
  const client = new ApolloClient({link, cache: new InMemoryCache()})

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
      <ApolloProvider client={client}>
        <Context.Provider value={{ latitude, longitude, locationErrorMessage, locationProviderAvailable, getPosition: getPosition, navigation: props.navigation, currentUser: user, notifications }}>
          <AppContainerWithUser />
        </Context.Provider>
      </ApolloProvider>
    );
  }

  return <AppContainerWithoutUser />
}

export default App;
