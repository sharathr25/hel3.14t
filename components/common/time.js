import React from "react";
import { Text, View , StyleSheet} from "react-native";
import { FONT_FAMILY } from "../../constants/styleConstants";
import {getTimeDiffrence} from '../../utils/index';

const Time = props => {
  const { time } = props;
  return (
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>{getTimeDiffrence(time) === " ago" ? "just now" : getTimeDiffrence(time)}</Text>
    </View>);
};

export default Time;

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  timeText: {
    fontFamily: FONT_FAMILY
  }
});
