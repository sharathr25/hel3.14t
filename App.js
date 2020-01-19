// packages
import React, { memo, useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import mainStackNavigator from './navigators/mainStackNavigator';
import { PermissionsAndroid, Alert } from "react-native";

whyDidYouRender(React);

const AppContainer = createAppContainer(mainStackNavigator);

function App() {
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => { })
      .catch((err) => Alert.alert("GPS can't be accessed"));
  }, []);

  return (
    <ApolloProvider client={ApolloClient}>
      <AppContainer />
    </ApolloProvider>
  );
}

App.whyDidYouRender = true;

export default memo(App);
