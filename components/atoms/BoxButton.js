// @flow
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ORANGE, LIGHT_ORANGE } from "../../styles/colors";
import { FONT_BOLD } from "../../styles/typography";
import Icon from "react-native-vector-icons/FontAwesome";

type ButtonProps = {
  titleColor?: string,
  bgColor?: string,
  loading?: string,
  BoxButton?: string,
  onPress: Function,
  iconName?: any,
  title: string
}

const BoxButton = (props: ButtonProps) => {
  const { titleColor = ORANGE, bgColor = LIGHT_ORANGE, loading = false, onPress, title, iconName = "" } = props;
  return (
    <TouchableOpacity style={{ ...styles.container, backgroundColor: bgColor }} onPress={loading ? () => { } : onPress}>
        {iconName ? <Icon color={titleColor} size={25} name={iconName} />: null}
        <Text style={{color: titleColor, ...FONT_BOLD }}>{title}</Text>
    </TouchableOpacity>
  );
}

export default BoxButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: "center",
    width: 75, 
    height: 75
  },
  text: {
    fontSize: 20,
  },
});