import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { WHITE, ORANGE } from "../../../constants/styleConstants";

export default class ReferButton extends Component {
render(){
  return (
      <TouchableOpacity style={styles.container} onPress={() => {}}>
          <Text style={styles.help}>Refer</Text>
      </TouchableOpacity>
    );
  }
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: WHITE,
      borderWidth: 1,
      borderColor: ORANGE,
      margin: 10,
      borderRadius: 5,
      padding: 5,
    },
    help:{
        width: 50,
        fontSize: 20,
        color:ORANGE
    },
    text:{
        fontSize: 20
    }
  });