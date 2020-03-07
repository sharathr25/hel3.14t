// @flow
import React, { useState , useContext} from 'react';
import { View, Text } from 'react-native'
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import Context from '../../context';

const Tab = createMaterialTopTabNavigator();

const Helps = ({route}) => {
  const [showModal, setShowModal] = useState(false);
  const { params } = route;
  const user = useContext(Context).user || params.user;
  if(!user) return null;

  const { username, attributes } = user;
  const { email_verified, email } = attributes;

  const _onPress = () => {
    setShowModal(!showModal);
    // navigation.navigate('Verification', {username, email, type:"email" });
  }

  if(showModal) {
    return <CustomModal variant="error" desc="email not verified" onClose={_onPress} buttonText="Close" />
  }

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <HelpRequestFeed />
    </View>
  ); 
}

const Helpers = () => <View style={{ flex: 1 }} ><Text>Helpers</Text></View>;

function HomeScreenTopNavigator(props:any) {
  return (
    <Tab.Navigator tabBarOptions={{indicatorStyle: {backgroundColor: ORANGE}}}>
      <Tab.Screen name="Helps" children={() => <Helps {...props} />} {...props}/>
      <Tab.Screen name="Helpers" component={Helpers} />
    </Tab.Navigator>
  );
}

export default HomeScreenTopNavigator;