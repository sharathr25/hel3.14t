// @flow
import React from "react";
import { Text, StyleSheet } from "react-native";
import { padding } from "../../styles/mixins";
import { FONT_SIZE_12, FONT_FAMILY_REGULAR, FONT_SIZE_16 } from "../../styles/typography";
import { LIGHT_GRAY } from "../../styles/colors";

const Distance = (props: { distance: number}) => {
  const { distance } = props;
  return (
    <Text style={styles.distanceText}>{`${distance ? distance.toFixed(1) : 0} KM Away`}</Text>
  );
};

export default Distance;

const styles = StyleSheet.create({
  distanceContainer: {
    flexDirection: "row",
    alignItems: 'center'
  },
  distanceText: {
    color: LIGHT_GRAY,
    fontSize: FONT_SIZE_16,
    ...padding(0, 0, 0, 5),
    fontFamily: FONT_FAMILY_REGULAR
  },
});