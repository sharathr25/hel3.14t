// @flow
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ORANGE, WHITE, BLACK, LIGHT_BLUE } from '../../styles/colors';
import { CustomModal, InputComponent } from '../../components/molecules';
import { Button } from '../../components/atoms'; 
import { margin } from "../../styles/mixins";

type VerificationProps = {
  navigation: Object,
  route: Object
}

const Verification = (props: VerificationProps) => {
  const [OTP, setOTP] = useState('');
  const { navigation, route } = props;
  const { params={} } = route;
  const { verify=(otp) => {}, redirectTo=(otp) => {}, resend=() => {}, message = "", showStatus = true } = params;
  const [showModal, setShowModal] = useState(false);
  const [successDesc, setSuccessDesc] = useState('');
  const [errorDesc, setErrorDesc] = useState(''); 

  
  const onSuccess = async (msg) => {
    if(showStatus) {
      setShowModal(true);
      setErrorDesc('');
      setSuccessDesc(msg);
    } else {
      redirectTo(OTP);
    }
    console.log(msg);
  }

  const onError = (error, msg) => {
    if(showStatus) {
      setShowModal(true);
      setSuccessDesc('');
      setErrorDesc(msg);
    }
    console.log(error);
  }

  const hideModal = () => {
    setShowModal(false);
    setSuccessDesc('');
    setErrorDesc('');
  }

  const hideModalAndRedirect = () => {
    hideModal();
    redirectTo(OTP);
  }

  const NotificationMessage = () => (
    <View style={{ backgroundColor: '#C4C4C4', marginBottom: 10, justifyContent: 'center', alignItems: 'center', padding: 15 }}>
      <Text style={{ color: BLACK }}>
        {message}
      </Text>
    </View>
  );

  const _resend = async () => {
    try {
      await resend();
      onSuccess("Resent successfull");
    } catch (error) {
      onError(error, "Resent failed")
    }
  }

  const ResendLink = () => (
    <View style={{ flexDirection: 'row',alignSelf: 'flex-end' }}>
      <Text style={{color: BLACK}}>Haven’t received OTP? </Text>
      <TouchableOpacity onPress={_resend}>
        <Text style={{color: LIGHT_BLUE}}>Resend</Text>
      </TouchableOpacity>
    </View>
  );

  const handleVerify = async () => {
    try {
      await verify(OTP);
      onSuccess("verification successfull");
    } catch (error) {
      onError(error, "verfication failed")
    }
  }

  const VerifyButton = () => (
    <View>
      <Button bgColor={ORANGE} textColor={WHITE} onPress={handleVerify}>Verify</Button>
    </View>
  );

  console.log(successDesc.length, errorDesc.length);

  if(showModal) {
    if(successDesc.length === 0 && errorDesc.length === 0) {
      return <CustomModal variant="loading" /> 
    } else if(successDesc.length != 0) {
      return <CustomModal variant="success" desc={successDesc} onClose={hideModalAndRedirect} />
    } else {
      return <CustomModal variant="error" desc={errorDesc} onClose={hideModal} />
    }
  }

  return (
    <View style={{ backgroundColor: WHITE, flex: 1, paddingTop: 30 }}>
      <NotificationMessage />
      <View style={{flex: 1, justifyContent: 'space-evenly', ...margin(0,30,0,30)}}>
      <View>
        <InputComponent label="OTP" showPasswordIcon={true} updateParentState={setOTP} />
        <ResendLink />
      </View>
      <VerifyButton />
      </View>
    </View>
  );
}

export default Verification;
