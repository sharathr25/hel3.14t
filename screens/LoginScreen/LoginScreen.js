// @flow
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { regex, passwordConstraints, loginUserNameConstraints } from '../../utils/index';
import { Link, Button, NotificationMessage, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { toastTypes } from '../../components/atoms/Toast';
import { FONT_SIZE_16 } from '../../styles/typography';

const { SIGNUP, FORGOT_PASSWORD , MAIN } = SCREEN_DETAILS;

const { email: emailRegex } = regex;

type LoginScreenProps = {
  navigation: Object
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ type: "", message: "" })
  const [isUserNameValid, setUserNameIsValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  const handleSignUp = () => {
    navigation.navigate(SIGNUP.screenName);
  }

  const handleResetPassword = () => {
    navigation.navigate(FORGOT_PASSWORD.screenName);
  }

  const handleLogin = async () => {
    if(isUserNameValid && isPasswordValid) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const uname = userName.match(emailRegex) ? userName : `+91${userName}`
        await Auth.signIn({username: uname , password });
        if(navigation.canGoBack()) navigation.popToTop();
        navigation.replace(MAIN.screenName);
      } catch (error) {
        console.log(error);
        setToast({ type: toastTypes.ERROR, message: error.message })
      }
    } else return;
  }

  const { registerContainer } = styles;

  const HeadingTitle = () => (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <NotificationMessage>
        Enter email(Verified) or mobile number
      </NotificationMessage>
    </View>
  );

  const SignInButton = () => (
     <View style={{flex: 1, justifyContent: 'center' }}>
        <Button bgColor={ORANGE} textColor={WHITE} onPress={handleLogin}>Log In</Button>
     </View>
  )

  const RegiterAccountLink = () => (
    <View style={registerContainer}>
      <Text style={{color: BLACK, fontSize: FONT_SIZE_16}}>Don't have an account? </Text>
      <Link onPress={handleSignUp} style={{fontSize: FONT_SIZE_16}}>Register</Link>
    </View>
  )

  return (
    <ScrollView style={{ backgroundColor: WHITE }} contentContainerStyle={{ flexGrow: 1 }}>
      {toast.type ? <Toast type={toast.type} message={toast.message} /> : null}
      <HeadingTitle />
      <View style={{flex: 5, margin: 20 }}>
        <View style={{flex: 1, justifyContent: 'center' }}>
          <InputComponent 
            label="Email or Mobile number" 
            updateParentState={setUserName} 
            setIsValid={setUserNameIsValid}
            constraints={loginUserNameConstraints}
          />
        </View>
        <View style={{flex :1, alignItems: 'flex-end', justifyContent: 'center' }}>
          <InputComponent 
            label="Password" 
            updateParentState={setPassword} 
            showPasswordIcon={true}
            setIsValid={setIsPasswordValid}
            constraints={passwordConstraints}
          />
          <Link onPress={handleResetPassword}>
            Forgot Password?
          </Link>
        </View>  
        <SignInButton />
        <RegiterAccountLink />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  linkStyle: {

  }
});

export default LoginScreen;
