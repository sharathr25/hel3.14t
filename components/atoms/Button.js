import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { WHITE, ORANGE } from "../../constants/styleConstants";

const Button = (props) => {
  const { borderColor = ORANGE, textColor = ORANGE, bgColor = WHITE, loading = false } = props;
  typeof props.children
  return (
    <TouchableOpacity style={{ ...styles.container, borderColor, backgroundColor: bgColor }} onPress={loading ? () => { } : props.onPress}>
      {typeof props.children === "string" ? <Text style={{ ...styles.text, color: textColor }}>{props.children}</Text> : props.children}
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
    borderRadius: 5,
    padding: 5
  },
  text: {
    fontSize: 20,
  },
});