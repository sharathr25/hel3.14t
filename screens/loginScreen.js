import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { View, Alert, ActivityIndicator } from 'react-native';
import { SCREEN_TITLES } from '../constants/appConstants';
import { styles, FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import { getEmail, loginWithEmailAndPassword } from '../fireBase/auth/login';
import { checkUserNameAndPasswordFields, regex } from '../utils/index';
import ErrorMessage from '../components/common/errorMessage';
import ScreenRedirecter from '../components/common/screenRedirecter';
import InputComponent from '../components/common/inputComponent';
import { useAuth } from '../customHooks';

const emailRegex = regex.email;

const LoginScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const { user, initializing } = useAuth();
  const { navigation } = props;

  useEffect(() => {
    if (user) {
      navigation.navigate('Main', { currentUser: user });
    }
  }, [initializing]);

  handleSignUp = () => {
    navigation.navigate('SignUp');
  }

  handleResetPassword = () => {
    navigation.navigate('ResetPassword');
  }

  checkUserNameAndPassword = () => {
    const datum = checkUserNameAndPasswordFields(userName, password);
    if (datum.valid) return datum.valid
    else {
      const { key } = datum;
      if (key == 'userNameErrorMessage') {
        setUserNameErrorMessage(datum[key]);
      } else {
        setPasswordErrorMessage(datum[key]);
      }
    }
  };

  loginWithEmail = async (email, password) => {
    try {
      const user = await loginWithEmailAndPassword(email, password);
      setLoaderVisible(false);
      navigation.navigate('Main', { currentUser: user });
    } catch (err) {
      Alert.alert('invalid username or password. please try again...');
      console.log(err);
    }
  }

  loginWithMobileNumber = async (mobileNumber, password) => {
    try {
      const email = await getEmail(mobileNumber);
      if (email) {
        await loginWithEmail(email, password);
      } else {
        Alert.alert('user not found');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('user not found');
    }
  }

  handleLogin = async () => {
    setLoaderVisible(true);
    if (checkUserNameAndPassword()) {
      if (userName.match(emailRegex)) {
        await loginWithEmail(userName, password);
      } else {
        await loginWithMobileNumber(userName, password);
      }
    }
    setLoaderVisible(false);
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <InputComponent
        placeholder="Email or Mobile Number"
        secureTextEntry={false}
        updateParentState={value => { setUserName(value); setUserNameErrorMessage('') }}
      />
      {userNameErrorMessage.length !== 0 && <ErrorMessage errorMessage={userNameErrorMessage} />}
      <InputComponent
        placeholder="Password"
        secureTextEntry={true}
        updateParentState={value => { setPassword(value); setPasswordErrorMessage('') }}
      />
      {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}
      {
        loaderVisible
          ? <ActivityIndicator color={FLAG_COLOR_ORANGE} />
          : <Button
              title="Login"
              titleStyle={{ color: FLAG_COLOR_WHITE }}
              buttonStyle={styles.button}
              onPress={handleLogin}
            />
      }
      <ScreenRedirecter title="New user?" buttonText="Sign up" handleRedirection={handleSignUp} />
      <ScreenRedirecter title="Forgot password?" buttonText="Reset Password" handleRedirection={handleResetPassword} />
    </View>
  );
}

LoginScreen.navigationOptions = {
  title: SCREEN_TITLES.LOGIN,
  headerLeft: null
}

export default LoginScreen;
