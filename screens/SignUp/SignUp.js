// @flow
import React, { useState, useEffect } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, FONT_FAMILY, BLACK } from '../../styles/colors';
import { margin } from "../../styles/mixins";
import { regex } from '../../utils/index';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { CustomModal } from '../../components/molecules';
import { CustomDatePicker, InputComponent, ErrorMessage, Selector, Button, Link } from '../../components/atoms';
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

const genderOptions = [
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

  const [gender, setGender] = useState(genderOptions[0].value);

  const [termsAndConditionChecked, settermsAndConditionChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleTermsAndConditions = () => {
    navigation.navigate('TermsAndConditions');
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  }

  const checkFields = () => {
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

  const handleSignUp = async () => {
    const age = dob ? getAge(dob.value) : 0
    if(checkFields())
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
        console.log(data);
        navigation.navigate('Verification', { username, email, mobileNumber });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
    }
  };

  const getUserNameErrMsg = (username:string) => {
    return username.length ? "Username can't be empty" : "";
  }

  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View>
        {isLoading && <CustomModal desc="Please wait..."/>}

        {/* Username */}
        <InputComponent
          label="Username"
          updateParentState={setUsername}
          errMsg={userNameErr}
        />

        {/* Name */}
        <InputComponent
          label="Name"
          updateParentState={setName}
          errMsg={nameErr}
        />

        {/* Email */}
        <InputComponent
          label="Email"
          updateParentState={setEmail}
          errMsg={emailErr}
        />

        {/* Mobile number */}
        <InputComponent
          label="Mobile Number"
          updateParentState={setMobileNumber}
          errMsg={mobileNumberErr}
        />

        {/* password */}
        <InputComponent
          label="Password"
          secureTextEntry={true}
          updateParentState={setPassword}
          errMsg={passwordErr}
        />

        {/* Confirm password */}
        <InputComponent
          label="Confirm Password"
          secureTextEntry={true}
          updateParentState={setConfirmPassword}
          errMsg={confirmPasswordErr}
        />

        {/* Date of Birth */}
        <View style={formStyles.dobContainer}>
          <CustomDatePicker date={dob} updateParentState={setDob} label="Date of Birth" />
        </View>

        {/* Gender */}
        <Selector options={genderOptions} label="Gender" onValueChange={setGender} />
        
        {/* Terms and Conditions */}
        <View style={formStyles.termsAndConditionsContainer}>
          <CheckBox
              checked={termsAndConditionChecked}
              onPress={() => settermsAndConditionChecked(!termsAndConditionChecked)}
              checkedColor={ORANGE}
              containerStyle={{padding: 0 , margin: 0}}
              center={true}
              uncheckedColor={BLACK}
            />
          <Text color={BLACK}>Click to accept </Text>
          <Link onPress={handleTermsAndConditions}>Terms of Service, Privacy, Policy</Link>
        </View>
        
        <View style={{...margin(10,30,10,30)}}>
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleSignUp}>Sign Up</Button>
        </View>
      
        <View style={formStyles.loginContainer}>
          <Text>Already have an account? </Text>
          <Link onPress={handleLogin}>Login</Link>
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
    ...margin(20,10,10,10),
    flex: 1
  },
  loginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10
  },
  termsAndConditionsContainer: {
    flexDirection: 'row' , 
    alignItems: 'center', 
    backgroundColor: "#DBD5D5", 
    ...padding(5,5,5,5)
  }
});