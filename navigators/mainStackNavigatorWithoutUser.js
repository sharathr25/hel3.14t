import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome";

// screens
import SignUpScreen from '../screens/signUpScreen';
import LoginScreen from '../screens/loginScreen';
import TermsAndConditionsScreen from '../screens/termsAndConditions';
import ResetPassword from '../screens/resetPassword';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MainNavigatorWithoutUser = createStackNavigator(
    {
      SignUp: { screen: SignUpScreen },
      Login: { screen: LoginScreen },
      ResetPassword: { screen: ResetPassword },
      TermsAndConditions: { screen: TermsAndConditionsScreen},
    },
    {
      initialRouteName: 'Login',
      defaultNavigationOptions:({navigation}) => {
        return {
            headerLeft: (<HeaderBackButton onPress={() => { navigation.goBack() }} tintColor={FLAG_COLOR_ORANGE} />),
            headerRight: null,
            headerStyle: {
              shadowOpacity: 0,
              elevation: 0,
              backgroundColor: FLAG_COLOR_WHITE
            },
            headerTintColor: FLAG_COLOR_ORANGE,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: FLAG_COLOR_ORANGE
            },
          }
        }
      },
  );

  export default MainNavigatorWithoutUser;
