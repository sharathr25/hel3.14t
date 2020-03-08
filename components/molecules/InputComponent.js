// @flow
import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { WHITE, ORANGE, INPUT_TEXT_COLOR, BLACK } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { StyleSheet } from 'react-native';
import { PasswordIcon } from '../atoms'

type InputComponentProps = {
  label?: string,
  secureTextEntry?: boolean,
  updateParentState: Function,
  errMsg: string,
  rightIcon: any,
  showPasswordIcon: boolean
}

const InputComponent = (props: InputComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const _setShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const { label = "", secureTextEntry = false, updateParentState, errMsg = "", rightIcon = null, showPasswordIcon = false } = props;
  const { labelStyle, containerStyle, inputContainerStyle, inputStyle } = styles;
  return (
    <Input
      label={label}
      labelStyle={labelStyle}
      inputContainerStyle={inputContainerStyle}
      inputStyle={inputStyle}
      containerStyle={containerStyle}
      secureTextEntry={showPasswordIcon && !showPassword}
      onChangeText={value => updateParentState(value)}
      errorMessage={errMsg}
      rightIcon={showPasswordIcon ? <PasswordIcon showPassword={showPassword} setShowPassword={_setShowPassword} /> : null}
      rightIconContainerStyle={{ right: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 0
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
    color: INPUT_TEXT_COLOR,
  },
});
export default InputComponent;