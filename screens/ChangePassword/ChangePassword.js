// @flow
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { Button, Toast } from '../../components/atoms';
import { InputComponent } from '../../components/molecules';
import { Auth } from 'aws-amplify';
import { toastTypes } from '../../components/atoms/Toast';
import { passwordConstraints } from '../../utils';
import { useForm } from '../../customHooks';

const PASSWORD = 'password'
const CONFIRM_PASSOWRD = 'confirmPassword'
const OLD_PASSWORD = 'oldPassword';

const ResetPassowrdScreen = () => {
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
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: WHITE}}>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
      <View style={{flex: 1, margin: 20 }}>
        <View style={{flex: 1, justifyContent: 'center' }}>
          <InputComponent
            label="Old Password"
            showPasswordIcon={true}
            {...bindField(OLD_PASSWORD)}
            errorMessage={errors[OLD_PASSWORD]}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputComponent
            label="Password"
            showPasswordIcon={true}
            {...bindField(PASSWORD)}
            errorMessage={errors[PASSWORD]}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputComponent
            label="Confirm Password"
            showPasswordIcon={true}
            {...bindField(CONFIRM_PASSOWRD)}
            errorMessage={errors[CONFIRM_PASSOWRD]}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Button bgColor={ORANGE} textColor={WHITE} onPress={handleChange}>Change</Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default ResetPassowrdScreen;