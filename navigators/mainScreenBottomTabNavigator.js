// packages
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { View, Text } from 'react-native'

import HelpRequestFeed from "../components/helpRequest/feed/helpRequestFeed";
import HelpRequestForm from "../components/helpRequest/common/helpRequestForm";
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../constants/styleConstants';
import HelpRequest from '../components/helpRequest/feed/helpRequest';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

// const FirstRoute = () => <View style={{flex: 1}}><Feed db={HELPS_REQUESTED_DB} FeedWrapper={HelpRequestFeed} FeedItem={HelpRequest} /><HelpRequestForm /></View>;

const HELPS = gql`
  query {
    helps {
      _id,
      latitude,
      longitude,
      timeStamp,
      description,
      noPeopleRequired,
      noPeopleAccepted,
    }
  }
`;

const FirstRoute = () => {
  const { loading, error, data } = useQuery(HELPS);
  if (loading) return <Text>loading</Text>
  else if (error) return <Text>Error</Text>
  return (
    <View style={{ flex: 1 }}>
      <HelpRequestFeed feedItems={data.helps} isLoading={loading} ChildComponent={HelpRequest} />
      <HelpRequestForm />
    </View>
  );
}


const ThirdRoute = () => <View style={{ flex: 1 }} ><Text>Helpers</Text></View>;

const BottomTabNavigator = createBottomTabNavigator({
  Help: { screen: FirstRoute },
  // Helped:{screen:SecondRoute}, disabling 'Helped' feed for now
  Helpers: { screen: ThirdRoute }
}, {
  initialRouteName: 'Help',
  tabBarOptions: {
    activeTintColor: FLAG_COLOR_WHITE,
    activeBackgroundColor: FLAG_COLOR_ORANGE,
    inactiveBackgroundColor: FLAG_COLOR_WHITE,
    inactiveTintColor: FLAG_COLOR_ORANGE,
    labelStyle: {
      fontSize: 15,
    },
    style: {
      backgroundColor: FLAG_COLOR_WHITE,
      height: 30
    }
  },
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return { headerTitle: routeName }
  }
});

export default BottomTabNavigator;