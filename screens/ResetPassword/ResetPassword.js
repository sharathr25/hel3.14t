// @flow
import React, { useState } from 'react';
import { View } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { Button, NotificationMessage } from '../../components/atoms';
import { CustomModal, InputComponent } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';
import { SCREEN_DETAILS } from "../../constants/appConstants";

const { LOGIN } = SCREEN_DETAILS;

type ResetPassowrdScreenProps = {
  navigation: Object,
  route: Object
}

const ResetPassowrdScreen = ({ navigation,route }: ResetPassowrdScreenProps) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({loading: false, success: false, error: false});
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowr] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

  const checkPasswordField = () => {
    let valid = false;
    if (password.length === 0) {
      setPasswordErrorMessage('Password cannot be empty');
    } else if(confirmPassword.length === 0) {
      setConfirmPasswordErrorMessage('Password cannot be empty');
    } else if (password !== confirmPassword) {
      setConfirmPasswordErrorMessage('Password mismatch');
    } else valid = true;
    return valid;
  }

  const handleResetPassword = async () => {
    if(checkPasswordField()) {
      const { params } = route;
      const { username, otp } = params;
      setStatus({loading:true, success: false, error: false});
      try {
          await Auth.forgotPasswordSubmit(username, otp, password)
          setSuccessDesc('Password Changed Sucessfully');
          setStatus({loading:false, success: true, error: false});
      } catch (error) {
          setErrorDesc('Password change failed, enter valid OTP');
          setStatus({loading:false, success: false, error: true});
          console.log(error)
      } finally {
          setShowModal(true);
      }
    }
  }

  const handleSuccess = () => {
    setShowModal(!showModal);
    navigation.navigate(LOGIN.screenName);
  }

  const handleError = () => {
    setShowModal(!showModal);
    navigation.goBack();
  }

  const onPasswordChange = (value) => {
    setPassword(value); 
    setPasswordErrorMessage('')
  }

  const onConfirmPasswordChange = (value) => {
    setConfirmPassowr(value); 
    setConfirmPasswordErrorMessage('')
  }

  if (showModal) {
    const { loading, success, error } = status;
    if (loading) {
      return <CustomModal variant="loading" />
    } else if (success) {
      return <CustomModal variant="success" onClose={handleSuccess} desc={successDesc}/>
    } else if (error) {
      return <CustomModal variant="error" onClose={handleError} desc={errorDesc}/>
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: WHITE }}>
      <View style={{ ...margin(30,0,30,0) }}>
        <NotificationMessage>Enter New password</NotificationMessage>
      </View>
      <View style={{ flex: 1, justifyContent: 'space-evenly' , ...margin(0,30,0,30) }}>
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
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleResetPassword}>Change Password</Button>
        </View>
      </View>
    </View>
  );
}

export default ResetPassowrdScreen;
