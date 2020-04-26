// @flow
import React from 'react';
import { View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyHelpRequestsScreen from '../MyHelpRequests';
import NotificationsScreen from '../Notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HelpRequestFormScreen from '../HelpRequestForm';
import { ORANGE, WHITE, BLACK, GREEN } from '../../styles/colors';
import { useNotifications } from '../../customHooks';
import Helps from "./Helps";
import Helpers from "./Helpers";

const Tab = createBottomTabNavigator();

const ActivityIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="clipboard-text-outline" color={color} size={size} />

const HomeIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} />

const RequestIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="plus" color={color} size={size} />

const NotificationIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="bell-alert" color={color} size={size} />

const RankIcon = ({ color, size = 20 }: { color: string, size: number }) => <MaterialCommunityIcons name="chart-bar" color={color} size={size} />

const RequestButton = ({color}) => {
  const sizeOfbutton = 60;
  return (
    <View 
      style={{
        backgroundColor: color === ORANGE ? GREEN : WHITE, 
        width: sizeOfbutton,
        height: sizeOfbutton,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: sizeOfbutton / 2,
        elevation: 10,
        top: 0
      }}
    >
      <RequestIcon color={color === ORANGE ? WHITE : GREEN } size={sizeOfbutton / 2} />
    </View>
  )
}

function BottomTabNavigator(props:any) {
  const notifications = useNotifications();
  const noOfNotifications = notifications.length > 0 ? notifications.length : false;

  return (
    <Tab.Navigator tabBarOptions={{ activeTintColor: ORANGE, inactiveTintColor: BLACK }} initialRouteName="Home" >
        <Tab.Screen name="Top Ranks" component={Helpers} options={{ tabBarIcon: RankIcon }} />
        <Tab.Screen name="Home" children={() => <Helps {...props} />} options={{ tabBarIcon: HomeIcon }} />
        <Tab.Screen name="New Help Request" component={HelpRequestFormScreen} 
          options={{ tabBarIcon: RequestButton, tabBarLabel:"", title:"new help" }} />
        <Tab.Screen name="Activity" component={MyHelpRequestsScreen} options={{ tabBarIcon: ActivityIcon }} />
        <Tab.Screen 
          name="Notification" 
          options={{ tabBarIcon: NotificationIcon, tabBarBadge: noOfNotifications }} 
          children={() => <NotificationsScreen notifications={notifications} />}
        />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;