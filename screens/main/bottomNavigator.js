import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MyHelpRequestsScreen from '../myHelpRequests';
import { View, Text } from 'react-native';
import HomeScreenTopNavigator from './homeScreenTopNavigator';
import NotificationsScreen from '../notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5'
import HelpRequestFormScreen from '../helpRequestForm';
import { ORANGE } from '../../constants/styleConstants';
import { useNotifications } from '../../customHooks';
import MyAccountScreen from '../myAccount';

const Tab = createMaterialBottomTabNavigator();

const ActivityIcon = ({ color, size = 20 }) => <FontAwesome5Icons name="hands-helping" color={color} size={size} />

const HomeIcon = ({ color, size = 20 }) => <MaterialCommunityIcons name="home" color={color} size={size} />

const RequestIcon = ({ color, size = 20 }) => <MaterialCommunityIcons name="plus" color={color} size={size} />

const NotificationIcon = ({ color, size = 20 }) => <MaterialCommunityIcons name="bell" color={color} size={size} />

const AccountIcon = ({ color, size = 20 }) => <FontAwesome5Icons name="user" color={color} size={size} />

function BottomTabNavigator() {
  const notifications = useNotifications();

  return (
    <Tab.Navigator screenOptions={{ tabBarColor: ORANGE }}>
      <Tab.Screen name="Home" component={HomeScreenTopNavigator} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen name="Activity" component={MyHelpRequestsScreen} options={{ tabBarIcon: ActivityIcon }} />
      <Tab.Screen name="Request" component={HelpRequestFormScreen} options={{ tabBarIcon: RequestIcon }} />
      <Tab.Screen 
        name="Notification" 
        options={{ tabBarIcon: NotificationIcon, tabBarBadge: (notifications.length) }} 
        children={() => <NotificationsScreen notifications={notifications} />}
      />
      <Tab.Screen name="Account" component={MyAccountScreen} options={{ tabBarIcon: AccountIcon }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;