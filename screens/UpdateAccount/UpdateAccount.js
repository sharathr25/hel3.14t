// @flow
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ORANGE, WHITE, LIGHTEST_GRAY } from '../../styles/colors';
import { Button, CustomDatePicker, Selector, Toast} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS, SIGN_UP_SCREEN } from "../../constants/appConstants";
import { InputComponent, OTPVerificationToast } from '../../components/molecules';
import { regex, getAge } from '../../utils';
import { padding } from '../../styles/mixins';
import { toastTypes } from '../../components/atoms/Toast';

const AGE_LIMIT = 15;
const GENDER_OPTIONS = [
    {label:"Male", value: "male"}, 
    {label:"Female", value:"female"}
];
const { ERRORS } = SIGN_UP_SCREEN;
const {
  EMPTY_EMAIL_ERROR, 
  INVALID_EMAIL_ERROR, 
  EMPTY_MOBILE_NUMBER_ERROR, 
  INVALID_MOBILE_NUMBER_ERROR,
} = ERRORS;
const { MY_ACCOUNT } = SCREEN_DETAILS;

const UpdateAccount = ({ navigation, route }:{ navigation : Object, route : Object}) => {
    const { params } = route;
    const { user } = params;
    const { attributes } = user;
    const { email, phone_number: phoneNumber, gender, birthdate } = attributes;
    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");

    const [ emailForUpdate, setEmail ] = useState(email);
    const [ phoneNumberForUpdate, setPhoneNumber ] = useState(phoneNumberWithoutCountryCode);
    const [ birthdateForUpdate, setBirthdate ] = useState(birthdate);
    const [ genderForUpdate, setGender ] = useState(gender);
    const [ emailErr, setEmailErr ] = useState('');
    const [ mobileNumberErr, setMobileNumberErr ] = useState('');
    const [ otp, setOtp] = useState('')
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [toast, setToast] = useState({ type: "", message: ""})

    const isValid = () => {
        let valid = false;
        
        if (email.length === 0) {
          setEmailErr(EMPTY_EMAIL_ERROR );
        } else if (!emailForUpdate.match(regex.email)) {
          setEmailErr(INVALID_EMAIL_ERROR )
        } else if (phoneNumberForUpdate.length === 0) {
          setMobileNumberErr(EMPTY_MOBILE_NUMBER_ERROR)
        } else if (!phoneNumberForUpdate.match(regex.phoneNo)) {
          setMobileNumberErr(INVALID_MOBILE_NUMBER_ERROR);
        } else if(birthdateForUpdate.length === 0) {
          Alert.alert("Date of birth can't be empty");
        } else if(getAge(birthdateForUpdate) < AGE_LIMIT) {
          Alert.alert("You should me more than "+ AGE_LIMIT + " years");
        } else {
          valid = true;
        }
        
        return valid;
      };

      const verify = async () => {
        try {
          setToast({ type: toastTypes.LOADING, message: "Please wait"})
          await Auth.verifyCurrentUserAttributeSubmit('phone_number', otp);
          setToast({ type: toastTypes.SUCCESS, message: "Succesfully updated"})
          setShowOtpInput(false)
        } catch (error) {
          setToast({ type: toastTypes.ERROR, message: "couln't update"})
        }
      }
    
      const resend = async () => {
        try {
          setToast({ type: toastTypes.LOADING, message: "Sending OTP"})
          await Auth.verifyCurrentUserAttribute('phone_number')
          setToast({ type: toastTypes.SUCCESS, message: "OTP has been sent again"})
        } catch (error) {
          console.log(error)
          setToast({ type: toastTypes.ERROR, message: "couln't send OTP"})
        }
      }
    
    const handleUpdate = async () => {
        if(isValid()) {
            const phoneNumberWithCountryCode = `+91${phoneNumberForUpdate}`;
            try {
              setToast({ type: toastTypes.LOADING, message: "Please wait"})
              const user = await Auth.currentAuthenticatedUser();
              await Auth.updateUserAttributes(user, { 
                "email" : emailForUpdate,
                "phone_number": phoneNumberWithCountryCode,
                "birthdate" : birthdateForUpdate,
                "gender": genderForUpdate 
              });
              if(phoneNumberForUpdate !== phoneNumberWithoutCountryCode){
                setToast({ type: "", message :""})
                setShowOtpInput(true);
              } else {
                setToast({ type: toastTypes.SUCCESS, message: "Update successfull"})
              }
            } catch (error) {
              setToast({ type: toastTypes.ERROR, message: "Update failed"})
              console.log(error); 
            }
        }
    }

    const handleCancel = () => {
        navigation.navigate(MY_ACCOUNT.screenName);
    }

    return (
        <ScrollView style={{ backgroundColor: WHITE }} contentContainerStyle={{ flexGrow: 1 }}>
          {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
          <OTPVerificationToast
              show={showOtpInput}
              onClose={() => {setShowOtpInput(!showOtpInput)}}
              verify={verify}
              resend={resend}
              setOtp={setOtp}
              recepient={phoneNumberForUpdate}
            />
            <View style={{ flex: 1, margin: 20 }}>
                <View style={{flex: 1}}>
                    <InputComponent 
                        label="Email" 
                        updateParentState={setEmail} 
                        errMsg={emailErr} 
                        value={emailForUpdate} 
                        defaultValue={email}
                    />
                </View>
                <View style={{flex: 1}}>
                    <InputComponent 
                        label="Mobile number" 
                        updateParentState={setPhoneNumber} 
                        errMsg={mobileNumberErr} 
                        value={phoneNumberForUpdate}
                        defaultValue={phoneNumberWithoutCountryCode}
                    />
                </View>
                <View style={{flex: 1}}>
                    <CustomDatePicker dob={birthdate} updateParentState={setBirthdate} label="Date of Birth" date={birthdate} />
                </View>
                <View style={{flex: 1}}>
                    <Selector options={GENDER_OPTIONS} label="Gender" onValueChange={setGender} defaultValue={gender} />
                </View>  
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', ...padding(10,20,10,20), backgroundColor: LIGHTEST_GRAY }}>
              <Button onPress={handleCancel} bgColor={LIGHTEST_GRAY}>Cancel</Button>  
            <Button bgColor={ORANGE} textColor={WHITE} onPress={handleUpdate}>Update</Button>
          </View>
        </ScrollView>
    ); 
}

export default UpdateAccount;