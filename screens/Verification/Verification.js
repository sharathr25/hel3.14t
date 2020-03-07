import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK, LIGHT_BLUE } from '../../styles/colors';
import { InputComponent, ErrorMessage } from '../../components/atoms';
import { regex } from '../../utils/index';
import { getUser } from '../../fireBase/database';
import { CustomModal } from '../../components/molecules';
import { Button } from '../../components/atoms'; 
import { Auth } from "aws-amplify";
import { margin } from "../../styles/mixins";

type VerificationProps = {
  navigation: Object,
  route: Object
}

const Verification = (props: VerificationProps) => {
  const [OTP, setOTP] = useState('');
  const { navigation, route } = props;
  const { params } = route;
  const { username, mobileNumber, email, type="phone", redirectTo="Login" } = params;
  const [showModal, setShowModal] = useState(false);
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');

  const sendOtpToEmail = () => {
    Auth.verifyCurrentUserAttribute('email') //user should be authenticated to send otp to email
        .then(() => {
          console.log('code sent successfully');
        }).catch((e) => {
          console.log(e, 'code sent failed')
      });
  }

  useEffect(() => {
    if(type === "email") {
      sendOtpToEmail();
    }
  }, []);

  const verifyPhoneOTP = async () => {
    await Auth.confirmSignUp(username, OTP, { forceAliasCreation: true });
  }

  const verifyEmailOTP = async () => {
    await Auth.verifyCurrentUserAttributeSubmit('email', OTP)
  }

  const resendOTPToEmail = () => {
    sendOtpToEmail();
  }

  const resendOTPTOPhone = () => {
    Auth.resendSignUp(username)
      .then(() => {
        onSuccess('Code Resent successfully');
      })
      .catch(e => {
        onError(e, 'Code resent failed');
      }
    );
  }

    const handleResendOtp = () => {
      if(type === "phone") {
        resendOTPTOPhone();
      } else {
        resendOTPToEmail();
      }
    }

    const onSuccess = async (msg) => {
      setShowModal(true);
      setErrorDesc('');
      setSuccessDesc(msg);
      console.log(msg);
    }

    const onError = (error, msg) => {
      setShowModal(true);
      setSuccessDesc('');
      setErrorDesc(msg);
      console.log(error);
    }
   
  const handleVerify = async () => {
    try {
      if(type === "phone") {
        await verifyPhoneOTP();
      } else {
        await verifyEmailOTP();
      }
      onSuccess('OTP verification successfull');
      await Auth.signOut();
      navigation.navigate(redirectTo);
    } catch (error) {
      onError(error, "Verification code invalid");
    }
  }

  const hideModal = () => {
    setShowModal(false);
    setSuccessDesc('');
    setErrorDesc('');
  }

  const NotificationMessage = () => (
    <View style={{ backgroundColor: '#C4C4C4', marginBottom: 10, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
      <Text style={{ color: BLACK }}>
        { type === "phone" 
            ? `Enter OTP sent to xxxxxxxxx${mobileNumber.substring(8)}`
            : `Enter OTP sent to xxxxxxxxx@${email.split('@')[1]}`
        }
      </Text>
    </View>
  );

  const ResendLink = () => (
    <View style={{ flexDirection: 'row',alignSelf: 'flex-end', ...margin(0,10,0,0) }}>
      <Text>Haven’t received OTP? </Text>
      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={{color: LIGHT_BLUE}}>Resend</Text>
      </TouchableOpacity>
    </View>
  );

  const VerifyButton = () => (
    <View style={{...margin(30,30,0,30)}}>
      <Button bgColor={ORANGE} textColor={WHITE} onPress={handleVerify}>Verify</Button>
    </View>
  );

  if(showModal) {
    if(successDesc.length === 0 && errorDesc.length === 0) {
      return <CustomModal variant="loading" /> 
    } else if(successDesc.length != 0) {
      return <CustomModal variant="success" desc={successDesc} onClose={hideModal} />
    } else {
      return <CustomModal variant="error" desc={errorDesc} onClose={hideModal} />
    }
  }

  return (
      <View style={{ backgroundColor: WHITE, flex: 1, paddingTop: 20 }}>
        <NotificationMessage />
        <InputComponent label="OTP" secureTextEntry={false} updateParentState={setOTP} />
        <ResendLink />
        <VerifyButton />
      </View>
  );
}

export default Verification;
