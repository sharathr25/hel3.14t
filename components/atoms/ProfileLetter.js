// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';

const ProfileLetter = (props : { letter : String }) => {
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
  text: { fontSize: 20, color: WHITE },
  textWrapper: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: ORANGE,
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 5
  }
});
