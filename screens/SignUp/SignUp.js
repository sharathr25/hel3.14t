// @flow
import React, { useState } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, FONT_FAMILY, BLACK } from '../../styles/colors';
import { regex } from '../../utils/index';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { CustomModal } from '../../components/molecules';
import { CustomDatePicker, InputComponent, ErrorMessage } from '../../components/atoms';
import { padding } from "../../styles/mixins";
import { Auth } from "aws-amplify";

const CREATE_USER = gql`
mutation CreateUser($uid:String!) {
  createUser(uid:$uid){
    uid
  }
}
`;

function SignUpScreen(props: { navigation: Object }) {
  const [state, setState] = useState({
    username: '',
    usernameErrorMessage: '',
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

  const handleTermsAndConditions = () => {
    const { navigation } = props;
    navigation.navigate('TermsAndConditions', { currentUser: firebase.auth().currentUser });
  }

  const checkFields = () => {
    let valid = false;
    const { username, name, email, mobileNumber, password, confirmPassword } = state;
    if(username.length === 0) {
      setState({...state, usernameErrorMessage: 'Username cannot be empty'});
    } else if (name.length === 0) {
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

  const handleSignUp = async () => {
    console.log("handle sign up clicked");
    const { navigation } = props;
    const { username, termsAndConditionChecked, mobileNumber, dob, name, email, password, gender, } = state;
    const age = getAge(dob);
    let error = "";
    if (!termsAndConditionChecked) error = "To Sign Up You have to accept Terms and Conditions";
    if (!checkFields()) return;
    if (age < 15) error = "You should be more than 15 years old to sign up";
    if (error) Alert.alert(error);
    else {
      console.log(state);
      try {
        setState({ ...state, loaderVisible: true });
        const data = await Auth.signUp({
          username: username, 
          password, 
          attributes: { 
              email, 
              phone_number:`+91${mobileNumber}`,
              name,
              birthdate: dob,
              gender
            }
          }
        );
        console.log(data);
        setState({ ...state, loaderVisible: false });
        navigation.navigate('Verification', { username, email, mobileNumber });
      } catch (error) {
        setState({ ...state, loaderVisible: false });
        console.log(error);
        Alert.alert(error.toString());
      }
    }
  };

  const handleCheckBox = (val) => {
    setState({ ...state, gender: val });
  }

  const getCheckBoxStyle = (val) => [formStyles.defaultCheckBoxStyle, state.gender === val ? formStyles.activeCheckBox : formStyles.inActiveCheckBox];

  const getCheckBoxTextStyle = (val) => state.gender === val ? formStyles.activeText : formStyles.inActiveText;

  const {
    usernameErrorMessage,
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
      <View>
      <InputComponent
          label="Username"
          updateParentState={value => setState({ ...state, username: value, usernameErrorMessage: '' })}
        />
        {usernameErrorMessage.length !== 0 && <ErrorMessage message={usernameErrorMessage} />}

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
        <View style={{ flexDirection: 'row' , alignItems: 'center', backgroundColor: "#DBD5D5", ...padding(5,5,5,5) }}>
        <CheckBox
            checked={termsAndConditionChecked}
            onPress={() => setState({ ...state, termsAndConditionChecked: !termsAndConditionChecked })}
            checkedColor={ORANGE}
            containerStyle={{padding: 0 , margin: 0}}
            center={true}
            uncheckedColor={BLACK}
          />
          <Text color={BLACK}>Click to accept </Text>
          <TouchableOpacity onPress={handleTermsAndConditions}>
            <Text style={{ color: '#3a8bbb' }}>Terms of Service, Privacy, Policy</Text>
          </TouchableOpacity>
        </View>
        
        {/* Sign Up button */}
        {!loaderVisible && <TouchableOpacity onPress={handleSignUp} style={formStyles.signUpContainerStyle}>
          <Text style={formStyles.signUpText}>Sign Up</Text>
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
          <Text style={formStyles.linkText}>Login</Text>
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
  signUpContainerStyle: {
    margin: 30,
    padding: 10,
    backgroundColor: ORANGE,
    borderRadius: 10
  },
  signUpText: {
    textAlign: 'center',
    color: WHITE,
    fontSize: 20
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