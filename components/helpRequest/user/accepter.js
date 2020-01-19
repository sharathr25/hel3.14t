import React from 'react';
import { Text, View } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import BoxText from '../../common/boxText';
import Stars from '../buttons/starsButton';

const Accepter = (props) => {
  const { status, name, mobileNo, stars, keyOfHelpRequest, uidOfAccepter } = props;
  const firstLetterOfName = name.substring(0, 1);
  const mobileNoWithoutCountryCode = mobileNo.replace("+91","");

  if (!status) return null;

  if (status === 'COMPLETED') {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ margin: 5 }}>
          <ProfileLetter letter={firstLetterOfName} />
        </View>
        <View style={{ marginLeft: 5, flex: 1 }}>
          <Text>{name}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
            {stars === 0 && <Stars uidOfUser={uidOfAccepter} stars={stars} keyOfHelpRequest={keyOfHelpRequest} />}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ margin: 5 }}>
        <ProfileLetter letter={firstLetterOfName} />
      </View>
      <View style={{ marginLeft: 5, flex: 1 }}>
        <Text>{name}</Text>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
          {mobileNo ? <BoxText leftText="Ph No" rightText={mobileNoWithoutCountryCode} /> : null}
        </View>
      </View>
    </View>
  );
}

export default Accepter;
