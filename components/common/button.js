import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../constants/styleConstants";

const Button = (props) => {
  const { borderColor = FLAG_COLOR_ORANGE, textColor = FLAG_COLOR_ORANGE, bgColor = FLAG_COLOR_WHITE } = props;
  return (
    <TouchableOpacity style={{ ...styles.container, borderColor, backgroundColor: bgColor }} onPress={props.onPress}>
      <Text style={{ ...styles.text, color: textColor }}>{props.children}</Text>
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: FLAG_COLOR_WHITE,
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 5,
  },
  text: {
    fontSize: 20,
  },
});