/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// packages
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Alert } from 'react-native';

// screens
import firebase from 'react-native-firebase';
import SignUpScreen from './screens/signUpScreen';
import OTPVerification from './screens/OTPVerification';
import MainScreen from './screens/mainScreen';
import LoginScreen from './screens/loginScreen';
import ResetPassword from './screens/resetPassword';

// constants
import { THEME_COLOR } from './constants/styleConstants';

const MainNavigator = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen },
    OTP: { screen: OTPVerification },
    Main: { screen: MainScreen },
    Login: { screen: LoginScreen },
    ResetPassword: { screen: ResetPassword }
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: THEME_COLOR,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
    },
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();
    if (currentUser) {
      firebase.auth().signOut();
      Alert.alert('loged out');
    }
  }

  render() {
    return <AppContainer />;
  }
}

export default App;
