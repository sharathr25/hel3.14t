import React from "react";
import { View, StyleSheet, Text } from "react-native";

function Card(props) {
  const { borderLeftColor } = props;
  return (
    <View style={styles.outerContanier}>
      {borderLeftColor && <View style={{ backgroundColor: borderLeftColor, width: 5}}>
        <Text></Text>
      </View>}
      <View style={{display:'flex', flex:1, padding: 10}}>
        {props.children}
      </View>
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  outerContanier: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#f6f6f6',
    borderTopColor: '#f6f6f6',
    // elevation: 5,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    marginBottom: 20,
  }
});
