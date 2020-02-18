import React, { useState } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, FONT_FAMILY, BLACK } from '../../constants/styleConstants';
import { updateUser } from '../../fireBase/auth/signUp';
import { addUserDetailsToDb } from '../../fireBase/database';
import { regex } from '../../utils/index';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import CustomModal from '../../components/molecules';
import { CustomDatePicker, InputComponent, ErrorMessage } from '../../components/atoms';

const CREATE_USER = gql`
mutation CreateUser($uid:String!) {
  createUser(uid:$uid){
    uid
  }
}
`;

function SignUpScreen(props) {
  const [state, setState] = useState({
    name: '',
    nameErrorMessage: '',
    mobileNumber: '',
    mobileNumberErrorMessage: '',
    email: '',
    emailErrorMessage: '',
    password: '',
    passwordErrorMessage: '',
    confirmPassword: '',
    confirmPasswordErrorMessage: '',
    loaderVisible: false,
    termsAndConditionChecked: false,
    gender: 'male',
    dob: '2016-05-15'
  });
  const [createUser, { loading }] = useMutation(CREATE_USER);

  handleTermsAndConditions = () => {
    const { navigation } = props;
    navigation.navigate('TermsAndConditions', { currentUser: firebase.auth().currentUser });
  }

  checkFields = () => {
    let valid = false;
    const { name, email, mobileNumber, password, confirmPassword } = state;
    if (name.length === 0) {
      setState({ ...state, nameErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_NAME_ERROR });
    } else if (email.length === 0) {
      setState({ ...state, emailErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_EMAIL_ERROR });
    } else if (!email.match(regex.email)) {
      setState({ ...state, emailErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_EMAIL_ERROR });
    } else if (mobileNumber.length === 0) {
      setState({ ...state, mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR });
    } else if (!mobileNumber.match(regex.phoneNo)) {
      setState({ ...state, mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR });
    } else if (password.length === 0) {
      setState({ ...state, passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR });
    } else if (password.length < 6) {
      setState({ ...state, passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR });
    } else if (password !== confirmPassword) {
      setState({ ...state, confirmPasswordErrorMessage: SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR });
    } else {
      valid = true;
    }
    return valid;
  };

  handleSignUp = async () => {
    const { termsAndConditionChecked, mobileNumber, dob, name, email, password, gender, } = state;
    const age = getAge(dob);
    let error = "";
    if (!termsAndConditionChecked) error = "To Sign Up You have to accept Terms and Conditions";
    if (!checkFields()) return;
    if (age < 15) error = "You should be more than 15 years old to sign up";
    if (error) Alert.alert(error);
    else {
      try {
        setState({ ...state, loaderVisible: true });
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            const { currentUser } = await firebase.auth();
            const { navigation } = props;
            try {
              await updateUser(currentUser, email, password, name);
              await addUserDetailsToDb(mobileNumber, email, name, gender, dob);
              createUser({ variables: { uid: currentUser.uid } });
            } catch (error) {
              console.log(error);
            } finally {
              unsubscribe();
            }
            setState({ ...state, loaderVisible: false });
            navigation.navigate('Main', { currentUser: currentUser });
          }
        });
      } catch (error) {
        setState({ ...state, loaderVisible: false });
        console.log(error);
        Alert.alert(error.toString());
      }
    }
  };

  handleCheckBox = (val) => {
    setState({ ...state, gender: val });
  }

  getCheckBoxStyle = (val) => [formStyles.defaultCheckBoxStyle, state.gender === val ? formStyles.activeCheckBox : formStyles.inActiveCheckBox];

  getCheckBoxTextStyle = (val) => state.gender === val ? formStyles.activeText : formStyles.inActiveText;

  const {
    nameErrorMessage,
    passwordErrorMessage,
    confirmPasswordErrorMessage,
    emailErrorMessage,
    mobileNumberErrorMessage,
    loaderVisible,
    termsAndConditionChecked
  } = state;

  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View style={{ margin: 10 }}>
        <Text style={formStyles.appTitle}>{APP_TITLE}</Text>
        <Text style={formStyles.screenTitle}>Register</Text>
        {/* Name */}
        <InputComponent
          label="Name"
          updateParentState={value => setState({ ...state, name: value, nameErrorMessage: '' })}
        />
        {nameErrorMessage.length !== 0 && <ErrorMessage message={nameErrorMessage} />}

        {/* Email */}
        <InputComponent
          label="Email"
          updateParentState={value => setState({ ...state, email: value, emailErrorMessage: '' })}
        />
        {emailErrorMessage.length !== 0 && <ErrorMessage message={emailErrorMessage} />}

        {/* Mobile number */}
        <InputComponent
          label="Mobile Number"
          updateParentState={value => setState({ ...state, mobileNumber: value, mobileNumberErrorMessage: '' })}
        />
        {mobileNumberErrorMessage.length !== 0 && <ErrorMessage message={mobileNumberErrorMessage} />}

        {/* password */}
        <InputComponent
          label="Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state, password: value, passwordErrorMessage: '' })}
        />
        {passwordErrorMessage.length !== 0 && <ErrorMessage message={passwordErrorMessage} />}

        {/* Confirm password */}
        <InputComponent
          label="Confirm Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state, confirmPassword: value, confirmPasswordErrorMessage: '' })}
        />
        {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage message={confirmPasswordErrorMessage} />}

        {/* Date of Birth */}
        <View style={formStyles.dobContainer}>
          <Text style={formStyles.dobLabel}>Date of Birth</Text>
          <CustomDatePicker date={state.dob} updateParentState={date => setState({ ...state, dob: date })} />
        </View>

        {/* Gender */}
        <View style={formStyles.genderSelector}>
          <Text style={{
            fontSize: 16,
            opacity: 0.8,
            fontWeight: 'bold',
            paddingRight: 10
          }} >Gender</Text>
          <TouchableOpacity onPress={() => handleCheckBox("male")} style={getCheckBoxStyle("male")}>
            <Text style={getCheckBoxTextStyle("male")}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCheckBox("female")} style={getCheckBoxStyle("female")}>
            <Text style={getCheckBoxTextStyle("female")}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <CheckBox
          title={<View style={{ marign: 5 }}>
            <Text>Creating an acount means you're akay with our </Text>
            <TouchableOpacity onPress={handleTermsAndConditions}>
              <Text style={{ color: '#3a8bbb' }}>Terms of Service, Privacy, Policy</Text>
            </TouchableOpacity>
          </View>}
          checked={termsAndConditionChecked}
          onPress={() => setState({ ...state, termsAndConditionChecked: !termsAndConditionChecked })}
          checkedColor={ORANGE}
        />
        {/* Sign Up button */}
        {!loaderVisible && <TouchableOpacity onPress={handleSignUp} style={formStyles.signInContainerStyle}>
          <Text style={formStyles.signInText}>Sign Up</Text>
        </TouchableOpacity>}
        {loaderVisible && <CustomModal><View style={{ margin: 20, alignItems: 'center' }}>
          <ActivityIndicator color={ORANGE} size={20} />
          <Text style={{ color: 'black' }}>Please wait...</Text>
          <Text style={{ color: 'black' }}>We will auto verify OTP and log you in</Text>
        </View></CustomModal>}
      </View>
      <View style={formStyles.loginContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={formStyles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default SignUpScreen;

const formStyles = StyleSheet.create({
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
  genderSelector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  activeCheckBox: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  defaultCheckBoxStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    margin: 5,
    borderRadius: 5
  },
  inActiveCheckBox: {
    backgroundColor: WHITE,
    borderColor: ORANGE,
  },
  activeText: {
    color: WHITE,
    fontSize: 15,
    fontFamily: FONT_FAMILY
  },
  inActiveText: {
    color: ORANGE,
    fontSize: 15,
    fontFamily: FONT_FAMILY
  },
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  dobLabel: {
    fontSize: 16,
    opacity: 0.8,
    fontWeight: 'bold',
    paddingRight: 10
  },
  signInContainerStyle: {
    margin: 10,
    padding: 10,
    backgroundColor: ORANGE,
    borderRadius: 25
  },
  signInText: {
    textAlign: 'center',
    color: WHITE,
    fontSize: 18
  },
  linkText: {
    color: "#1DA1F2"
  },
  loginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10
  }
});