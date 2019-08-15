// packages
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';


// screens
import SignUpScreen from './screens/signUpScreen';
import MainScreen from './screens/mainScreen';
import LoginScreen from './screens/loginScreen';
import ResetPassword from './screens/resetPassword';
import TermsAndConditionsScreen from './screens/termsAndConditions';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from './constants/styleConstants';

const MainNavigator = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen },
    Main: { screen: MainScreen },
    Login: { screen: LoginScreen },
    ResetPassword: { screen: ResetPassword },
    TermsAndConditions: { screen: TermsAndConditionsScreen}
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: FLAG_COLOR_ORANGE
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: FLAG_COLOR_WHITE
      },
    },
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
