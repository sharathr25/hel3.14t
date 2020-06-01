// @flow
import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import { useAuth } from "../../customHooks";
import { Toast } from '../../components/atoms';
import { toastTypes } from '../../components/atoms/Toast';

const Helps = () => {
  let { user } = useAuth();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if(user) {
      const { attributes } = user;
      const { email_verified } = attributes;
      setShowToast(!email_verified);
    }
  }, [user])

  if(!user) return <CustomModal variant="loading" />

  return (
    <View style={{flex: 1}}>
      {showToast && <Toast type={toastTypes.WARNING} message="Email not verified" duration={3000} />}
      <HelpRequestFeed />
    </View>
  ); 
}

export default Helps;
