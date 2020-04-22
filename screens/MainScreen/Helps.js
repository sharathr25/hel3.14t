// @flow
import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import { WHITE } from '../../styles/colors';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import { useAuth } from "../../customHooks";
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";

const { LOGIN, VERIFICATION } = SCREEN_DETAILS;

const Helps = ({navigation, route}:{navigation: Object, route: Object }) => {

  const { params } = route;
  let { user } = useAuth() || params;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if(user) {
      const { attributes } = user;
      const { email_verified } = attributes;
      setShowModal(!email_verified);
    }
  }, [user])

  if(!user) return <CustomModal variant="loading" />

  const verify = async (otp) => {
    await Auth.verifyCurrentUserAttributeSubmit('email', otp)
  }

  const resend = async () => {
    return await Auth.verifyCurrentUserAttribute('email')
  }

  const redirectTo = async () => {
    await Auth.signOut();
    navigation.navigate(LOGIN.screenName);
  }

  const _onPress = async () => {
    setShowModal(!showModal);
    await Auth.verifyCurrentUserAttribute('email');
    const paramsForVerificationScreen = { verify, redirectTo, resend, message: "Enter OTP sent to registered email" };
    navigation.navigate(VERIFICATION.screenName, paramsForVerificationScreen);
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

export default Helps;
