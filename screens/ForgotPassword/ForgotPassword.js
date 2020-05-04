// @flow
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { Button, NotificationMessage, Toast } from '../../components/atoms';
import { CustomModal, InputComponent, OTPVerificationToast } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { toastTypes } from '../../components/atoms/Toast';

const { RESET_PASSWORD } = SCREEN_DETAILS;

type ResetPassowrdScreenProps = {
  route: Object
}

const ResetPassowrdScreen = ({route}: ResetPassowrdScreenProps) => {
  const [username, setUsername] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [recepient, setRecepient] = useState('');
  const [toast, setToast] = useState({ type: "", message: ""});

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
    } else if (password.length === 0) {
      setPasswordErrorMessage('Password cannot be empty');
    } else if(confirmPassword.length === 0) {
      setConfirmPasswordErrorMessage('Password cannot be empty');
    } else if (password !== confirmPassword) {
      setConfirmPasswordErrorMessage('Password mismatch');
    } else 
        valid = true;
    return valid;
  }

  const verify = async () => {
    try {
      setToast({ type: toastTypes.LOADING, message: "Verifying" })
      console.log(username, otp, password)
      await Auth.forgotPasswordSubmit(username, otp, password)
      setToast({ type: toastTypes.SUCCESS, message: "Success, go back and login"})
      setShowOtpInput(false)
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: "Invalid OTP" })
      console.log(error) 
    }
  }

  const resend = async () => {
    try {
      setToast({ type: toastTypes.LOADING, message: "Please wait"})
      await Auth.forgotPassword(username);
      setToast({ type: toastTypes.SUCCESS, message: "OTP has been sent"})
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: "Couldn't send OTP"})
    }
  }

  const onPasswordChange = (value) => {
    setPassword(value); 
    setPasswordErrorMessage('')
  }

  const onConfirmPasswordChange = (value) => {
    setConfirmPassowrd(value); 
    setConfirmPasswordErrorMessage('')
  }

  const onUserNameChange = (value) => {
    setUsername(value);
    setUsernameErrorMessage('')
  }

  const handleSendOTP = async () => {
    if(checkUsernameField()) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
        const { DeliveryMedium }  = CodeDeliveryDetails;
        setToast({ type: toastTypes.SUCCESS, message: "OTP sent Sucessfully" })
        setShowOtpInput(true)
        setRecepient(DeliveryMedium === 'SMS' ? "Mobile number" : "Email")
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Something went wrong" })
        console.log(error);
      }
  }
}

  return (
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
        <OTPVerificationToast 
          show={showOtpInput}
          setOtp={setOtp}
          verify={verify}
          resend={resend}
          recepient={recepient}
          onClose={() => setShowOtpInput(false)}
        />
        <View style={{...margin(30,0,30,0)}}>
          <NotificationMessage>
            Enter registered Email(Verified) or Username
          </NotificationMessage>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent
            label="Email or Username"
            secureTextEntry={false}
            updateParentState={onUserNameChange}
            errMsg={usernameErrorMessage}
          />
          <InputComponent
            label="Password"
            showPasswordIcon={true}
            updateParentState={onPasswordChange}
            errMsg={passwordErrorMessage}
          />
          <InputComponent
            label="Confirm Password"
            showPasswordIcon={true}
            updateParentState={onConfirmPasswordChange}
            errMsg={confirmPasswordErrorMessage}
          />
          <View>
            <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSendOTP}>Update</Button>
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