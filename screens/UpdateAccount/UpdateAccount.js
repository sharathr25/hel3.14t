// @flow
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ORANGE, WHITE, LIGHTEST_GRAY } from '../../styles/colors';
import { Button, CustomDatePicker, Selector, Toast} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { InputComponent, OTPVerificationToast } from '../../components/molecules';
import { padding } from '../../styles/mixins';
import { toastTypes } from '../../components/atoms/Toast';
import { mobileNoConstraints, emailConstraints } from '../../utils/formConstraints';
import { getAge } from '../../utils';
import { useForm } from '../../customHooks';

const AGE_LIMIT = 15;
const GENDER_OPTIONS = [
    {label:"Male", value: "male"}, 
    {label:"Female", value:"female"}
];

const { MY_ACCOUNT } = SCREEN_DETAILS;
const EMAIL = 'email'
const MOBILE_NUMBER = 'mobileNumber'

const UpdateAccount = ({ navigation, route }:{ navigation : Object, route : Object}) => {
  const { params } = route;
  const { user } = params;
  const { attributes } = user;
  const { values, errors, bindField, isValid }  =useForm({
    [EMAIL]: { constraints: emailConstraints },
    [MOBILE_NUMBER]: { constraints: mobileNoConstraints },
  })
  const { email, phone_number: phoneNumber, gender, birthdate } = attributes;
  const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");
  const [ birthdateForUpdate, setBirthdate ] = useState(birthdate);
  const [ genderForUpdate, setGender ] = useState(gender);
  const [ otp, setOtp ] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [toast, setToast] = useState({ type: "", message: ""})

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
    const age = getAge(birthdateForUpdate)
    if(isValid() && age > AGE_LIMIT) {
      const phoneNumberWithCountryCode = `+91${values[MOBILE_NUMBER]}`;
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait"})
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, { 
          "email" : values[EMAIL],
          "phone_number": phoneNumberWithCountryCode,
          "birthdate" : birthdateForUpdate,
          "gender": genderForUpdate 
        });
        if(values[MOBILE_NUMBER] !== phoneNumberWithoutCountryCode){
          setToast({ type: "", message :""})
          setShowOtpInput(true);
        } else {
          setToast({ type: toastTypes.SUCCESS, message: "Update successfull"})
        }
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Update failed"})
        console.log(error); 
      }
    } else {
      if(age <= AGE_LIMIT) Alert.alert(`Age should be more than ${AGE_LIMIT}`)
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
          recepient={values[MOBILE_NUMBER]}
        />
        <View style={{ flex: 1, margin: 20 }}>
          <View style={{flex: 1}}>
            <InputComponent 
              label="Email" 
              defaultValue={email}
              {...bindField(EMAIL)}
              errorMessage={errors[EMAIL]}
            />
          </View>
            <View style={{flex: 1}}>
              <InputComponent 
                label="Mobile number" 
                defaultValue={phoneNumberWithoutCountryCode}
                {...bindField(MOBILE_NUMBER)}
                errorMessage={errors[MOBILE_NUMBER]}
              />
            </View>
          <View style={{flex: 1, marginTop: 10}}>
              <CustomDatePicker updateParentState={setBirthdate} label="Date of Birth" date={birthdate} />
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