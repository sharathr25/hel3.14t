import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from './screens/Notifications';
import { WHITE, ORANGE } from './constants/styleConstants';
import SignUpScreen from './screens/SignUp';
import LoginScreen from './screens/LoginScreen';
import ResetPassowrdScreen from './screens/ResetPassword';
import TermsAndConditionsScreen from './screens/TermsAndConditions';
import LandingScreen from './screens/LandingScreen';
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
        {
          headerStyle: { ...headerStyle },
          headerTitleAlign: "center",
          title: APP_TITLE,
          headerTitleStyle: { fontFamily: 'cursive', color: ORANGE }
        }
      }
    >
      <Stack.Screen name="AppLandingScreen" component={LandingScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="Main" component={BottomNavigator}></Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="ResetPassword" component={ResetPassowrdScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigatorWithUser;