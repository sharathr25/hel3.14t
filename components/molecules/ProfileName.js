// @flow
import React from 'react';
import { View } from 'react-native';
import { ORANGE } from '../../styles/colors';
import { ProfileLetter, Heading } from '../atoms';

const ProfileName = (props : { name : String }) => {
  const { name } = props;
  const letter = name.substring(0,1).toUpperCase();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProfileLetter letter={letter} />
        <View style={{ width: 10 }} />
        <Heading color={ORANGE}>{name}</Heading>
    </View>
  );
};

export default ProfileName;