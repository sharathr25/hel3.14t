import React from 'react';
import { createStackNavigator } from 'react-navigation';
import NotificationBellIcon from '../components/common/notificationBellIcon';
import MenuIcon from "../components/common/menuIcon";

// screens
import NotificationsScreen from '../screens/notificationsScreen';

import DrawerNavigator from './mainScreenDrawNavigator';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import CommentsScreen from '../screens/commentsScreen';

const MainNavigatorWithUser = createStackNavigator(
  {
    Main: { screen: DrawerNavigator },
    comments: { screen: CommentsScreen },
    Notifications: { screen: NotificationsScreen }
  },
  {
    initialRouteName: 'Main',
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: <MenuIcon navigation={navigation} />,
        headerStyle: {
          shadowOpacity: 0,
          elevation: 0,
          backgroundColor: FLAG_COLOR_WHITE
        },
        headerTintColor: FLAG_COLOR_ORANGE,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: FLAG_COLOR_ORANGE
        },
        headerRight: <NotificationBellIcon navigation={navigation} />
      }
    }
  },
);

export default MainNavigatorWithUser;