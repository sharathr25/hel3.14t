
import React, { useState, useEffect } from 'react';
import { HelpRequestFeed } from '../../components/oraganisms';
import { CustomModal } from "../../components/molecules";
import { useAuth } from "../../customHooks";
import { Toast } from '../../components/atoms';
import { toastTypes } from '../../components/atoms/Toast';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { StyleProvider, Container, Content, List } from 'native-base';

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
    <StyleProvider style={getTheme(material)}>
      <Container>
        {showToast && <Toast type={toastTypes.WARNING} message="Email not verified" duration={3000} />}
        <Content>
          <List>
            <HelpRequestFeed />
          </List>
        </Content>
      </Container>
    </StyleProvider>
  ); 
}

export default Helps;
