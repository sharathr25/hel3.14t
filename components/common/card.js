import React from "react";
import { View, StyleSheet } from "react-native";

function Card(props){
return (
      <View style={styles.outerContanier}>
          {props.children}
      </View>
    );
}

export default Card;

const styles = StyleSheet.create({
  outerContanier: {
    borderBottomColor: '#f6f6f6',
    borderTopColor: '#f6f6f6',
    // elevation: 5,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    marginBottom:20,
  }
});
