import React, { useState } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import NotificationsScreen from './screens/Notifications';
import SignUpScreen from './screens/SignUp';
import LoginScreen from './screens/LoginScreen';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import TermsAndConditionsScreen from './screens/TermsAndConditions';
import LandingScreen from './screens/LandingScreen';
import Verification from "./screens/Verification/";
import BottomNavigator from './screens/main/bottomNavigator';
import { APP_TITLE } from './constants/appConstants';
import { View, Text, Animated } from 'react-native';
import { CustomModal, Header } from './components/molecules'


const { multiply } = Animated;

const TITLES = {
  APP_LANDING_SCREEN : "Welcome to haisaa",
  LOGIN : "Log in",
  SIGNUP: "Registrer",
  VERIFICATION: "Verification",
  FORGOT_PASSWORD: "Forgot password",
  RESET_PASSWORD: "Reset password",
  TERMS_AND_CONDITIONS: "Terms & Conditions",
  NOTIFICATIONS: "Notifications"
}

const Stack = createStackNavigator();

const {
  APP_LANDING_SCREEN,
  LOGIN,
  SIGNUP,
  VERIFICATION,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  TERMS_AND_CONDITIONS,
  NOTIFICATIONS
} = TITLES;

const rightToLeft = (screenProps) => {
  const { current , layouts, next, inverted } = screenProps;
  const { screen } = layouts;
  const { width } = screen;

  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * -0.3],
        extrapolate: 'clamp',
      }), inverted)
    : 0;

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
  };
}

const leftToRight = (screenProps) => {
  const { current , layouts, next, inverted, index } = screenProps;
  const { screen } = layouts;
  const { width } = screen;

  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [ index - 1, index ],
      outputRange: [ -width, 0 ],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
        inputRange: [ index, index + 1 ],
        outputRange: [ 0, width ],
        extrapolate: 'clamp',
      }), inverted)
    : 0;

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
  };
}

const MainNavigatorWithUser = (props) => {
  const { isLogedIn } = props;
  const initialScreen = isLogedIn ? "Main" : "LandingScreen";
  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ title: APP_LANDING_SCREEN, headerLeft: null }}></Stack.Screen>
      <Stack.Screen name="Main" component={BottomNavigator} options={{ headerLeft: null }}></Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{title:NOTIFICATIONS}}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} 
        options={{ 
          title: SIGNUP, 
          cardStyleInterpolator: leftToRight
        }}>
       </Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} 
        options={{ 
          title: LOGIN ,
          cardStyleInterpolator: rightToLeft
        }}>
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: FORGOT_PASSWORD }}></Stack.Screen>
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: RESET_PASSWORD }}></Stack.Screen>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{title:TERMS_AND_CONDITIONS}}></Stack.Screen>
      <Stack.Screen name="Verification" component={Verification} options={{title:VERIFICATION}}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigatorWithUser;