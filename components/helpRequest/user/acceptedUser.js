import React, { useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import BoxText from '../../common/boxText';
import { getDataFromFirebase } from '../../../fireBase/database';
import { useVal } from '../../../effects';
import Icon from "react-native-vector-icons/FontAwesome";
import Stars from '../buttons/starsButton';
import { HELPS_COMPLETED_DB } from '../../../constants/appConstants';

const AccetedUser = (props) => {
  const { uidOfAcceptedHelper, status, keyOfHelpRequest, dataOfAcceptedHelper } = props;
  const { stars } = dataOfAcceptedHelper;
  const [name, setname] = useState('');
  const [xp, setXp] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showStars,setShowStars] = useState(stars ? false : true);
  const starsOfAcceptedHelper = useVal(`users/${uidOfAcceptedHelper}/stars`, 0);

  useEffect(() => {
    let isSubscribed = true;
    const url = `users/${uidOfAcceptedHelper}`;
    getDataFromFirebase(url).then((dataOfAcceptedHelper) => {
      const { name, xp, mobileNumber } = dataOfAcceptedHelper.val();
      if (isSubscribed) {
        setMobileNumber(mobileNumber);
        setname(name);
        setXp(xp);
      }
    });
    return () => isSubscribed = false;
  }, []);

  useEffect(() => {
    getDataFromFirebase(`${HELPS_COMPLETED_DB}/usersAccepted/${uidOfAcceptedHelper}`).then((data) => {
      if(data.val()){
        setShowStars(false);
      }
    })
  }, [])

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
            <BoxText leftText="XP" rightText={xp} />
            <BoxText leftText={<Icon name="star-o" size={20} />} rightText={starsOfAcceptedHelper} />
            {showStars && <Stars uidOfUser={uidOfAcceptedHelper} stars={starsOfAcceptedHelper} keyOfHelpRequest={keyOfHelpRequest} setShowStars={setShowStars} />}
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
          {mobileNumber ? <BoxText leftText="Ph No" rightText={mobileNumber} /> : null}
        </View>
      </View>
    </View>
  );
}

export default AccetedUser;
