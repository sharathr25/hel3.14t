// @flow
import React, { useState } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import { SCREEN_DETAILS} from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { margin } from "../../styles/mixins";
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { InputComponent, OTPVerificationToast } from '../../components/molecules';
import { CustomDatePicker, Selector, Button, Link } from '../../components/atoms';
import { padding } from "../../styles/mixins";
import { Auth } from "aws-amplify";
import Toast, { toastTypes } from '../../components/atoms/Toast';
import { userNameConstraints, emailConstraints, mobileNoConstraints, passwordConstraints } from '../../utils/formConstraints';

const { LOGIN, TERMS_AND_CONDITIONS, MAIN } = SCREEN_DETAILS;

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
  const [isUserNameValid, setIsUserNameValid] = useState(false)
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isConfirmpasswordValid, setIsConfirmpasswordValid] = useState(false)

  const [mobileNumber, setMobileNumber] = useState('');
  
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState(GENDER_OPTIONS[0].value);

  const [termsAndConditionChecked, settermsAndConditionChecked] = useState(false);

  const [showOtpInput, setShowOtpInput] = useState(false);

  const [otp, setOtp] = useState("");

  const [createUser, { loading, data, error }] = useMutation(CREATE_USER);

  const [toast, setToast] = useState({type:"", message:""})

  const handleTermsAndConditions = () => {
    navigation.navigate(TERMS_AND_CONDITIONS.screenName);
  }

  const handleLogin = () => {
    navigation.navigate(LOGIN.screenName);
  }

  const verify = async () => {
    try{
      setToast({ type:toastTypes.LOADING, message: "please wait"})
      await Auth.confirmSignUp(username, otp, { forceAliasCreation: true });
      await Auth.signIn({ username: `+91${mobileNumber}`, password})
      setToast({ type: toastTypes.SUCCESS, message: "Verification successfull"})
      setShowOtpInput(false);
      navigation.navigate(MAIN.screenName);
    } catch(error) {
      setToast({ type: toastTypes.ERROR, message: "verification failed"})
      console.log(error)
    }
  }

  const resend = async () => {
    try {
      setToast({ type: toastTypes.LOADING, message: "please wait"})
      await Auth.resendSignUp(username)
      setToast({ type: toastTypes.SUCCESS, message: "OTP has be resent"})
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: "something wend wrong"})
    }
  }

  const handleSignUp = async () => {  
    const age = getAge(dob);
    if(
      isUserNameValid 
      && isMobileNumberValid 
      && isEmailValid 
      && isPasswordValid 
      && isConfirmpasswordValid
      && getAge(dob) > AGE_LIMIT
      && termsAndConditionChecked
    ){
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait"})
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
        setToast({ type: toastTypes.SUCCESS, message: "OTP has been sent"})
        setShowOtpInput(true);
        const { userSub, user } = data;
        const { username : userName } = user;
        createUser({ variables: { uid : userSub, username: userName } });
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Something went wrong"})
      }
    } else {
      if(age <= AGE_LIMIT) Alert.alert("You should be more than 15")
      else if(!termsAndConditionChecked) Alert.alert("Please accept terms, conditions and privacy policy")
    }
  };

  const DateOfBirthInput = () => {
    return (
      <View style={formStyles.dobContainer}>
        <CustomDatePicker date={dob} updateParentState={setDob} label="Date of Birth" />
      </View>
    )
  };

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

  return (
    <View style={{flex: 1}}>
      <OTPVerificationToast 
        show={showOtpInput}
        setOtp={setOtp} 
        verify={verify}
        resend={resend}
        recepient={mobileNumber}
        onClose={() => setShowOtpInput(!showOtpInput)}
      />
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
      <ScrollView style={{ backgroundColor: WHITE }}>
      <View>
        <View style={{...margin(20, 30, 10, 30)}}>
          <InputComponent 
            label="Username" 
            updateParentState={setUsername} 
            constraints={userNameConstraints} 
            setIsValid={setIsUserNameValid}
          />
          <InputComponent 
            label="Email" 
            updateParentState={setEmail} 
            constraints={emailConstraints}
            setIsValid={setIsEmailValid}
          />
          <InputComponent 
            label="Mobile number" 
            updateParentState={setMobileNumber} 
            constraints={mobileNoConstraints} 
            setIsValid={setIsMobileNumberValid}  
          />
          <InputComponent 
            label="Password" 
            updateParentState={setPassword} 
            setIsValid={setIsPasswordValid} 
            showPasswordIcon={true}
            constraints={passwordConstraints} 
          />
          <InputComponent 
            label="Confirm Password" 
            updateParentState={setConfirmPassword} 
            showPasswordIcon={true} 
            setIsValid={setIsConfirmpasswordValid}
            constraints={[...passwordConstraints, { fun: () => password === confirmPassword, message: "password mismatch"}]}
          />
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
    </View>
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