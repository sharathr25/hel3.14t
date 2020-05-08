// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Header } from '../components/molecules'
import { SCREEN_DETAILS } from "../constants/appConstants";

import { 
  MyAccount,
  ForgotPassword,
  SignUp,
  LandingScreen,
  LoginScreen,
  TermsAndConditions,
  Notifications,
  Verification,
  MainScreen,
  HelpRequestScreen,
  UserHelpRequestScreen,
  UpdateAccount,
  UserContributionScreen,
  MoreScreen,
  ChangePassword
 } from "../screens";
import { AccountButton } from '../components/atoms';

const {
  MAIN,
  APP_LANDING_SCREEN,
  LOGIN,
  SIGNUP,
  VERIFICATION,
  FORGOT_PASSWORD,
  TERMS_AND_CONDITIONS,
  NOTIFICATIONS,
  MY_ACCOUNT,
  HELP_REQUEST,
  USER_HELP_REQUEST,
  UPDATE_ACCOUNT,
  USER_CONTRIBUTION,
  MORE_SCREEN,
  CHANGE_PASSOWRD
} = SCREEN_DETAILS;


const MainNavigator = (props: { isLogedIn: boolean }) => {
  const { isLogedIn } = props;
  const initialScreen = isLogedIn ? MAIN.screenName : APP_LANDING_SCREEN.screenName;

  const Stack = createStackNavigator();

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
        options={{ headerLeft: <AccountButton />}}>
      </Stack.Screen> 
      <Stack.Screen 
        name={NOTIFICATIONS.screenName} 
        component={Notifications} 
        options={{title:NOTIFICATIONS.screenTitle}}>
      </Stack.Screen>
      <Stack.Screen 
        name={SIGNUP.screenName} 
        component={SignUp} 
        options={{ title: SIGNUP.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={LOGIN.screenName} 
        component={LoginScreen} 
        options={{ title: LOGIN.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={FORGOT_PASSWORD.screenName} 
        component={ForgotPassword} 
        options={{ title: FORGOT_PASSWORD.screenTitle }}>
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
      <Stack.Screen 
        name={USER_HELP_REQUEST.screenName} 
        component={UserHelpRequestScreen} 
        options={{ title: USER_HELP_REQUEST.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={USER_CONTRIBUTION.screenName} 
        component={UserContributionScreen} 
        options={{ title: USER_CONTRIBUTION.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={UPDATE_ACCOUNT.screenName} 
        component={UpdateAccount} 
        options={{ title: UPDATE_ACCOUNT.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={MORE_SCREEN.screenName} 
        component={MoreScreen} 
        options={{ title: MORE_SCREEN.screenTitle }}>
      </Stack.Screen>
      <Stack.Screen 
        name={CHANGE_PASSOWRD.screenName} 
        component={ChangePassword} 
        options={{ title: CHANGE_PASSOWRD.screenTitle }}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigator;