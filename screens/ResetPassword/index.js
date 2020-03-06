// @flow
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { InputComponent, ErrorMessage, Button } from '../../components/atoms';
import { regex } from '../../utils/index';
import { CustomModal } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';

type ResetPassowrdScreenProps = {
  navigation: Object,
  route: Object
}

const ResetPassowrdScreen = (props: ResetPassowrdScreenProps) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({loading: false, success: false, error: false});
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [otp, setOtp] = useState('');
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
            const { navigation,route } = props;
            const { username } = route.params;
            console.log(username, password, otp);
            setStatus({loading:true, success: false, error: false});
            try {
                const data = await Auth.forgotPasswordSubmit(username, otp, password)
                console.log(data)
                setSuccessDesc('Password Changed Sucessfully');
                setStatus({loading:false, success: true, error: false});
                navigation.navigate('Login');
            } catch (error) {
                setErrorDesc('Password change failed');
                setStatus({loading:false, success: false, error: true});
                console.log(error)
            } finally {
                setShowModal(true);
            }
    }}

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
      <View style={{ flex: 1, backgroundColor: WHITE, justifyContent: 'space-evenly' }}>
          <InputComponent
          label="OTP"
          secureTextEntry={true}
          updateParentState={value => {setOtp(value)}}
        />
        <InputComponent
          label="Password"
          secureTextEntry={true}
          updateParentState={value => {setPassword(value); setPasswordErrorMessage('')}}
        />
        {passwordErrorMessage.length !== 0 && <ErrorMessage message={passwordErrorMessage} />}
        <InputComponent
          label="Confirm Password"
          secureTextEntry={true}
          updateParentState={value => {setConfirmPassowr(value); setConfirmPasswordErrorMessage('')}}
        />
        {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage message={confirmPasswordErrorMessage} />}
        <View style={{...margin(0,10,0,10)}}>
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleResetPassword}>Change Password</Button>
        </View>
      </View>
  );
}

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

export default ResetPassowrdScreen;
