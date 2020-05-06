// @flow
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { regex, passwordConstraints, loginUserNameConstraints } from '../../utils/index';
import { Link, Button, NotificationMessage, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { ScrollView } from 'react-native-gesture-handler';
import { margin } from '../../styles/mixins';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { toastTypes } from '../../components/atoms/Toast';

const { SIGNUP, FORGOT_PASSWORD , MAIN } = SCREEN_DETAILS;

const emailRegex = regex.email;

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
        navigation.replace(MAIN.screenName);
      } catch (error) {
        console.log(error);
        setToast({ type: toastTypes.ERROR, message: error.message })
      }
    } else return;
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

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: WHITE, }}>
      {toast.type ? <Toast type={toast.type} message={toast.message} /> : null}
      <View style={{flex: 1}}>
        <HeadingTitle />
        <View style={{flex: 1,justifyContent:'space-evenly', ...margin(0,30,0,30)}}>
          <InputComponent 
            label="Email or Mobile number" 
            updateParentState={setUserName} 
            setIsValid={setUserNameIsValid}
            constraints={loginUserNameConstraints}
          />
          <View>
            <InputComponent 
              label="Password" 
              updateParentState={setPassword} 
              showPasswordIcon={true}
              setIsValid={setIsPasswordValid}
              constraints={passwordConstraints}
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
