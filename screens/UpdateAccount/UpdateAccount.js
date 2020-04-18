// @flow
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { Button, CustomDatePicker, Selector} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS, SIGN_UP_SCREEN } from "../../constants/appConstants";
import { InputComponent } from '../../components/molecules';
import { padding } from '../../styles/mixins';
import { regex, getAge } from '../../utils';

const GENDER_OPTIONS = [
    {label:"Male", value: "male"}, 
    {label:"Female", value:"female"}
];

const { ERRORS } = SIGN_UP_SCREEN;

const AGE_LIMIT = 15;

const {
  EMPTY_EMAIL_ERROR, 
  INVALID_EMAIL_ERROR, 
  EMPTY_MOBILE_NUMBER_ERROR, 
  INVALID_MOBILE_NUMBER_ERROR,
} = ERRORS;


const UpdateAccount = ({ navigation, route }) => {
    const { params } = route;
    const { user } = params;
    const { attributes, username } = user;
    const { email, phone_number: phoneNumber, gender, birthdate } = attributes;
    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");

    const [ emailForUpdate, setEmail ] = useState(email);
    const [ phoneNumberForUpdate, setPhoneNumber ] = useState(phoneNumberWithoutCountryCode);
    const [ birthdateForUpdate, setBirthdate ] = useState(birthdate);
    const [ genderForUpdate, setGender ] = useState(gender);
    const [ emailErr, setEmailErr ] = useState('');
    const [ mobileNumberErr, setMobileNumberErr ] = useState('');

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

      const verify = async (otp) => {
        return await Auth.verifyCurrentUserAttributeSubmit('phone_number', otp);
      }
    
      const redirectTo = async (otp) => {
        await Auth.signOut();
        navigation.navigate(SCREEN_DETAILS.LOGIN.screenName);
      }
    
      const resend = async () => {
        // return await Auth.resendSignUp(username)
      }
    
    const handleUpdate = async () => {
        if(isValid()) {
            const phoneNumberWithCountryCode = `+91${phoneNumberForUpdate}`;
            try {
              const user = await Auth.currentAuthenticatedUser();
              const data = await Auth.updateUserAttributes(user, { 
                "email" : emailForUpdate,
                "phone_number": phoneNumberWithCountryCode,
                "birthdate" : birthdateForUpdate,
                "gender": genderForUpdate 
              });
              if(phoneNumberForUpdate !== phoneNumberWithoutCountryCode){
                const paramsForVerificationScreen = { verify, redirectTo, resend, message: `Enter OTP sent to xxxxxxxx${phoneNumberForUpdate.substr(8)}`};
                navigation.navigate(SCREEN_DETAILS.VERIFICATION.screenName, paramsForVerificationScreen);
              } else {
                await Auth.signOut();
                navigation.navigate(SCREEN_DETAILS.LOGIN.screenName);
              }
            } catch (error) {
              console.log(error); 
            }
        }
    }

    const handleCancel = () => {
        navigation.navigate(SCREEN_DETAILS.MY_ACCOUNT.screenName);
    }

    return (
        <ScrollView style={{ backgroundColor: WHITE }} contentContainerStyle={{ flexGrow: 1 }}>
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
                        label="Mobile Number" 
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
                <View style={{felx: 1, flexDirection: 'row', justifyContent: 'space-between', ...padding(0, 10,0, 10) }}>
                    <Button onPress={handleCancel}>Cancel</Button>    
                    <Button bgColor={ORANGE} textColor={WHITE} onPress={handleUpdate}>Update</Button>
                </View>
            </View>
        </ScrollView>
    ); 
}

export default UpdateAccount;