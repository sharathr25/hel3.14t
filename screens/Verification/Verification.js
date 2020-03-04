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
  const { email, mobileNumber} = params;

    const handleResendOtp = () => {
        Auth.resendSignUp(email)
            .then(() => {
                console.log('code resent successfully');
        
            })
            .catch(e => {
                console.log(e);
            }
        );
    }
   
  const handleVerify = async () => {
    try {
        const data = await Auth.confirmSignUp(email, OTP, {
          forceAliasCreation: true    
        });
        console.log(data)
        const {navigation } = props;
        navigation.navigate('Login');
    } catch (error) {
        console.log(error);
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
