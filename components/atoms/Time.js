// @flow
import React from "react";
import { Text, StyleSheet } from "react-native";
import { getTimeDiffrence } from '../../utils/index';
import { FONT_FAMILY_REGULAR, FONT_SIZE_16 } from "../../styles/typography";
import { LIGHT_GRAY } from "../../styles/colors";

const Time = ({ time }: {time : number }) => {
  const { text } = styles;
  return (
    <Text style={text}>{getTimeDiffrence(time) === " ago" ? "just now" : getTimeDiffrence(time)}</Text>
  );
};

export default Time;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY_REGULAR,
    color: LIGHT_GRAY,
    fontSize: FONT_SIZE_16
  }
});