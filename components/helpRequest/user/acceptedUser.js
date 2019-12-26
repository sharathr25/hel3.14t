import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import BoxText from '../../common/boxText';
import { getDataFromFirebase } from '../../../fireBase/database';

const AccetedUser = (props) => {
  const [name, setname] = useState('');
  const [xp, setXp] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    let isSubscribed = true;
    const {uidOfAcceptedHelper} = props;
    const url = `users/${uidOfAcceptedHelper}`;
    getDataFromFirebase(url).then((dataOfAcceptedHelper) => {
      const { name, xp, mobileNumber} = dataOfAcceptedHelper.val();
      if(isSubscribed) {
        setMobileNumber(mobileNumber);
        setname(name);
        setXp(xp);
      }
    });
    return () => isSubscribed=false;
  }, []);

    return (
      <View style={{ flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{margin: 5}}>
            <ProfileLetter letter={`${name.substring(0,1)}`}/>
          </View>
          <View style={{ marginLeft: 5, flex:1}}>
            <Text>{name}</Text>
            <View style={{ flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
              <BoxText leftText="XP" rightText={xp} />
              {mobileNumber ? <BoxText leftText="Ph No" rightText={mobileNumber} />:null}
            </View>
          </View>
        </View>
    );
  }

  export default AccetedUser;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      marginTop: 5
    },
    item:{
      textAlign: 'center'
    }
  });
