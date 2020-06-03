
import React from "react";
import { Text, StyleSheet } from "react-native";
import { FONT_FAMILY_REGULAR, FONT_SIZE_16 } from "../../styles/typography";
import { LIGHT_GRAY } from "../../styles/colors";

type DistanceProps = { distance: number }

const Distance = ({ distance }: DistanceProps) => {
  const { distanceText } = styles;
  return (
    <Text style={distanceText}>{`${distance ? distance.toFixed(1) : 0} KM Away`}</Text>
  );
};

export default Distance;

const styles = StyleSheet.create({
  distanceText: {
    color: LIGHT_GRAY,
    fontSize: FONT_SIZE_16,
    fontFamily: FONT_FAMILY_REGULAR
  },
});