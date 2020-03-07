// @flow
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MyHelpRequestsScreen from '../MyHelpRequests';
import HomeScreenTopNavigator from './homeScreenTopNavigator';
import NotificationsScreen from '../Notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5'
import HelpRequestFormScreen from '../HelpRequestForm';
import { ORANGE } from '../../styles/colors';
import { useNotifications } from '../../customHooks';
import MyAccountScreen from '../MyAccount';

const Tab = createMaterialBottomTabNavigator();

const ActivityIcon = ({ color, size = 20 }: { color: string, size: number }) => <FontAwesome5Icons name="hands-helping" color={color} size={size} />

const HomeIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="home" color={color} size={size} />

const RequestIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="plus" color={color} size={size} />

const NotificationIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="bell" color={color} size={size} />

const AccountIcon = ({ color, size = 20 }: { color: string, size: number }) => <FontAwesome5Icons name="user" color={color} size={size} />

function BottomTabNavigator(props:any) {
  const notifications = useNotifications();
  const noOfNotifications = notifications.length;

  return (
    <Tab.Navigator screenOptions={{ tabBarColor: ORANGE }}>
      <Tab.Screen name="Home" children={() => <HomeScreenTopNavigator {...props} />} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen name="Activity" component={MyHelpRequestsScreen} options={{ tabBarIcon: ActivityIcon }} />
      <Tab.Screen name="Request" component={HelpRequestFormScreen} options={{ tabBarIcon: RequestIcon }} />
      <Tab.Screen 
        name="Notification" 
        options={{ tabBarIcon: NotificationIcon, tabBarBadge: noOfNotifications }} 
        children={() => <NotificationsScreen notifications={notifications} />}
      />
      <Tab.Screen name="Account" component={MyAccountScreen} options={{ tabBarIcon: AccountIcon }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;