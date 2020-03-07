// @flow
import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native'
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import Context from '../../context';

const Tab = createMaterialTopTabNavigator();

const Helps = ({navigation}) => {
  const { user } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  if(!user) return null;
  const { username, attributes } = user;
  const { email_verified, email } = attributes;
  // TODO : need to popup for user when his email is not verified

  const _onPress = () => {
    setShowModal(!showModal);
    // navigation.navigate('Verification', {username, email, type:"email" });
  }

  if(showModal) {
    return <CustomModal variant="error" desc="email not verified" onClose={_onPress} buttonText="Verify" />
  }

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <HelpRequestFeed />
    </View>
  ); 
}

const Helpers = () => <View style={{ flex: 1 }} ><Text>Helpers</Text></View>;

function HomeScreenTopNavigator() {
  return (
    <Tab.Navigator tabBarOptions={{indicatorStyle: {backgroundColor: ORANGE}}}>
      <Tab.Screen name="Helps" component={Helps} />
      <Tab.Screen name="Helpers" component={Helpers} />
    </Tab.Navigator>
  );
}

export default HomeScreenTopNavigator;