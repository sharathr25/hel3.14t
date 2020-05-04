// @flow
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { regex } from '../../utils/index';
import { Link, Button, NotificationMessage, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { ScrollView } from 'react-native-gesture-handler';
import { margin } from '../../styles/mixins';
import { Auth } from "aws-amplify";
import { LOGIN_SCREEN, SCREEN_DETAILS } from "../../constants/appConstants";
import { toastTypes } from '../../components/atoms/Toast';

const { SIGNUP, FORGOT_PASSWORD , MAIN } = SCREEN_DETAILS;

const emailRegex = regex.email;

type LoginScreenProps = {
  navigation: Object
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [userName, setUserName] = useState('');
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [toast, setToast] = useState({ type: "", message: "" })

  const handleSignUp = () => {
    navigation.navigate(SIGNUP.screenName);
  }

  const handleResetPassword = () => {
    navigation.navigate(FORGOT_PASSWORD.screenName);
  }

  const isValid = () => {
    let valid = false;
    if (userName.length === 0) {
      setUserNameErrorMessage(LOGIN_SCREEN.ERRORS.EMPTY_USERNAME_ERROR);
    } else if (!(userName.match(regex.email) || userName.match(regex.phoneNo))) {
      setUserNameErrorMessage(LOGIN_SCREEN.ERRORS.INVALID_USERNAME_ERROR);
    } else if (password.length === 0) {
      setPasswordErrorMessage(LOGIN_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR);
    } else if (password.length < 6) {
      setPasswordErrorMessage(LOGIN_SCREEN.ERRORS.INVALID_PASSWORD_ERROR);
    } else {
      valid = true;
    }
    return valid;
  }

  const handleLogin = async () => {
    if (isValid()) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const uname = userName.match(emailRegex) ? userName : `+91${userName}`
        await Auth.signIn({username: uname , password });
        navigation.replace(MAIN.screenName);
      } catch (error) {
        console.log(error);
        setToast({ type: toastTypes.ERROR, message: error.message })
      }
    }
  }

  const { registerContainer } = styles;

  const HeadingTitle = () => (
    <View style={{...margin(30,0,30,0)}}>
      <NotificationMessage>
        Enter email(Verified) or mobile number
      </NotificationMessage>
    </View>
  );

  const SignInButton = () => (
     <View>
        <Button bgColor={ORANGE} textColor={WHITE} onPress={handleLogin}>Log In</Button>
     </View>
  )

  const RegiterAccountLink = () => (
    <View style={registerContainer}>
      <Text style={{color: BLACK, fontSize: 15}}>Don't have an account? </Text>
      <Link onPress={handleSignUp} style={{fontSize: 15}}>Register</Link>
    </View>
  )

  const onUsernameChange = (value) => {
    setUserName(value); 
    setUserNameErrorMessage('')
  }

  const onPasswordChange = (value) => {
    setPassword(value); 
    setPasswordErrorMessage('')
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: WHITE, }}>
      {toast.type ? <Toast type={toast.type} message={toast.message} /> : null}
      <View style={{flex: 1}}>
        <HeadingTitle />
        <View style={{flex: 1,justifyContent:'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent 
            label="Email or Mobile number" 
            updateParentState={onUsernameChange} 
            errMsg={userNameErrorMessage} 
          />
          <View>
            <InputComponent 
              label="Password" 
              updateParentState={onPasswordChange} 
              errMsg={passwordErrorMessage} 
              showPasswordIcon={true}
            />
            <Link onPress={handleResetPassword} style={{ alignSelf: 'flex-end', paddingRight: 10, fontSize: 15 }} >Forgot Password?</Link>
          </View>
          <SignInButton />
        </View>
        <RegiterAccountLink />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20
  }
});

export default LoginScreen;
