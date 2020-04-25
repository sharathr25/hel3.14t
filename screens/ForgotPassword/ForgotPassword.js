// @flow
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ORANGE, WHITE, BLACK, LIGHT_GRAY } from '../../styles/colors';
import { Button, NotificationMessage } from '../../components/atoms';
import { CustomModal, InputComponent, Message } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { FONT_SIZE_14 } from "../../styles/typography";
import { Auth } from 'aws-amplify';
import { SCREEN_DETAILS } from "../../constants/appConstants";

const { RESET_PASSWORD, VERIFICATION } = SCREEN_DETAILS;

type ResetPassowrdScreenProps = {
  navigation: Object
}

const ResetPassowrdScreen = ({navigation}: ResetPassowrdScreenProps) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({loading: false, success: false, error: false});
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [username, setUsername] = useState('sharathr25');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');

  const checkUsernameField = () => {
    let valid = false;
    if (username.length === 0) {
      setUsernameErrorMessage('Username cannot be empty');
    } 
    else valid = true;
    return valid;
  }

  const verify = (otp) => {
    navigation.navigate(RESET_PASSWORD.screenName, { username, otp });
  }

  const resend = async () => {
    return await Auth.forgotPassword(username);
  }

  const redirectTo = (otp) => {}

  const handleSendOTP = async () => {
    if(checkUsernameField()) {
      try {
        const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
        const { DeliveryMedium }  = CodeDeliveryDetails;
        setSuccessDesc('OTP sent Sucessfully');
        setStatus({loading:false, success: true, error: false});
        const paramsForVerificationScreen = { 
          verify, redirectTo, resend, 
          message : `Enter OTP sent registered ${DeliveryMedium === 'SMS' ? "Mobile number" : "Email"}`, 
          showStatus : false 
        }
        navigation.navigate(VERIFICATION.screenName, paramsForVerificationScreen);
      } catch (error) {
        setErrorDesc('Something went wrong');
        console.log(error);
        setStatus({loading:false, success: false, error: true});
      } finally {
        setShowModal(true);
      }
  }
}

  if (showModal) {
    const { loading, success, error } = status;
    if (loading) {
      return <CustomModal variant="loading" />
    } else if (success) {
      return <CustomModal variant="success" onClose={() => setShowModal(!showModal)} desc={successDesc}/>
    } else if (error) {
      return <CustomModal variant="error" onClose={() => setShowModal(!showModal)} desc={errorDesc}/>
    }
  }

  return (
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        <View style={{...margin(30,0,30,0)}}>
          <NotificationMessage>
            Enter registered Email(Verified) or Username
          </NotificationMessage>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent
            label="Email or Username"
            secureTextEntry={false}
            updateParentState={value => {setUsername(value); setUsernameErrorMessage('')}}
            errMsg={usernameErrorMessage}
          />
          <View>
            <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSendOTP}>Send OTP</Button>
          </View>
        </View>
      </View>
  );
}

export default ResetPassowrdScreen;

const styles = StyleSheet.create({
  appTitle: {
    marginBottom: 30,
    color: ORANGE,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'cursive'
  },
  screenTitle: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 30,
    color: BLACK,
  },
  signInContainerStyle: {
    margin: 10,
    marginTop: 25,
    padding: 10,
    backgroundColor: ORANGE,
    borderRadius: 25
  },
  signInText: {
    textAlign: 'center',
    color: WHITE,
    fontSize: 18
  },
});