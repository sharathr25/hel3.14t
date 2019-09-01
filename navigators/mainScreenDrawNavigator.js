import { createDrawerNavigator } from 'react-navigation';

// screens
import PreferencesScreen from '../screens/preferencesScreen';
import MyAccountScreen from '../screens/myAccountScreen';
import MyHelpRequestsScreen from '../screens/myHelpRequestsScreen';
import HelpedScreen from '../screens/helpedScreen';

import BottomTabNavigator from './mainScreenBottomTabNavigator';

const DrawerNavigator = createDrawerNavigator({
    Main: {screen:BottomTabNavigator},
    'My Account':{screen:MyAccountScreen},
    Preferences:{screen:PreferencesScreen},
    'My Help Requests': {screen:MyHelpRequestsScreen},
    'Helped':{screen:HelpedScreen},
  },{
    initialRouteName:'Main',
    navigationOptions:({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return { headerTitle : routeName}
    }
  });

  export default DrawerNavigator;