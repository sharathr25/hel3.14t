import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome";
import Notification from '../components/helpRequest/common/notification';

// screens
import NotificationsScreen from '../screens/notificationsScreen';

import DrawerNavigator from './mainScreenDrawNavigator';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import CommentsScreen from '../screens/commentsScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MainNavigatorWithUser = createStackNavigator(
    {
      Main: {screen:DrawerNavigator},
      comments: {screen: CommentsScreen},
      Notifications:{screen: NotificationsScreen}
    },
    {
      initialRouteName: 'Main',
      defaultNavigationOptions:({navigation}) => {
        return {
            headerLeft:<TouchableOpacity><Icon name="navicon" size={25} color={FLAG_COLOR_ORANGE} style={{paddingLeft:15}} onPress={navigation.openDrawer}/></TouchableOpacity>,
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
            headerRight:<Notification navigation={navigation}/>
          }
        }
      },
  );

  export default MainNavigatorWithUser;