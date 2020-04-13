// @flow
import React from 'react';
import { ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Helps from "./Helps";
import Helpers from "./Helpers";

const Tab = createMaterialTopTabNavigator();

function HomeScreenTopNavigator(props:any) {
  return (
    <Tab.Navigator tabBarOptions={{indicatorStyle: {backgroundColor: ORANGE}}}>
      <Tab.Screen name="Helps" children={() => <Helps {...props} />} {...props}/>
      <Tab.Screen name="Helpers" component={Helpers} />
    </Tab.Navigator>
  );
}

export default HomeScreenTopNavigator;