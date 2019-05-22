/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import SignUpScreen from "./screens/signUpScreen";
import { BG_COLOR } from "./constants/styleConstants";

const MainNavigator = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen }
  },
  {
    initialRouteName: "SignUp",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "black"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const AppContainer = createAppContainer(MainNavigator);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
