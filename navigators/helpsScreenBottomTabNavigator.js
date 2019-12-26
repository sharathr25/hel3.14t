// packages
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../constants/styleConstants';
import MyHelpRequestsScreen from '../screens/myHelpRequestsScreen';
import { HELPS_REQUESTED_DB } from '../constants/appConstants';

const MyHelpRequests = () => {
    return <MyHelpRequestsScreen db={HELPS_REQUESTED_DB} />
}

const MyHelpRequestsCompleted = () => {
    return <MyHelpRequestsScreen db="helpRequetsCompleted" />
}

const BottomTabNavigator = createBottomTabNavigator({
    "On going":{screen:MyHelpRequests},
    "Completed":{screen:MyHelpRequestsCompleted},
  },{
    initialRouteName:'On going',
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