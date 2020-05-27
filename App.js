// @flow
import React, { memo, useEffect } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import MainStackNavigator from './MainStackNavigator';
import { PermissionsAndroid, Alert } from "react-native";
import { useAuth } from './customHooks';
import { NavigationContainer } from '@react-navigation/native';
import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import { CustomModal } from './components/molecules';
import PushNotification from "react-native-push-notification";

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: (token) => {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: (notification) => {
    console.log("NOTIFICATION:", notification);
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

Amplify.configure({...awsConfig});

whyDidYouRender(React);

const AppContainer = MainStackNavigator;

function App() {
  const { initializing , user, token } = useAuth();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => { })
      .catch((err) => Alert.alert("GPS can't be accessed"));
  }, []);

  if(initializing) return <CustomModal variant="loading" desc="" />
  
  return (
    <ApolloProvider client={ApolloClient(token)}>
      <NavigationContainer>
        <AppContainer isLogedIn={user ? true : false} />
      </NavigationContainer>
    </ApolloProvider>
  );
}

App.whyDidYouRender = true;

export default (memo<Element>(App));
