import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, APP_TITLE } from '../../constants/appConstants';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { InputComponent, ErrorMessage } from '../../components/atoms';
import { regex } from '../../utils/index';
import { getUser } from '../../fireBase/database';
import { CustomModal } from '../../components/molecules';
import { Button } from '../../components/atoms'; 
import { Auth } from "aws-amplify";
import { margin } from "../../styles/mixins";

type VerificationProps = {
  navigation: Object,
  route: Object
}

const Verification = (props: VerificationProps) => {
  const [OTP, setOTP] = useState('');
  const { navigation, route } = props;
  const { params } = route;
  // const { username, mobileNumber } = params;
  const [showModal, setShowModal] = useState(false);
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState('');

    const handleResendOtp = () => {
        Auth.resendSignUp("sharathr25")
            .then(() => {
              setShowModal(true);
              setErrorDesc('');
              setSuccessDesc('Code Resent successfully');
              console.log('code resent successfully');
            })
            .catch(e => {
              setShowModal(true);
              setSuccessDesc('');
              setErrorDesc("Code resent failed");
              console.log(e);
            }
        );
    }
   
  const handleVerify = async () => {
    try {
        await Auth.confirmSignUp("sharathr25", OTP, {
          forceAliasCreation: true    
        });
        setShowModal(true);
        setErrorDesc('');
        setSuccessDesc('OTP verification successful');
        navigation.navigate('Login');
    } catch (error) {
        setShowModal(true);
        setSuccessDesc('');
        setErrorDesc("Verification code invalid");
        console.log(error);
    }
  }

  const hideModal = () => {
    setShowModal(false);
    setSuccessDesc('');
    setErrorDesc('');
  }

  if(showModal) {
    if(successDesc.length === 0 && errorDesc.length === 0) {
      return <CustomModal variant="loading" /> 
    } else if(successDesc.length != 0) {
      return <CustomModal variant="success" desc={successDesc} onClose={hideModal} />
    } else {
      {console.log('error..........')}
      return <CustomModal variant="error" desc={errorDesc} onClose={hideModal} />
    }
  }

  return (
      <View style={{backgroundColor: WHITE, flex: 1}}>
        <View style={{backgroundColor: '#C4C4C4', marginBottom: 10, justifyContent: 'center', alignItems: 'center', padding: 15}}>
            {/* <Text style={{color: BLACK}}>Enter OTP sent to  xxxxxxxxx{mobileNumber.substring(8)}</Text> */}
        </View>
        <InputComponent
          label="OTP"
          secureTextEntry={false}
          updateParentState={setOTP}
        />
        <View style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            ...margin(0,10,0,0)
        }}>
        <Text>Haven’t received OTP? </Text>
        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={{color: "#1DA1F2"}}>Resend</Text>
        </TouchableOpacity>
      </View>
      <View style={{...margin(30,30,0,30)}}>
        <Button bgColor={ORANGE} textColor={WHITE} onPress={handleVerify}>Verify</Button>
      </View>
      </View>
  );
}

export default Verification;
