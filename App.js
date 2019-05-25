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

// screens
import SignUpScreen from './screens/signUpScreen';
import OTPVerification from './screens/OTPVerification';
import MainScreen from './screens/mainScreen';

// constants
import { THEME_COLOR } from './constants/styleConstants';

const MainNavigator = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen },
    OTP: { screen: OTPVerification },
    Main: { screen: MainScreen }
  },
  {
    initialRouteName: 'SignUp',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: THEME_COLOR
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return <AppContainer />;
  }
}

export default App;
