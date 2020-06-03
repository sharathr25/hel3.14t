
import React from "react";
import { View, StyleSheet } from "react-native";
import { BLACK } from "../../styles/colors";

const Card = (props : { children: any }) => {
  const { children } = props;
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
    elevation: 2,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderColor: BLACK,
    margin: 10
  }
});
