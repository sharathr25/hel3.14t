// @flow
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { Button, NotificationMessage } from '../../components/atoms';
import { CustomModal, InputComponent, OTPVerificationModal } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';
import { SCREEN_DETAILS } from "../../constants/appConstants";

const { RESET_PASSWORD } = SCREEN_DETAILS;

type ResetPassowrdScreenProps = {
  navigation: Object,
  route: Object
}

const ResetPassowrdScreen = ({navigation, route}: ResetPassowrdScreenProps) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({loading: false, success: false, error: false});
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [username, setUsername] = useState('sharathr25');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [recepient, setRecepient] = useState('');

  useEffect(() => {
    if(route.params) {
      setShowOtpInput(route.params.showOtpInput)
      setUsername(route.params.username)
    }
  }, [route.params])

  const checkUsernameField = () => {
    let valid = false;
    if (username.length === 0) {
      setUsernameErrorMessage('Username cannot be empty');
    } 
    else valid = true;
    return valid;
  }

  const verify = () => {
    setShowOtpInput(false)
    navigation.navigate(RESET_PASSWORD.screenName, { username, otp });
  }

  const resend = async () => {
    return await Auth.forgotPassword(username);
  }

  const handleSendOTP = async () => {
    if(checkUsernameField()) {
      try {
        const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
        const { DeliveryMedium }  = CodeDeliveryDetails;
        setSuccessDesc('OTP sent Sucessfully');
        setStatus({loading:false, success: true, error: false});
        setShowOtpInput(true)
        setRecepient(DeliveryMedium === 'SMS' ? "Mobile number" : "Email")
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
    // TODO : try to figure out how to show this in toast
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
        <OTPVerificationModal 
          show={showOtpInput}
          setOtp={setOtp}
          verify={verify}
          resend={resend}
          recepient={recepient}
          onClose={() => setShowOtpInput(false)}
        />
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