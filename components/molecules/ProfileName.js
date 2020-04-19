// @flow
import React from 'react';
import { Text, View } from 'react-native';
import { ORANGE } from '../../styles/colors';
import { ProfileLetter } from '../atoms';
import { FONT_SIZE_14 } from '../../styles/typography';

const ProfileName = (props : { name : String }) => {
  const { name } = props;
  const letter = name.substring(0,1).toUpperCase();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProfileLetter letter={letter} />
        <Text style={{color: ORANGE, paddingLeft: 10, fontSize: FONT_SIZE_14}}>{name}</Text>
    </View>
  );
};

export default ProfileName;