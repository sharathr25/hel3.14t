// @flow
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { ErrorMessage, Button } from '../../components/atoms';
import { regex } from '../../utils/index';
import { CustomModal, InputComponent } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { Auth } from 'aws-amplify';

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
            const { username, otp } = route.params;
            setStatus({loading:true, success: false, error: false});
            try {
                const data = await Auth.forgotPasswordSubmit(username, otp, password)
                console.log(data)
                setSuccessDesc('Password Changed Sucessfully');
                setStatus({loading:false, success: true, error: false});
            } catch (error) {
                setErrorDesc('Password change failed, enter valid OTP');
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
      return <CustomModal variant="success" onClose={() => {setShowModal(!showModal);navigation.navigate('Login');}} desc={successDesc}/>
    } else if (error) {
      return <CustomModal variant="error" onClose={() => {setShowModal(!showModal);navigation.goBack();}} desc={errorDesc}/>
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: WHITE }}>
      <View style={{backgroundColor:"#C4C4C4", display:'flex', alignItems:'center', padding: 10, marginTop: 30}}>
        <Text style={{color: BLACK, fontSize: 15 }}>Enter OTP and New password</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'space-evenly' , ...margin(0,30,0,30) }}>
        <InputComponent
          label="Password"
          showPasswordIcon={true}
          updateParentState={value => {setPassword(value); setPasswordErrorMessage('')}}
          errMsg={passwordErrorMessage}
        />
        <InputComponent
          label="Confirm Password"
          showPasswordIcon={true}
          updateParentState={value => {setConfirmPassowr(value); setConfirmPasswordErrorMessage('')}}
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
