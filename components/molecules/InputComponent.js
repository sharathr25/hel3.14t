// @flow
import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { StyleSheet } from 'react-native';
import { PasswordIcon } from '../atoms'

type InputComponentProps = {
  showPasswordIcon: boolean,
}

const InputComponent = (props: InputComponentProps) => {
  const { showPasswordIcon } = props;
  const [showPassword, setShowPassword] = useState(false);

  const _setShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const { labelStyle, containerStyle, inputContainerStyle, inputStyle } = styles;

  return (
    <Input
      labelStyle={labelStyle}
      inputContainerStyle={inputContainerStyle}
      inputStyle={inputStyle}
      containerStyle={containerStyle}
      secureTextEntry={showPasswordIcon && !showPassword}
      rightIcon={showPasswordIcon && <PasswordIcon showPassword={showPassword} setShowPassword={_setShowPassword} />}
      rightIconContainerStyle={{ right: 8 }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  labelStyle: {
    backgroundColor: WHITE,
    zIndex: 2,
    left: 40,
    top: -15,
    alignSelf: 'flex-start',
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    color: BLACK,
    fontWeight: FONT_WEIGHT_REGULAR
  },
  inputContainerStyle: {
    borderColor: ORANGE,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingLeft: 15,
  },
  inputStyle: {
    color: BLACK,
  },
});

InputComponent.defaultProps = {
  label : "", 
  errMsg : "", 
  showPasswordIcon : false, 
  defaultValue : "",
  setIsValid: () => {},
  constraints: [],
  keyboardType: "default"
}

export default InputComponent;