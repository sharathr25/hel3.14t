import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  COLOR_1,
  FLAG_COLOR_WHITE,
  FLAG_COLOR_BLUE,
} from "../../../constants/styleConstants";

class HelpRequestPeopleCount extends Component {
  render() {
    const { noPeopleRequired, noPeopleRequested } = this.props;
    return (
        <View style={[styles.flexBox, styles.progressBar]}>
        <View style={[styles.progressBar_left, { flex: 50 }]}>
          <Text style={styles.progressBarTextLeft}>
            People Required <Text style={{fontWeight: 'bold'}}>{noPeopleRequired}</Text>
          </Text>
        </View>
        <View style={[styles.progressBar_right, { flex: 50 }]}>
          <Text style={styles.progressBarTextRight}>
            People Accepted <Text style={{fontWeight: 'bold'}}>{noPeopleRequested}</Text>
          </Text>
        </View>
      </View>
    );
  }
}

export default HelpRequestPeopleCount;

const styles = StyleSheet.create({
    flexBox: {
        flex: 1,
        flexDirection: "row"
      },
      progressBar: {
        overflow: "hidden",
        height: 25,
        maxHeight: 25,
        borderRadius: 10
      },
      progressBarTextLeft: {
        color: "white",
        flex: 1,
        fontSize: 15,
        padding: 2
      },
      progressBarTextRight: {
        color: FLAG_COLOR_BLUE,
        flex: 1,
        fontSize: 15,
        padding: 2
      },
      progressBar_left: {
        backgroundColor: FLAG_COLOR_BLUE,
        alignItems: "center"
      },
      progressBar_right: {
        backgroundColor: FLAG_COLOR_WHITE,
        alignItems: "center"
      }
});
