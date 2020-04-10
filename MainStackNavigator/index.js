// @flow
import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { rightToLeft, leftToRight } from "./cardInterpolators";
import { Header } from '../components/molecules'
import { SCREEN_DETAILS } from "../constants/appConstants";
import { 
  MyAccount,
  ForgotPassword,
  ResetPassword,
  SignUp,
  LandingScreen,
  LoginScreen,
  TermsAndConditions,
  Notifications,
  Verification,
  MainScreen,
  HelpRequestScreen
 } from "../screens";

const Stack = createStackNavigator();

const {
  MAIN,
  APP_LANDING_SCREEN,
  LOGIN,
  SIGNUP,
  VERIFICATION,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  TERMS_AND_CONDITIONS,
  NOTIFICATIONS,
  MY_ACCOUNT,
  HELP_REQUEST
} = SCREEN_DETAILS;

const MainNavigator = (props: { isLogedIn: boolean }) => {
  const { isLogedIn } = props;
  const initialScreen = isLogedIn ? MAIN.screenName : APP_LANDING_SCREEN.screenName;
  return (
    <Stack.Navigator initialRouteName={initialScreen} 
      screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen 
        name={APP_LANDING_SCREEN.screenName} 
        component={LandingScreen} 
        options={{ title: APP_LANDING_SCREEN.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={MAIN.screenName} 
        component={MainScreen} 
        options={{ headerLeft: <Text/> }}>
      </Stack.Screen> 
      <Stack.Screen 
        name={NOTIFICATIONS.screenName} 
        component={Notifications} 
        options={{title:NOTIFICATIONS.screenTitle}}>
      </Stack.Screen>
      <Stack.Screen 
        name={SIGNUP.screenName} 
        component={SignUp} 
        options={{ title: SIGNUP.screenTitle, cardStyleInterpolator: leftToRight }}>
      </Stack.Screen>
      <Stack.Screen 
        name={LOGIN.screenName} 
        component={LoginScreen} 
        options={{ title: LOGIN.screenTitle,cardStyleInterpolator: rightToLeft }}>
      </Stack.Screen>
      <Stack.Screen 
        name={FORGOT_PASSWORD.screenName} 
        component={ForgotPassword} 
        options={{ title: FORGOT_PASSWORD.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={RESET_PASSWORD.screenName} 
        component={ResetPassword} 
        options={{ title: RESET_PASSWORD.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={TERMS_AND_CONDITIONS.screenName} 
        component={TermsAndConditions} 
        options={{title:TERMS_AND_CONDITIONS.screenTitle}}>
      </Stack.Screen>
      <Stack.Screen 
        name={VERIFICATION.screenName} 
        component={Verification} 
        options={{title:VERIFICATION.screenTitle}}>
      </Stack.Screen>
      <Stack.Screen 
        name={MY_ACCOUNT.screenName} 
        component={MyAccount} 
        options={{ title: MY_ACCOUNT.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={HELP_REQUEST.screenName} 
        component={HelpRequestScreen} 
        options={{ title: HELP_REQUEST.screenTitle }}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigator;