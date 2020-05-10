// @flow
import React, { useState } from 'react';
import { Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import { SCREEN_DETAILS} from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK, LIGHT_GRAY } from '../../styles/colors';
import { margin } from "../../styles/mixins";
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { InputComponent, OTPVerificationToast } from '../../components/molecules';
import { CustomDatePicker, Selector, Button, Link } from '../../components/atoms';
import { Auth } from "aws-amplify";
import Toast, { toastTypes } from '../../components/atoms/Toast';
import { userNameConstraints, emailConstraints, mobileNoConstraints, passwordConstraints } from '../../utils/formConstraints';
import { useForm } from '../../customHooks';

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

const USER_NAME = 'username'
const EMAIL = 'email'
const MOBILE_NUMBER = 'mobileNumber'
const PASSWORD = 'password'
const CONFIRM_PASSOWRD = 'confirmPassword'

function SignUpScreen({navigation}: { navigation: Object }) {
  const { values, errors, bindField, isValid } = useForm({
    [USER_NAME]: { constraints: userNameConstraints },
    [EMAIL]: { constraints: emailConstraints },
    [MOBILE_NUMBER]: { constraints: mobileNoConstraints },
    [PASSWORD]: { constraints: passwordConstraints },
    [CONFIRM_PASSOWRD]: { constraints: [
      ...passwordConstraints, { 
        fun: (value) => values[PASSWORD] === value,
        message: "password mismatch" 
      }
    ]}
  }); 
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
      console.log(otp)
      await Auth.confirmSignUp(values[USER_NAME], otp, { forceAliasCreation: true });
      await Auth.signIn({ username: `+91${values[MOBILE_NUMBER]}`, password: values[PASSWORD]})
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
      await Auth.resendSignUp(values[USER_NAME])
      setToast({ type: toastTypes.SUCCESS, message: "OTP has be resent"})
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: "something wend wrong"})
    }
  }

  const handleSignUp = async () => {  
    const age = getAge(dob);
    if(isValid() && getAge(dob) > AGE_LIMIT && termsAndConditionChecked) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait"})
        const data = await Auth.signUp({
          username: values[USER_NAME],
          password: values[PASSWORD], 
          attributes: { 
              email: values[EMAIL], 
              name: values[USER_NAME],
              phone_number:`+91${values[MOBILE_NUMBER]}`,
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
    <ScrollView style={{ backgroundColor: WHITE }} contentContainerStyle={{flexGrow: 1 }}>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
      <OTPVerificationToast 
        show={showOtpInput}
        setOtp={setOtp} 
        verify={verify}
        resend={resend}
        recepient={values[MOBILE_NUMBER]}
        onClose={() => setShowOtpInput(!showOtpInput)}
      />
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          <InputComponent 
            label="Username" 
            {...bindField(USER_NAME)}
            errorMessage={errors[USER_NAME]}
          />
        </View>
        <View>
          <InputComponent 
            label="Email" 
            {...bindField(EMAIL)}
            errorMessage={errors[EMAIL]}
          />
        </View>
        <View>  
          <InputComponent 
            label="Mobile number" 
            {...bindField(MOBILE_NUMBER)}  
            errorMessage={errors[MOBILE_NUMBER]}
          />
        </View>
        <View>
          <InputComponent 
            label="Password" 
            showPasswordIcon={true}
            {...bindField(PASSWORD)}
            errorMessage={errors[PASSWORD]}
          />
        </View>
        <View>
          <InputComponent 
            label="Confirm Password" 
            showPasswordIcon={true} 
            {...bindField(CONFIRM_PASSOWRD)}
            errorMessage={errors[CONFIRM_PASSOWRD]}
          />
        </View>
        <DateOfBirthInput />
        <GenderSelector />
      </View>  
      <TermsAndConditionsCheckBox />
      <View style={{ margin: 20 }}>
        <SignUpButton />
        <LoginLink />
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
  },
  termsAndConditionsContainer: {
    flexDirection: 'row' , 
    alignItems: 'center', 
    backgroundColor: LIGHT_GRAY, 
  }
});