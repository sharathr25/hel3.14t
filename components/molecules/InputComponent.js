// @flow
import React, { useState, useRef } from 'react';
import { Input } from 'react-native-elements';
import { WHITE, ORANGE, BLACK } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { StyleSheet } from 'react-native';
import { PasswordIcon } from '../atoms'

type InputComponentProps = {
  label?: string,
  secureTextEntry?: boolean,
  updateParentState: Function,
  rightIcon: any,
  showPasswordIcon: boolean,
  defaultValue: string,
  constraints: [Function],
  setIsValid: Function,
  keyboardType?: string
}

const InputComponent = (props: InputComponentProps) => {
  const { label, updateParentState, showPasswordIcon, defaultValue, setIsValid, constraints, keyboardType } = props;
  const [value, setValue] = useState("")
  const [err, setErr] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const input = useRef();

  const _setShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const _onBlur = () => {
    const [isValid, message] = constraints.reduce((acc, cur) => {
      return acc[0] ? [cur.fun(value), cur.fun(value) ? "" : cur.message]: acc
    }, [true, ""])
    setErr(message)
    setIsValid(isValid)
    if(!isValid && input.current) input.current.shake()
  }

  const _onChangeText = (value) => {
    setValue(value)
    updateParentState(value)
  }

  const { labelStyle, containerStyle, inputContainerStyle, inputStyle } = styles;

  return (
    <Input
      ref={input}
      label={label}
      labelStyle={labelStyle}
      inputContainerStyle={inputContainerStyle}
      inputStyle={inputStyle}
      containerStyle={containerStyle}
      secureTextEntry={showPasswordIcon && !showPassword}
      onChangeText={_onChangeText}
      errorMessage={err}
      rightIcon={showPasswordIcon && <PasswordIcon showPassword={showPassword} setShowPassword={_setShowPassword} />}
      rightIconContainerStyle={{ right: 8 }}
      defaultValue={defaultValue}
      onBlur={_onBlur}
      keyboardType={keyboardType}
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