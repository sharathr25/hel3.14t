import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome";
import Notification from '../components/helpRequest/common/notification';

// screens
import SignUpScreen from '../screens/signUpScreen';
import LoginScreen from '../screens/loginScreen';
import TermsAndConditionsScreen from '../screens/termsAndConditions';
import ResetPassword from '../screens/resetPassword';

import DrawerNavigator from './mainScreenDrawNavigator';

// constants
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import CommentsScreen from '../screens/commentsScreen';

const MainNavigator = createStackNavigator(
    {
      SignUp: { screen: SignUpScreen },
      Main: {screen:DrawerNavigator},
      Login: { screen: LoginScreen },
      ResetPassword: { screen: ResetPassword },
      TermsAndConditions: { screen: TermsAndConditionsScreen},
      comments: {screen: CommentsScreen}
    },
    {
      initialRouteName: 'Login',
      defaultNavigationOptions:({navigation}) => {
        return {
            headerLeft:<Icon name="navicon" size={25} color={FLAG_COLOR_WHITE} style={{paddingLeft:10}} onPress={navigation.openDrawer}/>,
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
            headerRight:<Notification navigation={navigation}/>
          }
        }
      },
  );

  export default MainNavigator