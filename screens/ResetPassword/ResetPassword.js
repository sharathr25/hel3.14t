import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK } from '../../constants/styleConstants';
import { InputComponent, ErrorMessage } from '../../components/atoms';
import { regex } from '../../utils/index';
import { getUser } from '../../fireBase/database';
import { CustomModal } from '../../components/molecules';

const ResetPassowrdScreen = (props) => {
  const [state, setState] = useState({
    mobileNumber: '',
    mobileNumberErrorMessage: '',
    password: '',
    passwordErrorMessage: '',
    confirmPassword: '',
    confirmPasswordErrorMessage: '',
    loaderVisible: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [{ loading, success, error }, setStatus] = useState({ loading: false, success: false, error: false });

  const {
    mobileNumberErrorMessage,
    passwordErrorMessage,
    confirmPasswordErrorMessage,
    loaderVisible,
  } = state;

  checkMobileNumberField = () => {
    let valid = false;
    const { mobileNumber, password, confirmPassword } = state;
    if (mobileNumber.length === 0) {
      setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR });
    } else if (!mobileNumber.match(regex.phoneNo)) {
      setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR });
    } else if (password.length === 0) {
      setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR });
    } else if (password.length < 6) {
      setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR });
    } else if (password !== confirmPassword) {
      setState({ confirmPasswordErrorMessage: SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR });
    } else valid = true;
    return valid;
  }

  handleLogin = async () => {
    if (checkMobileNumberField()) {
      const { mobileNumber, password } = state;
      try {
        setShowModal(!showModal);
        setStatus({ loading: true, success: false, error: false })
        const user = await getUser(mobileNumber);
        if (user.val() === null) {
          setState({ loaderVisible: false });
          Alert.alert("User not found");
        }
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
        const { currentUser } = firebase.auth();
        const { navigation } = props;
        if (currentUser) {
          setState({ ...state, loaderVisible: false });
          await currentUser.updatePassword(password);
          firebase.auth().signOut();
          setStatus({ loading: false, success: true, error: false })
          navigation.navigate('Login', {
            currentUser: firebase.auth().currentUser
          });
        }
      } catch (error) {
        setStatus({ loading: false, success: false, error: true })
        console.log(error);
      }
    }
  }

  if (showModal) {
    if (loading) {
      return <CustomModal variant="loading" />
    } else if (success) {
      return <CustomModal variant="success" onClose={() => setShowModal(!showModal)} />
    } else if (error) {
      return <CustomModal variant="error" onClose={() => setShowModal(!showModal)} />
    }
  }

  return (
    <ScrollView style={{ backgroundColor: WHITE, }}>
      <View style={{ flex: 1, margin: 10 }}>
        <Text style={styles.appTitle}>{APP_TITLE}</Text>
        <Text style={styles.screenTitle}>Reset Password</Text>
        <InputComponent
          label="Mobile Number"
          secureTextEntry={false}
          updateParentState={value => setState({ ...state, mobileNumber: value, mobileNumberErrorMessage: '' })}
        />
        {mobileNumberErrorMessage.length !== 0 && <ErrorMessage message={mobileNumberErrorMessage} />}
        <InputComponent
          label="Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state, password: value, passwordErrorMessage: '' })}
        />
        {passwordErrorMessage.length !== 0 && <ErrorMessage message={passwordErrorMessage} />}
        <InputComponent
          label="Confirm Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state, confirmPassword: value, confirmPasswordErrorMessage: '' })}
        />
        {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage message={confirmPasswordErrorMessage} />}
        {!loaderVisible && <TouchableOpacity onPress={handleLogin} style={styles.signInContainerStyle}>
          <Text style={styles.signInText}>Reset Password</Text>
        </TouchableOpacity>}
        {loaderVisible && <CustomModal variant="loading" desc="Please wait, We will auto verify OTP and update password" />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    marginBottom: 30,
    color: ORANGE,
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
    backgroundColor: ORANGE,
    borderRadius: 25
  },
  signInText: {
    textAlign: 'center',
    color: WHITE,
    fontSize: 18
  },
});

export default ResetPassowrdScreen;
