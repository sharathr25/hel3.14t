import React, { Component } from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, SCREEN_TITLES } from '../constants/appConstants';
import { styles, FLAG_COLOR_ORANGE } from '../constants/styleConstants';

class ResetPassowrdScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.RESET_PASSOWRD,
  };

  constructor() {
    super();
    this.state = {
      mobileNumber: '',
      mobileNumberErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      confirmPassword: '',
      confirmPasswordErrorMessage: '',
      loaderVisible: false,
    };
  }

  checkMobileNumberField = () => {
    let valid = false;
    const { mobileNumber, password, confirmPassword } = this.state;
    const phoneno = /^\d{10}$/;
    if (mobileNumber.length === 0) {
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
    } else valid = true;
    return valid;
  }

  handleLogin = async () => {
    if (this.checkMobileNumberField()) {
      const { mobileNumber, password } = this.state;
      try {
        this.setState({ loaderVisible: true });
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
        const { currentUser } = firebase.auth();
        const { navigation } = this.props;
        if (currentUser) {
          console.log(currentUser);
          this.setState({ loaderVisible: false });
          await currentUser.updatePassword(password);
          Alert.alert('Password updated succesfully');
          navigation.navigate('Main', {
            currentUser: firebase.auth().currentUser
          });
        } else {
          console.log('navigating to OTP screen ...');
          this.setState({ loaderVisible: false });
          navigation.navigate('OTP', {
            userDetails: {
              mobileNumber,
              password
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const {
      mobileNumberErrorMessage,
      passwordErrorMessage,
      confirmPasswordErrorMessage,
      loaderVisible,
    } = this.state;
    return (
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Input
            placeholder="Mobile Number"
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            containerStyle={{ margin: 10 }}
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
          <Input
            placeholder="Confirm Password"
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
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
            title="Update Password"
            buttonStyle={{ backgroundColor: FLAG_COLOR_ORANGE }}
            onPress={this.handleLogin}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ResetPassowrdScreen;
