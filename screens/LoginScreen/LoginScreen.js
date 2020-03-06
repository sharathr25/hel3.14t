// @flow
import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { APP_TITLE } from '../../constants/appConstants';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { getEmail, loginWithEmailAndPassword } from '../../fireBase/auth/login';
import { checkUserNameAndPasswordFields, regex } from '../../utils/index';
import { InputComponent, ErrorMessage , Link, Button } from '../../components/atoms';
import { CustomModal } from '../../components/molecules';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { LIGHT_BLUE } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { Auth } from "aws-amplify";

const emailRegex = regex.email;

type LoginScreenProps = {
  navigation: Object
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [userName, setUserName] = useState('');
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  }

  const handleResetPassword = () => {
    navigation.navigate('ResetPassword');
  }

  const checkUserNameAndPassword = () => {
    const datum = checkUserNameAndPasswordFields(userName, password);
    if (datum.valid) return datum.valid
    else {
      const { key } = datum;
      setUserNameErrorMessage(datum[key]);
    }
  };

  const handleLogin = async () => {
    if (checkUserNameAndPassword()) {
      try {
        setLoaderVisible(true);
        const uname = userName.match(emailRegex) ? userName : `+91${userName}`
        const user = await Auth.signIn({username: uname , password })
        navigation.navigate('Main', { user });
      } catch (error) {
        console.log(error);
      } finally {
        setLoaderVisible(false);
      }
    }
  }

  const { registerContainer } = styles;

  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: WHITE, }}>
      <View style={{ flex: 1, margin: 10 }}>
        {loaderVisible && <CustomModal desc="Please Wait..." />}
        <View style={{flex: 1,justifyContent:'space-evenly'}}>
          <InputComponent
            label="Email or Mobile Number"
            updateParentState={value => { setUserName(value); setUserNameErrorMessage('') }}
            errMsg={userNameErrorMessage}
          />
          <View>
            <InputComponent
              label="Password"
              secureTextEntry={true}
              updateParentState={value => { setPassword(value); setPasswordErrorMessage('') }}
              errMsg={passwordErrorMessage}
            />
            <Link onPress={handleResetPassword} style={{ alignSelf: 'flex-end', paddingRight: 20 }} >Forgot Password?</Link>
          </View>
          
          <View style={{...margin(10,30,10,30)}}>
            <Button bgColor={ORANGE} textColor={WHITE} onPress={handleLogin}>Sign In</Button>
          </View>
        </View>
        <View style={registerContainer}>
          <Text>Don't have an account? </Text><Link onPress={handleSignUp}>Register</Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10
  }
});

export default LoginScreen;
