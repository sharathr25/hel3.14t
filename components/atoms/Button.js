// @flow
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { WHITE, ORANGE } from "../../styles/colors";

type ButtonProps = {
  borderColor?: string,
  textColor?: string,
  bgColor?: string,
  loading?: string,
  children?: any,
  onPress: Function
}

const Button = (props: ButtonProps) => {
  const { borderColor, textColor, bgColor, loading, onPress, children } = props;

  const _onPress = () => {
    if(!loading) onPress();
  }

  const { container, text } = styles;

  return (
    <TouchableOpacity style={{ ...container, borderColor, backgroundColor: bgColor }} onPress={_onPress}>
      {typeof children === "string" ? <Text style={{ ...text, color: textColor }}>{children}</Text> : children}
    </TouchableOpacity>
  );
}

Button.defaultProps = {
  borderColor: ORANGE, 
  textColor: ORANGE, 
  bgColor: WHITE, 
  loading: false
}

export default Button;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  text: {
    fontSize: 20,
  },
});