// @flow
import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import { WHITE } from '../../styles/colors';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import { useAuth } from "../../customHooks";
import { Toast } from '../../components/atoms';

const Helps = ({ route }:{ route: Object }) => {
  const { params } = route;
  let { user } = useAuth() || params;
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
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      {showToast && <Toast type="warning" message="Email not verified" duration={3000} />}
      <HelpRequestFeed />
    </View>
  ); 
}

export default Helps;
