// @flow
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { regex } from '../../utils/index';
import { Link, Button, NotificationMessage } from '../../components/atoms';
import { CustomModal,InputComponent } from '../../components/molecules';
import { ScrollView } from 'react-native-gesture-handler';
import { LIGHT_GRAY } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { Auth } from "aws-amplify";
import { LOGIN_SCREEN, SCREEN_DETAILS } from "../../constants/appConstants";

const { SIGNUP, FORGOT_PASSWORD , MAIN } = SCREEN_DETAILS;

const emailRegex = regex.email;

type LoginScreenProps = {
  navigation: Object
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [userName, setUserName] = useState('');
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [err, setError] = useState('');

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
        setLoaderVisible(true);
        const uname = userName.match(emailRegex) ? userName : `+91${userName}`
        await Auth.signIn({username: uname , password });
        navigation.replace(MAIN.screenName);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoaderVisible(false);
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

  const _setShowPassword = () => {
    setShowPassword(!showPassword);
  }

  if(loaderVisible) return <CustomModal desc="Please Wait..." />

  if(err.length !== 0) return <CustomModal variant="error" desc={err} onClose={() => setError('')}/>

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: WHITE, }}>
      <View style={{flex: 1}}>
        <HeadingTitle />
        <View style={{flex: 1,justifyContent:'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent label="Email or Mobile number" updateParentState={onUsernameChange} errMsg={userNameErrorMessage} />
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
