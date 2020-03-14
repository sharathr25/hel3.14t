// @flow
import React, { memo, useEffect } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import MainStackNavigator from './MainStackNavigator';
import { PermissionsAndroid, Alert } from "react-native";
import { useAuth } from './customHooks';
import { NavigationContainer } from '@react-navigation/native';
import { FullScreenLoader } from './components/atoms';
import Amplify,{Auth} from 'aws-amplify';
import awsConfig from './aws-exports';
import Context from './context';
import { CustomModal } from "./components/molecules"

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

  if(initializing) return <CustomModal />
  
  return (
    <ApolloProvider client={ApolloClient(token)}>
      <Context.Provider value={{initializing, user}}>
        <NavigationContainer>
          <AppContainer isLogedIn={user ? true : false} />
        </NavigationContainer>
      </Context.Provider>
    </ApolloProvider>
  );
}

App.whyDidYouRender = true;

export default (memo<Element>(App));
