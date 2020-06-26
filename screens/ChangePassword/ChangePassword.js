
import React, { useState } from 'react';
import { Toast } from '../../components/atoms';
import { Input } from '../../components/molecules';
import { Auth } from 'aws-amplify';
import { toastTypes } from '../../components/atoms/Toast';
import { passwordConstraints } from '../../utils';
import { useForm } from '../../customHooks';
import { Container, Content, StyleProvider, Text, View, Button } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const PASSWORD = 'password'
const CONFIRM_PASSOWRD = 'confirmPassword'
const OLD_PASSWORD = 'oldPassword';

const ChangePasswordScreen = () => {
  const { values, errors, bindField, isValid } = useForm({
    [OLD_PASSWORD]: { constraints: passwordConstraints },
    [PASSWORD]: { constraints: passwordConstraints },
    [CONFIRM_PASSOWRD]: { constraints: [
      ...passwordConstraints, { 
        fun: (value) => values[PASSWORD] === value,
        message: "password mismatch" 
      }
    ]}
  });
  const [toast, setToast] = useState({ type: "", message: ""});

  const handleChange = async () => {
    if(isValid()) {
      try {
        setToast({ type: toastTypes.LOADING, message: "Please wait" })
        const user = await Auth.currentAuthenticatedUser()
        await Auth.changePassword(user, values[OLD_PASSWORD], values[PASSWORD])
        setToast({ type: toastTypes.SUCCESS, message: "Password changed" })
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Something went wrong" })
        console.log(error);
      }
  } else return;
}

  return (
    <StyleProvider style={getTheme(material)}>
      <Container>
        {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
        <Content style={{ marginHorizontal: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Input
              label="Old Password"
              showPasswordIcon={true}
              {...bindField(OLD_PASSWORD)}
              errMsg={errors[OLD_PASSWORD]}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Input
              label="Password"
              showPasswordIcon={true}
              {...bindField(PASSWORD)}
              errMsg={errors[PASSWORD]}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Input
              label="Confirm Password"
              showPasswordIcon={true}
              {...bindField(CONFIRM_PASSOWRD)}
              errMsg={errors[CONFIRM_PASSOWRD]}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button primary full large onPress={handleChange}>
              <Text>Change</Text>
            </Button>
          </View>
        </Content>
      </Container>
    </StyleProvider>
  );
}

export default ChangePasswordScreen;