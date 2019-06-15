import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  FLAG_COLOR_GREEN,
  FLAG_COLOR_WHITE,
} from '../constants/styleConstants';

class HelpRequestHandler extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          position: "relative"
        }}
      >
        <TouchableOpacity style={styles.text}>
          <Text style={{ fontSize: 18, marginLeft: 3 }}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.text}>
          <Icon name="share-alt-square" color={FLAG_COLOR_GREEN} size={30} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HelpRequestHandler;

const styles = StyleSheet.create({
  text: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: FLAG_COLOR_GREEN,
    backgroundColor: FLAG_COLOR_WHITE,
    margin: 3,
    borderRadius: 5,
    padding: 5
  }
});
