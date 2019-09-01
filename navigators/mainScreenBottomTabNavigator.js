// packages
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { View, Text } from 'react-native'

import HelpRequestFeed from "../components/helpRequest/helpRequestFeed";
import HelpRequestForm from "../components/helpRequest/helpRequestForm";

const FirstRoute = () => <View style={{flex:1}}><HelpRequestFeed db="helps" /><HelpRequestForm /></View>;

const SecondRoute = () => <HelpRequestFeed db="helping" />;

const ThirdRoute = () => <View style={{flex:1}} ><Text>route 3</Text></View>


const BottomTabNavigator = createBottomTabNavigator({
    HELP:{screen:FirstRoute},
    HELPED:{screen:SecondRoute},
    HELPERS:{screen:ThirdRoute}
  },{
    initialRouteName:'HELP',
  });

export default BottomTabNavigator;