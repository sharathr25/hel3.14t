import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
import { View, Text } from 'react-native';
import { CustomModal, Header } from './components//molecules'

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

const TemporaryMain = ({route, navigation}) => {
  const { params } = route;
  const { user } = params;
  const { username, attributes } = user;
  const { email_verified, email } = attributes;
  const [showModal, setShowModal] = useState(!email_verified);

  const _onPress = () => {
    setShowModal(!showModal);
    navigation.navigate('Verification', {username, email, type:"email" });
  }

  if(showModal) {
    return <CustomModal variant="error" desc="email not verified" onClose={_onPress} buttonText="Verify" />
  }

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

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

const MainNavigatorWithUser = () => {
  return (
    <Stack.Navigator initialRouteName="AppLandingScreen" screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="AppLandingScreen" component={LandingScreen} options={{ title: APP_LANDING_SCREEN, headerLeft: null }}></Stack.Screen>
      <Stack.Screen name="Main" component={TemporaryMain} options={{ headerLeft: null }}></Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{title:NOTIFICATIONS}}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: SIGNUP }}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: LOGIN }}></Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: FORGOT_PASSWORD }}></Stack.Screen>
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: RESET_PASSWORD }}></Stack.Screen>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{title:TERMS_AND_CONDITIONS}}></Stack.Screen>
      <Stack.Screen name="Verification" component={Verification} options={{title:VERIFICATION}}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigatorWithUser;