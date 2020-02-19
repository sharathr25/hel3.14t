// @flow
import React from "react";
import { Text, StyleSheet } from "react-native";
import { getTimeDiffrence } from '../../utils/index';
import { FONT_FAMILY_REGULAR } from "../../styles/typography";

const Time = (props: {time : number }) => {
  const { time } = props;
  const { text } = styles;
  return (
    <Text style={text}>{getTimeDiffrence(time) === " ago" ? "just now" : getTimeDiffrence(time)}</Text>
  );
};

export default Time;

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY_REGULAR
  }
});
