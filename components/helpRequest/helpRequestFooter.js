import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import { FLAG_COLOR_GREEN, FLAG_COLOR_WHITE } from '../../constants/styleConstants';

class HelpRequestFooter extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const { pushUps, handlePush } = this.props;
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        position: 'relative',
      }}
      >
        <TouchableOpacity style={styles.text} onPress={handlePush}>
          <Text style={styles.text1}>{pushUps}</Text>
          <Text style={{ fontSize: 18, marginLeft: 3 }}>Push</Text>
        </TouchableOpacity>
        <View style={styles.text}>
          <Text style={{ fontSize: 18, marginLeft: 3 }}>Share</Text>
        </View>
        <View style={styles.text}>
          <Text style={{ fontSize: 18, marginLeft: 3 }}>Help</Text>
        </View>
      </View>
    );
  }
}

export default HelpRequestFooter;

const styles = StyleSheet.create({
  text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: FLAG_COLOR_GREEN,
    backgroundColor: FLAG_COLOR_WHITE,
    margin: 3,
    borderRadius: 5,
    padding: 5
  },
  text1: {
    fontSize: 12,
    color: FLAG_COLOR_WHITE,
    backgroundColor: FLAG_COLOR_GREEN,
    padding: 5,
    borderRadius: 5
  },
});
