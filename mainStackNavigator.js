import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from './screens/Notifications';
import { WHITE, ORANGE } from './styles/colors';
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
import { CustomModal } from './components//molecules'

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: WHITE,
  shadowOpacity: 0,
  elevation: 0
}

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
      <Stack.Screen name="Main" component={TemporaryMain} options={{ headerLeft: null }}></Stack.Screen>
      {/* <Stack.Screen name="Notifications" component={NotificationsScreen}></Stack.Screen> */}
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: "" }}></Stack.Screen>
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen}></Stack.Screen>
      <Stack.Screen name="Verification" component={Verification}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default MainNavigatorWithUser;