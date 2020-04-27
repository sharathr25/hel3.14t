// @flow
import React, { useState } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modal"
import { SIGN_UP_SCREEN , SCREEN_DETAILS} from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { margin } from "../../styles/mixins";
import { regex } from '../../utils/index';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { CustomModal, InputComponent, OTPVerificationModal } from '../../components/molecules';
import { CustomDatePicker, Selector, Button, Link, Heading } from '../../components/atoms';
import { padding } from "../../styles/mixins";
import { Auth } from "aws-amplify";

const { LOGIN, TERMS_AND_CONDITIONS, MAIN } = SCREEN_DETAILS;
const { ERRORS } = SIGN_UP_SCREEN;

const {
  EMPTY_EMAIL_ERROR, 
  INVALID_EMAIL_ERROR, 
  EMPTY_MOBILE_NUMBER_ERROR, 
  INVALID_MOBILE_NUMBER_ERROR,
  EMPTY_PASSWORD_ERROR,
  INVALID_PASSWORD_ERROR,
  PASSWORD_MISMATCH_ERROR
} = ERRORS;

const AGE_LIMIT = 15;

const CREATE_USER = gql`
mutation CreateUser($uid:String!, $username:String!) {
    createUser(uid:$uid, username:$username) {
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

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showChangeMobile, setShowChangeMobile] = useState(false);

  const [otp, setOtp] = useState("");

  const [createUser, { loading, data, error }] = useMutation(CREATE_USER);

  const handleTermsAndConditions = () => {
    navigation.navigate(TERMS_AND_CONDITIONS.screenName);
  }

  const handleLogin = () => {
    navigation.navigate(LOGIN.screenName);
  }

  const isValid = () => {
    let valid = false;
    
    if(username.length === 0) {
      setUserNameErr('Username cannot be empty');
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

  const verify = async () => {
    try{
      await Auth.confirmSignUp(username, otp, { forceAliasCreation: true });
      setShowOtpInput(false);
      navigation.navigate(MAIN.screenName);
    } catch(error) {
      console.log(error)
    }
  }

  const resend = async () => {
    return await Auth.resendSignUp(username)
  }

  const handleSignUp = async () => {  
    if(isValid())
      try {
        setIsLoading(true);
        const data = await Auth.signUp({
          username,
          password, 
          attributes: { 
              email, 
              name: username,
              phone_number:`+91${mobileNumber}`,
              birthdate: dob,
              gender
            }
          }
        );
        setErr('');
        const { userSub, user } = data;
        const { username : userName } = user;
        createUser({ variables: { uid : userSub, username: userName } });
        setShowOtpInput(true);
      } catch (error) {
        setErr(error.message);
      } finally {
        setIsLoading(false);
    }
  };

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
          <InputComponent label="Email" updateParentState={setEmail} errMsg={emailErr} />
          <InputComponent label="Mobile number" updateParentState={setMobileNumber} errMsg={mobileNumberErr} />
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
        <OTPVerificationModal 
          show={showOtpInput}
          setOtp={setOtp} 
          verify={verify}
          resend={resend}
          setOtp={setOtp}
          recepient={mobileNumber}
          onClose={() => setShowOtpInput(!showOtpInput)}
        />
      </View>
    </ScrollView>
  );
}

export default SignUpScreen;

const formStyles = StyleSheet.create({
  dobContainer: {
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