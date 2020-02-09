import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { View, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SCREEN_TITLES, APP_TITLE } from '../constants/appConstants';
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE, BLACK } from '../constants/styleConstants';
import { getEmail, loginWithEmailAndPassword } from '../fireBase/auth/login';
import { checkUserNameAndPasswordFields, regex } from '../utils/index';
import ErrorMessage from '../components/common/errorMessage';
import ScreenRedirecter from '../components/common/screenRedirecter';
import InputComponent from '../components/common/inputComponent';
import { useAuth } from '../customHooks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton, ScrollView } from 'react-navigation';

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

  const { signInContainerStyle, signInText, appTitle, screenTitle, linkText, registerContainer } = styles;


  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={appTitle}>{APP_TITLE}</Text>
          <Text style={screenTitle}>Sign In</Text>
          <InputComponent
            label="Email or Mobile Number"
            updateParentState={value => { setUserName(value); setUserNameErrorMessage('') }}
          />
          {userNameErrorMessage.length !== 0 && <ErrorMessage errorMessage={userNameErrorMessage} />}
          <InputComponent
            label="Password"
            secureTextEntry={true}
            updateParentState={value => { setPassword(value); setPasswordErrorMessage('') }}
          />
          {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}
          <TouchableOpacity onPress={handleResetPassword} style={{ alignSelf: 'flex-end', paddingRight: 20 }}>
            <Text style={linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          {
            loaderVisible
              ? <ActivityIndicator color={FLAG_COLOR_ORANGE} />
              : <TouchableOpacity onPress={handleLogin} style={signInContainerStyle}>
                <Text style={signInText}>Sign In</Text>
              </TouchableOpacity>
          }
        </View>
        <View style={registerContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={linkText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    marginBottom: 30,
    color: FLAG_COLOR_ORANGE,
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
    backgroundColor: FLAG_COLOR_ORANGE,
    borderRadius: 25
  },
  signInText: {
    textAlign: 'center',
    color: FLAG_COLOR_WHITE,
    fontSize: 18
  },
  linkText: {
    color: "#1DA1F2"
  },
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10
  }
});

LoginScreen.navigationOptions = {
  title: SCREEN_TITLES.LOGIN,
  headerLeft: null
}

LoginScreen.navigationOptions = ({ navigation }) => ({
  title: '',
  headerLeft: (<HeaderBackButton onPress={() => { navigation.goBack() }} tintColor={FLAG_COLOR_ORANGE} />),
  headerRight: null
})

export default LoginScreen;
