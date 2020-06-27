
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { CustomDatePicker, Selector, Toast} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { Input, OTPVerificationToast } from '../../components/molecules';
import { toastTypes } from '../../components/atoms/Toast';
import { mobileNoConstraints, emailConstraints } from '../../utils/formConstraints';
import { getAge } from '../../utils';
import { useForm } from '../../customHooks';
import { StyleProvider, Container, Content, Footer, Left, Right, Button, Text , View} from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { LIGHTEST_GRAY, LIGHT_GRAY, LIGHTER_ORANGE } from '../../styles/colors';

const AGE_LIMIT = 15;
const GENDER_OPTIONS = [
    {label:"Male", value: "male"}, 
    {label:"Female", value:"female"}
];

const { MY_ACCOUNT } = SCREEN_DETAILS;
const EMAIL = 'email'
const MOBILE_NUMBER = 'mobileNumber'

const UpdateAccount = ({ navigation, route }) => {
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
    <StyleProvider style={getTheme(material)}>
      <Container>
        {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
        <OTPVerificationToast
          show={showOtpInput}
          onClose={() => {setShowOtpInput(!showOtpInput)}}
          verify={verify}
          resend={resend}
          setOtp={setOtp}
          recepient={values[MOBILE_NUMBER]}
        />
        <Content style={{ marginHorizontal: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{flex: 1}}>
            <Input 
              label="Email" 
              defaultValue={email}
              {...bindField(EMAIL)}
              ereMsg={errors[EMAIL]}
            />
          </View>
          <View style={{flex: 1}}>
            <Input 
              label="Mobile number" 
              defaultValue={phoneNumberWithoutCountryCode}
              {...bindField(MOBILE_NUMBER)}
              ereMsg={errors[MOBILE_NUMBER]}
            />
          </View>
          <View style={{flex: 1, marginTop: 10}}>
              <CustomDatePicker updateParentState={setBirthdate} label="Date of Birth" date={birthdate} />
          </View>
          <View style={{flex: 1}}>
              <Selector options={GENDER_OPTIONS} label="Gender" onValueChange={setGender} defaultValue={gender} />
          </View>  
        </Content>
        <Footer style={{ backgroundColor: LIGHTEST_GRAY, paddingHorizontal: 10 }}>
          <Left>
            <Button onPress={handleCancel} bordered primary>
              <Text>Cancel</Text>
            </Button>
          </Left>
          <Right>
            <Button onPress={handleUpdate} primary>
              <Text>Update</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    </StyleProvider>
  ); 
}

export default UpdateAccount;