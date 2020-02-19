// @flow
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stars from './buttons/starsButton';
import { ProfileLetter } from '../atoms';

type AccepterProps = {
  status: string, 
  name: string, 
  mobileNo: string,
  stars: number, 
  keyOfHelpRequest: string, 
  uidOfAccepter: string
};

const Accepter = (props: AccepterProps) => {
  const { status, name, mobileNo, stars, keyOfHelpRequest, uidOfAccepter } = props;
  const firstLetterOfName = name.substring(0, 1);
  const mobileNoWithoutCountryCode = mobileNo.replace("+91", "");

  if (!status) return null;

  const { container, nameStyle, details } = styles;

  return (
    <View style={container}>
      <ProfileLetter letter={firstLetterOfName} />
      <View style={details}>
        <Text style={nameStyle}>{name}</Text>
        {
          status === 'COMPLETED'
            ? stars === 0 && <Stars uidOfUser={uidOfAccepter} stars={stars} keyOfHelpRequest={keyOfHelpRequest} />
            : mobileNo && <Text>{mobileNoWithoutCountryCode}</Text>
        }
      </View>
    </View>
  );
}

export default Accepter;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});
