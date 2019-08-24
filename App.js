// packages
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Alert } from "react-native";

// screens
import SignUpScreen from './screens/signUpScreen';
import MainScreen from './screens/mainScreen';
import LoginScreen from './screens/loginScreen';
import ResetPassword from './screens/resetPassword';
import TermsAndConditionsScreen from './screens/termsAndConditions';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from './constants/styleConstants';

import Context from './context';

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
  constructor(){
    super();
    this.state = {
      latitude: null,
      longitude: null,
      locationProviderAvailable: false,
      locationErrorMessage:""
    }
  }

  setLocation = (position) => {
    this.setState({
      latitude:position.coords.latitude,
      longitude:position.coords.longitude,
      locationProviderAvailable: true,
      locationErrorMessage:""
    });
  }

  setLocationError = (error) => {
    // See error code charts below.
    console.log(error.code, error.message);
    let locationErrorMessage;
    switch(error.code){
      case 1:locationErrorMessage="Please grant permission to access location";break;
      case 2:locationErrorMessage="Please turn on GPS";break;
      case 3:locationErrorMessage="Location request timed out";break;
      case 4:locationErrorMessage="Google play service is not installed or has an older version";break;
      case 5:locationErrorMessage="Location service is not enabled or location mode is not appropriate for the current request";break;
    }
    this.setState({
      locationErrorMessage,
      locationProviderAvailable: false
    });
  }

  watchPosition = () => {
    geolocation.watchPosition(
      (position) => this.setLocation(position),
      (error) => this.setLocationError(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  getPosition = () => {
    geolocation.getCurrentPosition(
      (position) => this.setLocation(position),
      (error) => {this.setLocationError(error)},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => this.getPosition())
      .catch((err)=>Alert.alert("GPS can't be accessed"));
    this.watchPosition();
  }

  render() {
    const { latitude, longitude, locationErrorMessage, locationProviderAvailable } = this.state;
    return (
      <Context.Provider value={{latitude, longitude, locationErrorMessage, locationProviderAvailable,getPosition:this.getPosition}}>
        <AppContainer />
      </Context.Provider>
    );
  }
}

export default App;
