// @flow
import React, { useState , useContext} from 'react';
import { View, Text } from 'react-native'
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import Context from '../../context';
import { Auth } from "aws-amplify";

const Tab = createMaterialTopTabNavigator();

const Helps = ({navigation, route}) => {

  const { params } = route;
  const user = useContext(Context).user || params.user;

  const { username, attributes } = user;
  const { email_verified, email } = attributes;
  const [showModal, setShowModal] = useState(!email_verified);

  const verify = async (otp) => {
    await Auth.verifyCurrentUserAttributeSubmit('email', otp)
  }

  const resend = async () => {
    return await Auth.verifyCurrentUserAttribute('email')
  }

  const redirectTo = async () => {
    await Auth.signOut();
    navigation.navigate('Login');
  }

  const _onPress = async () => {
    setShowModal(!showModal);
    await Auth.verifyCurrentUserAttribute('email')
    navigation.navigate('Verification', { verify, redirectTo, resend, message: "Enter OTP sent to registered email" });
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