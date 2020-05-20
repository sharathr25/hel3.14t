// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';

type ProfileLetterProps = {
  letter : string, 
  size: number,
  bgColor: string
}

const ProfileLetter = (props: ProfileLetterProps) => {
  const { letter, size = 30, bgColor = ORANGE } = props;
  const { textContainer, text } = styles;
  return (
    <View style={{ ...textContainer, width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }}>
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
    justifyContent: 'center',
    alignItems: 'center'
  }
});
