// @flow
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { Button, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';
import { toastTypes } from '../../components/atoms/Toast';

const ResetPassowrdScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const [toast, setToast] = useState({ type: "", message: ""});

  const checkFields = () => {
    let valid = false;
    if (oldPassword.length === 0) {
      setOldPasswordErrorMessage('Old password cannot be empty');
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

  const onPasswordChange = (value) => {
    setPassword(value); 
    setPasswordErrorMessage('')
  }

  const onConfirmPasswordChange = (value) => {
    setConfirmPassowrd(value); 
    setConfirmPasswordErrorMessage('')
  }

  const onOldPasswordChange = (value) => {
    setOldPassword(value);
    setOldPasswordErrorMessage('')
  }

  const handleChange = async () => {
    if(checkFields()) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const user = await Auth.currentAuthenticatedUser()
        await Auth.changePassword(user, oldPassword, password)
        setToast({ type: toastTypes.SUCCESS, message: "Password changed" })
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Something went wrong" })
        console.log(error);
      }
  }
}

  return (
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
        <View style={{ flex: 1, justifyContent: 'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent
            label="Old Password"
            showPasswordIcon={true}
            updateParentState={onOldPasswordChange}
            errMsg={oldPasswordErrorMessage}
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
            <Button bgColor={ORANGE} textColor={WHITE} onPress={handleChange}>Change</Button>
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