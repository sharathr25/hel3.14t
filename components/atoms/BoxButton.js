// @flow
import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { ORANGE, LIGHT_ORANGE } from "../../styles/colors";
import { FONT_BOLD, FONT_SIZE_20 } from "../../styles/typography";
import Icon from "react-native-vector-icons/FontAwesome";

type ButtonProps = {
  titleColor?: string,
  bgColor?: string,
  loading?: string,
  BoxButton?: string,
  onPress: Function,
  iconName?: any,
  title?: string
}

const BoxButton = (props: ButtonProps) => {
  const { titleColor, bgColor , loading , onPress, title, iconName } = props;

  const _onPress = () => {
    if(!loading) onPress();
  }

  const { container } = styles;
  return (
    <TouchableOpacity style={{ ...container, backgroundColor: bgColor }} onPress={_onPress}>
        {iconName ? <Icon color={titleColor} size={25} name={iconName} />: null}
        <Text style={{color: titleColor, ...FONT_BOLD}}>{title}</Text>
    </TouchableOpacity>
  );
}

BoxButton.defaultProps = {
  titleColor : ORANGE, 
  bgColor : LIGHT_ORANGE, 
  loading : false, 
  onPress : () => {}, 
  title : "", 
  iconName : ""
};

export default BoxButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: "center",
    width: 75, 
    height: 75
  },
});