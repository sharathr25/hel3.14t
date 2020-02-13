// packages
import React, { memo, useEffect } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import mainStackNavigator from './mainStackNavigator';
import { PermissionsAndroid, Alert } from "react-native";
import { useAuth } from './customHooks';
import Loader from './components/common/Loader';
import { NavigationContainer } from '@react-navigation/native';


whyDidYouRender(React);

const AppContainer = mainStackNavigator;

function App() {
  const { initializing } = useAuth();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => { })
      .catch((err) => Alert.alert("GPS can't be accessed"));
  }, []);

  if (initializing) {
    return <Loader />;
  }

  return (
    <ApolloProvider client={ApolloClient}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </ApolloProvider>
  );
}

App.whyDidYouRender = true;

export default memo(App);
