import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  FLAG_COLOR_GREEN,
  FLAG_COLOR_WHITE,
  BLACK,
  FLAG_COLOR_ORANGE
} from "../../constants/styleConstants";

class HelpRequestModifier extends Component {
  render() {
    const { handlePush, handlePull } = this.props;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          position: "relative"
        }}
      >
        <TouchableOpacity style={styles.text} onPress={handlePush}>
          <Icon name="angle-double-up" color={FLAG_COLOR_GREEN} size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.text} onPress={handlePull}>
          <Icon name="angle-double-down" color={FLAG_COLOR_ORANGE} size={30} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HelpRequestModifier;

const styles = StyleSheet.create({
  pushPull: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: FLAG_COLOR_GREEN,
    backgroundColor: FLAG_COLOR_WHITE,
    margin: 3,
    borderRadius: 5,
    padding: 5
  },
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
