// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';

const ProfileLetter = (props : { letter : String, size: number }) => {
  const { letter, size = 30 } = props;
  const { textContainer, text } = styles;
  return (
    <View style={{ ...textContainer, width: size, height: size, borderRadius: size / 2 }}>
      <Text style={{ ...text, fontSize: size - 10 }}>{letter}</Text>
    </View>
  );
};

export default ProfileLetter;

const styles = StyleSheet.create({
  text: { 
    color: WHITE,
  },
  textContainer: {
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
