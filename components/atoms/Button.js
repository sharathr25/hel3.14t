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
  const { borderColor = ORANGE, textColor = ORANGE, bgColor = WHITE, loading = false, onPress, children } = props;
  return (
    <TouchableOpacity style={{ ...styles.container, borderColor, backgroundColor: bgColor }} onPress={loading ? () => { } : onPress}>
      {typeof children === "string" ? <Text style={{ ...styles.text, color: textColor }}>{children}</Text> : children}
    </TouchableOpacity>
  );
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