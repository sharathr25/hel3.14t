// packages
import React, { memo } from 'react';
import { createAppContainer } from 'react-navigation';
import { Text } from "react-native";
import { useAuth } from './auth';
import { ApolloProvider } from "react-apollo";
import ApolloClient from './apolloClient';
import whyDidYouRender from "@welldone-software/why-did-you-render";
import mainStackNavigatorWithUser from './navigators/mainStackNavigatorWithUser';
import mainStackNavigatorWithoutUser from './navigators/mainStackNavigatorWithoutUser';

whyDidYouRender(React);

const AppContainerWithUser = createAppContainer(mainStackNavigatorWithUser);
const AppContainerWithoutUser = createAppContainer(mainStackNavigatorWithoutUser);

function App() {
  const { initializing, user } = useAuth();

  if (initializing) {
    return <Text>Loading</Text>
  }

  if (user) {
    return (
      <ApolloProvider client={ApolloClient}>
        <AppContainerWithUser />
      </ApolloProvider>
    );
  }

  return <AppContainerWithoutUser />
}

App.whyDidYouRender = true;

export default memo(App);
