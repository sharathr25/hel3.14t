
import React, { useState } from 'react';
import { StyleProvider, Container, Content, Button ,Text, CheckBox, View } from 'native-base'
import { StyleSheet } from 'react-native';
import { SCREEN_DETAILS} from '../../constants/appConstants';
import { ORANGE, BLACK } from '../../styles/colors';
import { getAge } from '../../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { Input, OTPVerificationToast } from '../../components/molecules';
import { CustomDatePicker, Selector, Link } from '../../components/atoms';
import { Auth } from "aws-amplify";
import Toast, { toastTypes } from '../../components/atoms/Toast';
import { userNameConstraints, emailConstraints, mobileNoConstraints, passwordConstraints } from '../../utils/formConstraints';
import { useForm } from '../../customHooks';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

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

function SignUpScreen({navigation}) {
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
    } else if(!termsAndConditionChecked){
        setToast({ type: toastTypes.ERROR, message: "Please check Terms of Service, Privacy, Policy" })
    }
  };

  const TermsAndConditionsCheckBox = () => (
    <View style={formStyles.termsAndConditionsContainer}>
      <CheckBox 
        checked={termsAndConditionChecked}
        onPress={() => settermsAndConditionChecked(!termsAndConditionChecked)}    
      />
      <View style={{ flex: 1 , marginLeft: 20 }}>
        <Text style={{color: BLACK}}>Click to accept </Text>
        <Link onPress={handleTermsAndConditions}>Terms of Service, Privacy, Policy</Link>
      </View>
    </View>
  );

  const LoginLink = () => (
    <View style={formStyles.loginContainer}>
      <Text style={{color: BLACK}}>Already have an account? </Text>
      <Link onPress={handleLogin}>Log in</Link>
    </View>
  )

  return (
    <StyleProvider style={getTheme(material)}>
      <Container>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
      <OTPVerificationToast 
        show={showOtpInput}
        setOtp={setOtp} 
        verify={verify}
        resend={resend}
        recepient={values[MOBILE_NUMBER]}
        onClose={() => setShowOtpInput(!showOtpInput)}
      />
        <Content style={{ marginHorizontal: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{flex: 1}}>
            <Input 
              label="Username" 
              {...bindField(USER_NAME)}
              errMsg={errors[USER_NAME]}
            />
            </View>
          <View style={{flex: 1}}>
            <Input 
              label="Email" 
              {...bindField(EMAIL)}
              errMsg={errors[EMAIL]}
            />
          </View>
          <View style={{flex: 1}}>  
            <Input 
              label="Mobile number" 
              {...bindField(MOBILE_NUMBER)}  
              errMsg={errors[MOBILE_NUMBER]}
            />
          </View>
          <View style={{flex: 1}}>
            <Input 
              label="Password" 
              showPasswordIcon={true}
              {...bindField(PASSWORD)}
              errMsg={errors[PASSWORD]}
            />
          </View>
          <View style={{flex: 1}}>
            <Input 
              label="Confirm Password" 
              showPasswordIcon={true} 
              {...bindField(CONFIRM_PASSOWRD)}
              errMsg={errors[CONFIRM_PASSOWRD]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CustomDatePicker 
              date={dob} 
              updateParentState={setDob} 
              label="Date of Birth" 
              errMsg={dob && getAge(dob) <= AGE_LIMIT ? "You should be more than 15" : ""}
            />
          </View>
          <View style={{flex: 1}}>
            <Selector options={GENDER_OPTIONS} label="Gender" onValueChange={setGender} />
          </View>
          <TermsAndConditionsCheckBox />
          <View style={{ flex: 1 }}>
            <Button primary full large onPress={handleSignUp}>
              <Text>Register</Text>
            </Button>
          </View>
          <LoginLink />
        </Content>
      </Container>
    </StyleProvider>
  );
}

export default SignUpScreen;

const formStyles = StyleSheet.create({
  loginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10
  },
  termsAndConditionsContainer: {
    flex: 1, 
    height: 55, 
    alignItems: 'center', 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: ORANGE, 
    borderRadius: 5, 
    marginVertical: 20
  }
});