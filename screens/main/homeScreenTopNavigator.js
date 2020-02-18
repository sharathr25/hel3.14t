import React from './node_modules/react';
import { View, Text } from 'react-native'
import { WHITE, ORANGE } from '../../constants/styleConstants';
import { createMaterialTopTabNavigator } from './node_modules/@react-navigation/material-top-tabs';
import { HelpRequestFeed } from '../../components/oraganisms';

const Tab = createMaterialTopTabNavigator();


const Helps = () => {
  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <HelpRequestFeed />
    </View>
  );
}

const Helpers = () => <View style={{ flex: 1 }} ><Text>Helpers</Text></View>;

function HomeScreenTopNavigator() {
  return (
    <Tab.Navigator tabBarOptions={{indicatorStyle: {backgroundColor: ORANGE}}}>
      <Tab.Screen name="Helps" component={Helps} />
      <Tab.Screen name="Helpers" component={Helpers} />
    </Tab.Navigator>
  );
}

export default HomeScreenTopNavigator;