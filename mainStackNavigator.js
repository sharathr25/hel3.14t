import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import NotificationsScreen from './screens/notifications';
import { WHITE, ORANGE } from './constants/styleConstants';
import SignUpScreen from './screens/signUp';
import LoginScreen from './screens/login';
import ResetPassowrdScreen from './screens/resetPassword';
import TermsAndConditionsScreen from './screens/termsAndConditions';
import LandingScreen from './screens/landing';
import BottomNavigator from './screens/main/bottomNavigator';
import { APP_TITLE } from './constants/appConstants';

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: WHITE,
  shadowOpacity: 0,
  elevation: 0
}

const MainNavigatorWithUser = () => {
  return (
    <Stack.Navigator initialRouteName="AppLandingScreen" 
      screenOptions={
        { headerStyle: { ...headerStyle }, 
          headerTitleAlign: "center", 
          title: APP_TITLE, 
          headerTitleStyle: { fontFamily: 'cursive', color: ORANGE } 
        }
      }
    >
      <Stack.Screen name="AppLandingScreen" component={LandingScreen}></Stack.Screen>
      <Stack.Screen name="Main" component={BottomNavigator}></Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
      <Stack.Screen name="ResetPassword" component={ResetPassowrdScreen}></Stack.Screen>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigatorWithUser;