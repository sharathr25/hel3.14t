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
    console.log(username);
    if (username.length === 0) {
      setUsernameErrorMessage('Username cannot be empty');
    } 
    // else if (!(username.match(regex.phoneNo))) {
      // setUsernameErrorMessage('Invalid username format');
    // }
     else valid = true;
    return valid;
  }

  const handleSendOTP = async () => {
    if(checkUsernameField()) {
      try {
        const data = await Auth.forgotPassword(username);
        setSuccessDesc('OTP sent Sucessfully');
        setStatus({loading:false, success: true, error: false});
        console.log(data)
        navigation.navigate('ResetPassword', { username });
      } catch (error) {
        console.log(error)
        setErrorDesc('Something went wrong');
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
      <View style={{ flex: 1, backgroundColor: WHITE, justifyContent: 'space-evenly' }}>
        <View style={{backgroundColor:"#C4C4C4", display:'flex', alignItems:'center', padding: 10}}>
          <Text style={{color: BLACK}}>Enter you Registered email or mobile number</Text>
        </View>
        <InputComponent
          label="Username"
          secureTextEntry={false}
          updateParentState={value => {setUsername(value); setUsernameErrorMessage('')}}
        />
        {usernameErrorMessage.length !== 0 && <ErrorMessage message={usernameErrorMessage} />}
        <View style={{...margin(0,10,0,10)}}>
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSendOTP}>Send OTP</Button>
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