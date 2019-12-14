import React from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../../constants/styleConstants';

const ProfileLetter = props => {
  const { letter } = props;
  return (
    <View style={styles.textContainer}>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{letter}</Text>
      </View>
    </View>
  );
};

export default ProfileLetter;

const styles = StyleSheet.create({
  text: { fontSize: 20, color: FLAG_COLOR_WHITE },
  textWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  textContainer: {
    backgroundColor: FLAG_COLOR_ORANGE,
    borderRadius: 20,
    width: 30,
    height: 30,
  }
});
