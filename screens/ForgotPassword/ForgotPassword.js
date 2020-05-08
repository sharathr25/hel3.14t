// @flow
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { Button, NotificationMessage, Toast } from '../../components/atoms';
import { InputComponent, OTPVerificationToast } from '../../components/molecules';
import { Auth } from 'aws-amplify';
import { toastTypes } from '../../components/atoms/Toast';
import { userNameConstraints, passwordConstraints } from '../../utils/formConstraints';

const ResetPassowrdScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [recepient, setRecepient] = useState('');
  const [toast, setToast] = useState({ type: "", message: ""});
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)
  const [isUserNameValid, setIsUserNamevalid] = useState(false)

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

  const handleSendOTP = async () => {
    if(isUserNameValid && isPasswordValid && isConfirmPasswordValid) {
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
    } else return;
  }

  return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: WHITE}}>
        {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
        <OTPVerificationToast 
          show={showOtpInput}
          setOtp={setOtp}
          verify={verify}
          resend={resend}
          recepient={recepient}
          onClose={() => setShowOtpInput(false)}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <NotificationMessage>
              Enter registered Email(Verified) or Username
            </NotificationMessage>
          </View>
          <View style={{ flex: 5, margin: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <InputComponent
                label="Email or Username"
                secureTextEntry={false}
                updateParentState={setUsername}
                setIsValid={setIsUserNamevalid}
                constraints={userNameConstraints}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <InputComponent
                label="Password"
                showPasswordIcon={true}
                updateParentState={setPassword}
                setIsValid={setIsPasswordValid}
                constraints={passwordConstraints}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <InputComponent
                label="Confirm Password"
                showPasswordIcon={true}
                updateParentState={setConfirmPassowrd}
                setIsValid={setIsConfirmPasswordValid}
                constraints={[...passwordConstraints, { fun: () => password === confirmPassword, message: "password mismatch"}]}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSendOTP}>Reset</Button>
            </View>
          </View>
        </View>
      </ScrollView>
  );
}

export default ResetPassowrdScreen;