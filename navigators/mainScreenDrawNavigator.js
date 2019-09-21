import { createDrawerNavigator } from 'react-navigation';

// screens
import PreferencesScreen from '../screens/preferencesScreen';
import MyAccountScreen from '../screens/myAccountScreen';
import MyHelpRequestsScreen from '../screens/myHelpRequestsScreen';
import HelpsScreen from '../screens/myHelps';

import BottomTabNavigator from './mainScreenBottomTabNavigator';
import NotificationsScreen from '../screens/notificationsScreen';

const DrawerNavigator = createDrawerNavigator({
    Main: {screen:BottomTabNavigator},
    'My Account':{screen:MyAccountScreen},
    Preferences:{screen:PreferencesScreen},
    'Your Helps': {screen:HelpsScreen},
    'Notifications':{screen: NotificationsScreen}
  },{
    initialRouteName:'Main',
    navigationOptions:({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return { headerTitle : routeName}
    }
  });

  export default DrawerNavigator;