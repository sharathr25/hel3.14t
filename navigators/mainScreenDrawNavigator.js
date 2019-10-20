import { createDrawerNavigator } from 'react-navigation';

// screens
import PreferencesScreen from '../screens/preferencesScreen';
import MyAccountScreen from '../screens/myAccountScreen';
import HelpsScreen from './helpsScreenBottomTabNavigator';

import BottomTabNavigator from './mainScreenBottomTabNavigator';
import NotificationsScreen from '../screens/notificationsScreen';
import { FLAG_COLOR_ORANGE } from '../constants/styleConstants';

const DrawerNavigator = createDrawerNavigator({
    Main: {screen:BottomTabNavigator},
    'My Account':{screen:MyAccountScreen},
    Preferences:{screen:PreferencesScreen},
    'Your Helps': {screen:HelpsScreen},
  },{
    initialRouteName:'Main',
    navigationOptions:({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return { headerTitle : routeName}
    },
    contentOptions:{
      activeTintColor:FLAG_COLOR_ORANGE
    }
  });

  export default DrawerNavigator;