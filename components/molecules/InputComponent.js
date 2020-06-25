
import React, { useState } from 'react';
import { WHITE, ORANGE, BLACK, RED } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR, FONT_SIZE_18 } from "../../styles/typography";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { PasswordIcon } from '../atoms';
import {  Input as InputComponent, Label, Item, View, Text } from 'native-base'

type InputComponentProps = {
  showPasswordIcon: boolean,
  label?:string,
  errMsg?: string
}

const Input = (props: InputComponentProps) => {
  const { showPasswordIcon, label, errMsg  } = props;
  const [showPassword, setShowPassword] = useState(false);

  const _setShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const { labelStyle, containerStyle, inputContainerStyle, inputStyle } = styles;

  return (
    <Item stackedLabel style={{ borderColor: 'transparent', padding: 0 }}>
      <Label style={labelStyle}>{label}</Label>
      <View style={{ borderColor: ORANGE,  borderWidth: 1, borderRadius: 5 , flexDirection: 'row' }}>
        <InputComponent 
          secureTextEntry={showPasswordIcon && !showPassword} 
          {...props}
        />
        {showPasswordIcon && <PasswordIcon showPassword={showPassword} setShowPassword={_setShowPassword} />}
      </View>
      {errMsg !== "" && <Text style={{ color: RED }}>{errMsg}</Text>}
    </Item>
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
    left: 20, 
    top: 10, 
    paddingHorizontal: 10, 
    textAlign: 'center',
    color: BLACK,
    fontSize:FONT_SIZE_18
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

Input.defaultProps = {
  label : "", 
  errMsg : "", 
  showPasswordIcon : false, 
  defaultValue : "",
  setIsValid: () => {},
  constraints: [],
  keyboardType: "default"
}

export default Input;