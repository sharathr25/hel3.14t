// @flow
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { FONT_FAMILY_REGULAR } from "../../styles/typography";
import { LIGHT_BLUE } from "../../styles/colors";

const Link = (props: {onPress : Function, children: any, style: Object }) => {
  const { onPress , children , style = {}} = props;
  const { text } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={{...style}}>
        <Text style={{ color: LIGHT_BLUE }}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Link;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY_REGULAR
  }
});
