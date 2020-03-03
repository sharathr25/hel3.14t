// @flow
import React, { memo, useEffect } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import mainStackNavigator from './mainStackNavigator';
import { PermissionsAndroid, Alert } from "react-native";
import { useAuth } from './customHooks';
import { NavigationContainer } from '@react-navigation/native';
import { FullScreenLoader } from './components/atoms';
import Amplify,{Auth} from 'aws-amplify';
import awsConfig from './aws-exports';

Amplify.configure({...awsConfig});

whyDidYouRender(React);

const AppContainer = mainStackNavigator;

function App() {
  Auth.signIn({username:'sharathdupati@gmail.com', password:'Sharath@25'})
  // Auth.signUp({username: "sharathdupati@gmail.com", password: "Sharath@25", attributes: { email: "sharathdupati@gmail.com" }})
  .then(data => console.log(data)).catch(err => console.log('error signing up user...', err));
  const { initializing } = useAuth();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => { })
      .catch((err) => Alert.alert("GPS can't be accessed"));
  }, []);

  if (initializing) {
    return <FullScreenLoader />;
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

export default (memo(App));;
