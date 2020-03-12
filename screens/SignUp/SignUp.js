// @flow
import React, { useState, useEffect } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, FONT_FAMILY, BLACK } from '../../styles/colors';
import { margin } from "../../styles/mixins";
import { regex } from '../../utils/index';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { CustomModal, InputComponent } from '../../components/molecules';
import { CustomDatePicker, ErrorMessage, Selector, Button, Link, PasswordIcon } from '../../components/atoms';
import { padding } from "../../styles/mixins";
import { FONT_WEIGHT_REGULAR } from "../../styles/typography"
import { Auth } from "aws-amplify";

const { ERRORS } = SIGN_UP_SCREEN;
const {
  EMPTY_NAME_ERROR,EMPTY_EMAIL_ERROR, 
  INVALID_EMAIL_ERROR, 
  EMPTY_MOBILE_NUMBER_ERROR, 
  INVALID_MOBILE_NUMBER_ERROR,
  EMPTY_PASSWORD_ERROR,
  INVALID_PASSWORD_ERROR,
  PASSWORD_MISMATCH_ERROR
} = ERRORS;

const AGE_LIMIT = 15;

const CREATE_USER = gql`
mutation CreateUser($uid:String!) {
    createUser(uid:$uid){
      uid
    }
  }
`;

const GENDER_OPTIONS = [
  {label:"Male", value: "male"}, 
  {label:"Female", value:"female"}
];

function SignUpScreen({navigation}: { navigation: Object }) {
  const [username, setUsername] = useState('');
  const [userNameErr, setUserNameErr] = useState('');

  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberErr, setMobileNumberErr] = useState('');

  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');

  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErr, setConfirmPasswordErr] = useState('');
  
  const [dob, setDob] = useState('');

  const [gender, setGender] = useState(GENDER_OPTIONS[0].value);

  const [termsAndConditionChecked, settermsAndConditionChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [err, setErr] = useState('');

  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleTermsAndConditions = () => {
    navigation.navigate('TermsAndConditions');
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  }

  const isValid = () => {
    let valid = false;
    
    if(username.length === 0) {
      setUserNameErr('Username cannot be empty');
    } else if (name.length === 0) {
      setNameErr(EMPTY_NAME_ERROR);
    } else if (email.length === 0) {
      setEmailErr(EMPTY_EMAIL_ERROR );
    } else if (!email.match(regex.email)) {
      setEmailErr(INVALID_EMAIL_ERROR )
    } else if (mobileNumber.length === 0) {
      setMobileNumberErr(EMPTY_MOBILE_NUMBER_ERROR)
    } else if (!mobileNumber.match(regex.phoneNo)) {
      setMobileNumberErr(INVALID_MOBILE_NUMBER_ERROR);
    } else if (password.length === 0) {
      setPasswordErr(EMPTY_PASSWORD_ERROR);
    } else if (password.length < 6) {
      setPasswordErr(INVALID_PASSWORD_ERROR );
    } else if (password !== confirmPassword) {
      setConfirmPasswordErr(PASSWORD_MISMATCH_ERROR);
    } else if(dob.length === 0) {
      Alert.alert("Date of birth can't be empty");
    } else if(getAge(dob) < AGE_LIMIT) {
      Alert.alert("You should me more than "+ AGE_LIMIT + " years");
    } else if(!termsAndConditionChecked) {
      Alert.alert("Please accept terms and conditions");
    } else {
      valid = true;
    }
    return valid;
  };

  const verify = async (otp) => {
    return await Auth.confirmSignUp(username, otp, { forceAliasCreation: true });
  }

  const redirectTo = (otp) => {
    navigation.navigate('Login');
  }

  const resend = async () => {
    return await Auth.resendSignUp(username)
  }

  const handleSignUp = async () => {
    const age = dob ? getAge(dob.value) : 0
    if(isValid())
      try {
        setIsLoading(true);
        const data = await Auth.signUp({
          username,
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
        setErr('');
        const { userSub } = data;
        createUser({ variables: { uid : userSub } })
        navigation.navigate('Verification', { verify, redirectTo, resend, message: `Enter OTP sent to xxxxxxxx${mobileNumber.substr(8)}` });
      } catch (error) {
        setErr(error.message);
      } finally {
        setIsLoading(false);
    }
  };

  const getUserNameErrMsg = (username:string) => {
    return username.length ? "Username can't be empty" : "";
  }

  const DateOfBirthInput = () => (
    <View style={formStyles.dobContainer}>
      <CustomDatePicker date={dob} updateParentState={setDob} label="Date of Birth" />
    </View>
  );

  const GenderSelector = () => (
    <View>
      <Selector options={GENDER_OPTIONS} label="Gender" onValueChange={setGender} />
    </View>
  );

  const TermsAndConditionsCheckBox = () => (
    <View style={formStyles.termsAndConditionsContainer}>
      <CheckBox
          checked={termsAndConditionChecked}
          onPress={() => settermsAndConditionChecked(!termsAndConditionChecked)}
          checkedColor={ORANGE}
          containerStyle={{padding: 0 , margin: 0}}
          center={true}
          uncheckedColor={BLACK}
        />
      <Text style={{color: BLACK}}>Click to accept </Text>
      <Link onPress={handleTermsAndConditions}>Terms of Service, Privacy, Policy</Link>
    </View>
  );

  const SignUpButton = () => (
    <View>
      <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSignUp}>Register</Button>
    </View>
  );

  const LoginLink = () => (
    <View style={formStyles.loginContainer}>
      <Text style={{color: BLACK}}>Already have an account? </Text>
      <Link onPress={handleLogin}>Log in</Link>
    </View>
  )

  if(isLoading) return <CustomModal desc="Please wait..."/>

  if(err.length !== 0) return <CustomModal variant="error" desc={err} onClose={() => setErr('')}/>

  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View>
        <View style={{...margin(20, 30, 10, 30)}}>
          <InputComponent label="Username" updateParentState={setUsername} errMsg={userNameErr} />
          <InputComponent label="Name" updateParentState={setName} errMsg={nameErr} />
          <InputComponent label="Email" updateParentState={setEmail} errMsg={emailErr} />
          <InputComponent label="Mobile Number" updateParentState={setMobileNumber} errMsg={mobileNumberErr} />
          <InputComponent label="Password"  updateParentState={setPassword} errMsg={passwordErr} showPasswordIcon={true} />
          <InputComponent label="Confirm Password" updateParentState={setConfirmPassword} errMsg={confirmPasswordErr} showPasswordIcon={true} />
          <DateOfBirthInput />
          <GenderSelector />
        </View>  
        <TermsAndConditionsCheckBox />
        <View style={{...margin(20, 30, 10, 30)}}>
          <SignUpButton />
          <LoginLink />
        </View>
      </View>
    </ScrollView>
  );
}

export default SignUpScreen;

const formStyles = StyleSheet.create({
  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...margin(10,0,0,0),
    flex: 1
  },
  loginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10
  },
  termsAndConditionsContainer: {
    flexDirection: 'row' , 
    alignItems: 'center', 
    backgroundColor: "#DBD5D5", 
    ...padding(10,5,10,5)
  }
});