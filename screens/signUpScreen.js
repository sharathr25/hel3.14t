import React, { Component } from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN } from '../constants/appConstants';
import { styles } from '../constants/styleConstants';
import { updateUser } from '../common/fireBaseFunctions';

class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign Up'
  };

  constructor() {
    super();
    this.state = {
      name: '',
      nameErrorMessage: '',
      mobileNumber: '',
      mobileNumberErrorMessage: '',
      email: '',
      emailErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      confirmPassword: '',
      confirmPasswordErrorMessage: ''
    };
  }


  checkFields = () => {
    let valid = false;
    const phoneno = /^\d{10}$/;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const {
      name, email, mobileNumber, password, confirmPassword
    } = this.state;
    if (name.length === 0) {
      this.setState({
        nameErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_NAME_ERROR
      });
    } else if (email.length === 0) {
      this.setState({
        emailErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_EMAIL_ERROR
      });
    } else if (!email.match(emailRegex)) {
      this.setState({
        emailErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_EMAIL_ERROR
      });
    } else if (mobileNumber.length === 0) {
      this.setState({
        mobileNumberErrorMessage:
          SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR
      });
    } else if (!mobileNumber.match(phoneno)) {
      this.setState({
        mobileNumberErrorMessage:
          SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR
      });
    } else if (password.length === 0) {
      this.setState({
        passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR
      });
    } else if (password.length < 6) {
      this.setState({
        passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR
      });
    } else if (password !== confirmPassword) {
      this.setState({
        confirmPasswordErrorMessage:
          SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR
      });
    } else {
      valid = true;
    }
    return valid;
  };

  handleSignUp = async () => {
    if (this.checkFields()) {
      const user = firebase.auth().currentUser;
      if (user) firebase.auth().signOut();
      const {
        mobileNumber, name, email, password
      } = this.state;
      try {
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
        const { currentUser } = firebase.auth();
        const { navigation } = this.props;
        if (currentUser) {
          console.log(currentUser);
          await updateUser(currentUser, email, password, name);
          console.log('user updated');
          navigation.navigate('Main', {
            currentUser: firebase.auth().currentUser
          });
        } else {
          console.log('navigating to OTP screen ...');
          navigation.navigate('OTP', {
            userDetails: {
              mobileNumber, name, email, password
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const {
      nameErrorMessage,
      passwordErrorMessage,
      confirmPasswordErrorMessage,
      emailErrorMessage,
      mobileNumberErrorMessage
    } = this.state;
    return (
      <ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Input
            placeholder="Name"
            inputContainerStyle={styles.input}
            containerStyle={{ margin: 10 }}
            onChangeText={value => this.setState({ name: value, nameErrorMessage: '' })
            }
          />
          {nameErrorMessage.length !== 0 && (
            <Text style={styles.errorMessage}>
              {nameErrorMessage}
            </Text>
          )}
          <Input
            placeholder="Email"
            inputContainerStyle={styles.input}
            containerStyle={{ margin: 10 }}
            onChangeText={value => this.setState({ email: value, emailErrorMessage: '' })
            }
          />
          {emailErrorMessage.length !== 0 && (
            <Text style={styles.errorMessage}>
              {emailErrorMessage}
            </Text>
          )}
          <Input
            placeholder="Mobile Number"
            inputContainerStyle={styles.input}
            containerStyle={{ flex: 3 }}
            onChangeText={value => this.setState({
              mobileNumber: value,
              mobileNumberErrorMessage: ''
            })
            }
          />
          {mobileNumberErrorMessage.length !== 0 && (
            <Text style={styles.errorMessage}>
              {mobileNumberErrorMessage}
            </Text>
          )}
          <Input
            placeholder="Password"
            containerStyle={{ margin: 10 }}
            inputContainerStyle={styles.input}
            secureTextEntry
            onChangeText={value => this.setState({ password: value, passwordErrorMessage: '' })
            }
          />
          {passwordErrorMessage.length !== 0 && (
            <Text style={styles.errorMessage}>
              {passwordErrorMessage}
            </Text>
          )}
          <Input
            placeholder="Confirm Password"
            inputContainerStyle={styles.input}
            containerStyle={{ margin: 10 }}
            secureTextEntry
            onChangeText={value => this.setState({
              confirmPassword: value,
              confirmPasswordErrorMessage: ''
            })
            }
          />
          {confirmPasswordErrorMessage.length !== 0 && (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          )}
          <Button
            title="Sign Up"
            buttonStyle={styles.button}
            onPress={this.handleSignUp}
          />
        </View>
      </ScrollView>
    );
  }
}

export default SignUpScreen;
