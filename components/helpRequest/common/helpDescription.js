import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { BLACK, FONT_FAMILY } from "../../../constants/styleConstants";

const HelpDescription = (props) => {
  const { data } = props;
  const { description } = data;
  return (
    <View style={styles.descriptionContainer}>
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

export default HelpDescription;

const styles = StyleSheet.create({
  descriptionContainer: {
    margin: 5,
    marginTop: 0,
    padding: 5
  },
  text: {
    color: BLACK
  },
  description: {
    color: BLACK,
    fontFamily: FONT_FAMILY
  }
});
