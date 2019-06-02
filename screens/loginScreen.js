import React, { Component } from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { View, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import { LOGIN_SCREEN, SCREEN_TITLES } from '../constants/appConstants';
import { styles } from '../constants/styleConstants';
import Loader from '../components/loader';

class LoginScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.LOGIN
  };

  constructor() {
    super();
    this.state = {
      userName: '',
      userNameErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      loaderVisible: false,
    };
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();
    // const { navigation } = this.props;
    // if (currentUser) navigation.navigate('Main', { currentUser });
    if (currentUser) firebase.auth().signOut();
  }

  checkUserNameAndPasswordFields = () => {
    let valid = false;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const phoneNoRegex = /^\d{10}$/;
    const {
      userName, password
    } = this.state;
    if (userName.length === 0) {
      this.setState({
        userNameErrorMessage: LOGIN_SCREEN.ERRORS.EMPTY_USERNAME_ERROR
      });
    } else if (!(userName.match(emailRegex) || userName.match(phoneNoRegex))) {
      this.setState({
        userNameErrorMessage: LOGIN_SCREEN.ERRORS.INVALID_USERNAME_ERROR
      });
    } else if (password.length === 0) {
      this.setState({
        passwordErrorMessage: LOGIN_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR
      });
    } else if (password.length < 6) {
      this.setState({
        passwordErrorMessage: LOGIN_SCREEN.ERRORS.INVALID_PASSWORD_ERROR
      });
    } else {
      valid = true;
    }
    return valid;
  };

  loginWithMobileNumber = async (mobileNumber, password) => {
    try {
      this.setState({ loaderVisible: true });
      const data = await firebase.database().ref(`/users/+91${mobileNumber}`).once('value');
      console.log(data.val().email);
      await this.loginWithEmail(data.val().email, password);
    } catch (error) {
      console.log(error);
      this.setState({ loaderVisible: false });
      Alert.alert('user not found');
    }
  }

  loginWithEmail = async (email, password) => {
    this.setState({ loaderVisible: true });
    const { navigation } = this.props;
    try {
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log(user);
      this.setState({ loaderVisible: false });
      navigation.navigate('Main', { currentUser: user });
    } catch (err) {
      this.setState({ loaderVisible: false });
      Alert.alert('invalid username or password. please try again...');
      console.log(err);
    }
  }

  handleLogin = async () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (this.checkUserNameAndPasswordFields()) {
      const { userName, password } = this.state;
      if (userName.match(emailRegex)) {
        await this.loginWithEmail(userName, password);
      } else {
        await this.loginWithMobileNumber(userName, password);
      }
    }
  }

  handleSignUp = () => {
    const { navigation } = this.props;
    navigation.navigate('SignUp');
  }

  handleResetPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('ResetPassword');
  }

  render() {
    const {
      passwordErrorMessage,
      userNameErrorMessage,
      loaderVisible,
    } = this.state;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Input
          placeholder="Email or Mobile Number"
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          containerStyle={{ margin: 10 }}
          onChangeText={value => this.setState({ userName: value, userNameErrorMessage: '' })
            }
        />
        {userNameErrorMessage.length !== 0 && (
        <Text style={styles.errorMessage}>
          {userNameErrorMessage}
        </Text>
        )}
        <Input
          placeholder="Password"
          containerStyle={{ margin: 10 }}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          secureTextEntry
          onChangeText={value => this.setState({ password: value, passwordErrorMessage: '' })
            }
        />
        {passwordErrorMessage.length !== 0 && (
        <Text style={styles.errorMessage}>
          {passwordErrorMessage}
        </Text>
        )}
        <Button
          title="Login"
          buttonStyle={styles.button}
          onPress={this.handleLogin}
        />
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <Text style={{ padding: 10 }}>New user?</Text>
          <Button title="Sign up" onPress={this.handleSignUp} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ padding: 10 }}>Forgot password?</Text>
          <Button title="Reset password" onPress={this.handleResetPassword} />
        </View>
        <Loader loaderVisible={loaderVisible} />
      </View>
    );
  }
}

export default LoginScreen;
