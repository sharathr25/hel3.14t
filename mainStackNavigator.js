import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from './screens/Notifications';
import SignUpScreen from './screens/SignUp';
import LoginScreen from './screens/LoginScreen';
import ResetPassowrdScreen from './screens/ResetPassword';
import TermsAndConditionsScreen from './screens/TermsAndConditions';
import LandingScreen from './screens/LandingScreen';
import BottomNavigator from './screens/main/bottomNavigator';
import { APP_TITLE } from './constants/appConstants';
import {Header} from './components/molecules';

const Stack = createStackNavigator();

const MainNavigatorWithUser = () => {
  return (
    <Stack.Navigator initialRouteName="AppLandingScreen"
      screenOptions={
        {
          header: (props) => <Header {...props} />,
          title: APP_TITLE,
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