import React, { Component } from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { FLAG_COLOR_BLUE, FLAG_COLOR_ORANGE } from '../constants/styleConstants';

class HelpDescription extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

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

export default HelpDescription;

const styles = StyleSheet.create({
  text: { fontSize: 30, color: FLAG_COLOR_BLUE },
  textWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  textContainer: {
    backgroundColor: FLAG_COLOR_ORANGE,
    margin: 5,
    borderRadius: 25,
    width: 50,
    height: 50,
  }
});
