// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LIGHT_GRAY, BLACK } from "../../styles/colors";

function Card(props : { borderLeftColor: string, children: any }) {
  const { borderLeftColor, children } = props;
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: BLACK,
    borderWidth: 0.1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    margin: 10
  }
});
