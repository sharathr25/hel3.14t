// @flow
import React from 'react';
import { View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyHelpRequestsScreen from '../MyHelpRequests';
import NotificationsScreen from '../Notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HelpRequestFormScreen from '../HelpRequestForm';
import { ORANGE, WHITE, BLACK, GREEN, RED } from '../../styles/colors';
import { useNotifications } from '../../customHooks';
import Helps from "./Helps";
import Helpers from "./Helpers";
import { ProfileLetter } from '../../components/atoms';

type NotificationIconProps= {
  color: string;
  size: number;
  iconName?: string;
  noOfNotifications: number | boolean
}

const NotificationIcon = (props:NotificationIconProps) => {
  const { color, size = 20, iconName, noOfNotifications } = props;

  return (
    <View>
      <MaterialCommunityIcons name={iconName} color={color} size={size} />
      {
        iconName === "bell-alert" && 
          <View style={{ position: 'absolute' , right: -10, top: -5 }}>
            {noOfNotifications && <ProfileLetter size={20} letter={noOfNotifications} bgColor={RED}/>}
          </View>
      }   
    </View>
  )
}

const Tab = createBottomTabNavigator();

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
      <MaterialCommunityIcons name="plus" color={color === ORANGE ? WHITE : GREEN } size={sizeOfbutton / 2} />
    </View>
  )
}
const BottomTabNavigator = () => {
  const notifications = useNotifications();
  const noOfNotifications = notifications.length > 0 ? notifications.length : false;
  
  return (
    <Tab.Navigator tabBarOptions={{ activeTintColor: ORANGE, inactiveTintColor: BLACK }} initialRouteName="Home">
      <Tab.Screen 
        name="Top Ranks" 
        component={Helpers} 
        options={{ tabBarIcon: (props) => <NotificationIcon iconName="chart-bar" {...props} /> }} 
      />
      <Tab.Screen 
        name="Home" 
        component={Helps} 
        options={{ tabBarIcon:(props) => <NotificationIcon iconName="home-outline" {...props} /> }} 
      />
      <Tab.Screen 
        name="New Help Request" 
        component={HelpRequestFormScreen} 
        options={{ tabBarIcon: RequestButton, tabBarLabel:"", title:"new help" }} 
      />
      <Tab.Screen 
        name="Activity" 
        component={MyHelpRequestsScreen} 
        options={{ tabBarIcon:(props) => <NotificationIcon iconName="clipboard-text-outline" {...props}/> }} 
      />
      <Tab.Screen 
        name="Notification" 
        options={{ tabBarIcon: (props) => <NotificationIcon iconName="bell-alert" {...props} noOfNotifications={noOfNotifications} /> }} 
        children={() => <NotificationsScreen notifications={notifications} />}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;