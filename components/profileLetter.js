import React, { Component } from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../constants/styleConstants';

class ProfileLetter extends Component {
  render() {
    const { letter } = this.props;
    return (
      <View style={styles.textContainer}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{letter}</Text>
        </View>
      </View>
    );
  }
}

export default ProfileLetter;

const styles = StyleSheet.create({
  text: { fontSize: 20, color: FLAG_COLOR_WHITE },
  textWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  textContainer: {
    backgroundColor: FLAG_COLOR_ORANGE,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 5,
    width: 40,
    height: 40,
  }
});
