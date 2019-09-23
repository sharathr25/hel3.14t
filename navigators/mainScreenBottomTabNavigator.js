// packages
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { View, Text } from 'react-native'

import HelpRequestFeed from "../components/helpRequest/feed/helpRequestFeed";
import HelpRequestForm from "../components/helpRequest/common/helpRequestForm";
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../constants/styleConstants';

class FirstRoute extends React.Component{
  render(){
    return <View style={{flex:1}}><HelpRequestFeed db="helps" /><HelpRequestForm /></View>;
  }
}

class SecondRoute extends React.Component{
  render(){
    return <View style={{flex:1}} ><HelpRequestFeed db="helped" /></View>;
  }
}

class ThirdRoute extends React.Component{
  render(){
    return <View style={{flex:1}} ><Text>route 3</Text></View>;
  }
}
const BottomTabNavigator = createBottomTabNavigator({
    Help:{screen:FirstRoute},
    Helped:{screen:SecondRoute},
    Helpers:{screen:ThirdRoute}
  },{
    initialRouteName:'Help',
    tabBarOptions:{
      activeTintColor: FLAG_COLOR_WHITE,
      activeBackgroundColor: FLAG_COLOR_ORANGE,
      inactiveBackgroundColor:FLAG_COLOR_WHITE,
      inactiveTintColor: FLAG_COLOR_ORANGE,
      labelStyle:{
        fontSize: 15,
      },
      style:{
        backgroundColor: FLAG_COLOR_WHITE,
        height: 30
      }
    },
    navigationOptions:({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return { headerTitle : routeName}
    }
  });

export default BottomTabNavigator;