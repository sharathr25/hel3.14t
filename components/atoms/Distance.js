import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { padding } from "../../styles/mixins";
import { FONT_SIZE_12, FONT_FAMILY_REGULAR } from "../../styles/typography";
import { BLACK } from "../../styles/colors";


const Distance = props => {
  const { distance } = props;
  return (
    <View style={styles.distanceContainer}>
      <Icon name="map-marker" size={FONT_SIZE_12} color="red" />
      <Text style={styles.distanceText}>{`${distance ? distance.toFixed(1) : 0} KM`}</Text>
    </View>
  );
};

export default Distance;

const styles = StyleSheet.create({
  distanceContainer: {
    flexDirection: "row",
    alignItems: 'center'
  },
  distanceText: {
    color: BLACK,
    fontSize: FONT_SIZE_12,
    ...padding(0, 0, 0, 5),
    fontFamily: FONT_FAMILY_REGULAR
  },
});