
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BLACK } from '../../styles/colors';
import { StyleProvider, Container, Content, Button ,Text, Header } from 'native-base'
import { regex, passwordConstraints, loginUserNameConstraints } from '../../utils/index';
import { Link, Toast } from '../../components/atoms';
import { Input } from '../../components/molecules';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { toastTypes } from '../../components/atoms/Toast';
import { FONT_SIZE_16, FONT_SIZE_18 } from '../../styles/typography';
import { useForm } from '../../customHooks';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const { SIGNUP, FORGOT_PASSWORD , MAIN } = SCREEN_DETAILS;

const { email: emailRegex } = regex;

type LoginScreenProps = {
  navigation: Object
}

const USER_NAME = 'username';
const PASSWORD = 'password';

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const { values, errors, bindField, isValid } = useForm({
    [USER_NAME]: { constraints: loginUserNameConstraints },
    [PASSWORD]: { constraints: passwordConstraints }
  });
  const [toast, setToast] = useState({ type: "", message: "" })

  const handleSignUp = () => {
    navigation.navigate(SIGNUP.screenName);
  }

  const handleResetPassword = () => {
    navigation.navigate(FORGOT_PASSWORD.screenName);
  }

  const handleLogin = async () => {
    if(isValid()) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const uname = values[USER_NAME].match(emailRegex) ? values[USER_NAME] : `+91${values[USER_NAME]}`
        await Auth.signIn({username: uname , password: values[PASSWORD] });
        if(navigation.canGoBack()) navigation.popToTop();
        navigation.replace(MAIN.screenName);
      } catch (error) {
        console.log(error);
        setToast({ type: toastTypes.ERROR, message: error.message })
      }
    } else return;
  }

  const { registerContainer } = styles;

  const RegiterAccountLink = () => (
    <View style={registerContainer}>
      <Text>Don't have an account? </Text>
      <Link onPress={handleSignUp} style={{fontSize: FONT_SIZE_16}}>Register</Link>
    </View>
  )

  return (
    <StyleProvider style={getTheme(material)}>
      <Container>
        {toast.type ? <Toast type={toast.type} message={toast.message} /> : null}
        <Header>
          <Text style={{ textAlignVertical: 'center' }}>
            Enter email(Verified) or mobile number
          </Text>
        </Header>
        <Content style={{ marginHorizontal: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Input 
              label="Email"
              {...bindField(USER_NAME)}
              errMsg={errors[USER_NAME]}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Input
              label="Password"
              {...bindField(PASSWORD)}
              showPasswordIcon={true}
              errMsg={errors[PASSWORD]}
            />
            <Link onPress={handleResetPassword} style={{ alignSelf: 'flex-end' }}>
              Forgot Password?
            </Link>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button primary full large onPress={handleLogin}>
              <Text>Log in</Text>
            </Button>
          </View>
          <RegiterAccountLink />
        </Content>
      </Container>
    </StyleProvider>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoginScreen;
