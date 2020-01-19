import React from 'react';
import { Text, View } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import BoxText from '../../common/boxText';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from '../buttons/starsButton';

const AccetedUser = (props) => {
  const { status, name, mobileNo, xp, stars, keyOfHelpRequest, uidOfAcceptedUser } = props;

  if (!status) return null;

  if (status === 'COMPLETED') {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ margin: 5 }}>
          <ProfileLetter letter={`${name.substring(0, 1)}`} />
        </View>
        <View style={{ marginLeft: 5, flex: 1 }}>
          <Text>{name}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
            {stars === 0 && <Stars uidOfUser={uidOfAcceptedUser} stars={stars} keyOfHelpRequest={keyOfHelpRequest} />}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ margin: 5 }}>
        <ProfileLetter letter={`${name.substring(0, 1)}`} />
      </View>
      <View style={{ marginLeft: 5, flex: 1 }}>
        <Text>{name}</Text>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
          <BoxText leftText="XP" rightText={xp} />
          {mobileNo ? <BoxText leftText="Ph No" rightText={mobileNo.replace("+91","")} /> : null}
        </View>
      </View>
    </View>
  );
}

export default AccetedUser;
