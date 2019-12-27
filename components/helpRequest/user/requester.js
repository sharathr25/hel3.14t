import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FLAG_COLOR_GREEN } from '../../../constants/styleConstants';
import ProfileLetter from '../../common/profileLetter';
import Icon from 'react-native-vector-icons/FontAwesome';
import BoxText from '../../common/boxText';
import {getDataFromFirebase, updateFirebaseWithURL, removeFromFirebaseWithUrlAndValue, notifyUser, pushToFirebaseWithURL} from '../../../fireBase/database';
import { HELPS_REQUESTED_DB } from '../../../constants/appConstants';

const Requester = props => {
  const [name, setname] = useState('');
  const [xp, setXp] = useState(0);

  const handleAccept = async () => {
    const {uidOfRequestingHelper, keyOfHelpRequest, noPeopleAccepted, noPeopleRequired} = props;
    const data = await getDataFromFirebase(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersAccepted/${uidOfRequestingHelper}`);
      if(!data.val()){
        await updateFirebaseWithURL(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}`,"noPeopleAccepted",noPeopleAccepted+1);
        if(noPeopleRequired === noPeopleAccepted+1){
          updateFirebaseWithURL(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}`,"status","ON_GOING");
        }
        await pushToFirebaseWithURL(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersAccepted`,uidOfRequestingHelper);
        await removeFromFirebaseWithUrlAndValue(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersRequested`, uidOfRequestingHelper);
        await notifyUser(uidOfRequestingHelper,{type:"ACCEPT", screenToRedirect:"Helped", uidOfHelper:uidOfRequestingHelper,timeStamp: new Date().getTime(), idOfHelpRequest: keyOfHelpRequest});
      } else {
        Alert.alert("user already accepted");
      }
  };

  const handleReject = async () => {
    const { uidOfRequestingHelper , keyOfHelpRequest} = props;
    const data =  await getDataFromFirebase(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersRejected/${uidOfRequestingHelper}`);
    if(!data.val()){
      await pushToFirebaseWithURL(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersRejected`, uidOfRequestingHelper);
      await removeFromFirebaseWithUrlAndValue(`${HELPS_REQUESTED_DB}/${keyOfHelpRequest}/usersRequested`, uidOfRequestingHelper);
      await notifyUser(uidOfRequestingHelper,{type:"REJECT", screenToRedirect:"NONE", uidOfHelper:uidOfRequestingHelper,timeStamp: new Date().getTime(), idOfHelpRequest: keyOfHelpRequest});
    } else {
      Alert.alert("user already rejected");
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const { uidOfRequestingHelper } = props;
    const url = `users/${uidOfRequestingHelper}`;
    getDataFromFirebase(url).then((dataOfRequestingHelper) => {
      const {name, xp} = dataOfRequestingHelper.val();
      if(isSubscribed){
        setname(name);
        setXp(xp);
      }
    });
    return () => isSubscribed = false;
  }, []);

  return (
    <View>
      <View style={{ flex:1, flexDirection:'row'}}>
        <View style={{margin: 5}}>
          <ProfileLetter letter={`${name.substring(0,1)}`}/>
        </View>
        <View style={{ marginLeft: 5}}>
          <Text>{name}</Text>
          <BoxText leftText="XP" rightText={xp}></BoxText>
        </View>
        <View style={{ flex:1, flexDirection:'row'}}>
          <TouchableOpacity style={styles.accept} onPress={handleAccept}>
            <Icon name="check" size={20} color={FLAG_COLOR_GREEN}/>
            <Text style={{color:FLAG_COLOR_GREEN}}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reject} onPress={handleReject}>
            <Icon name="remove" size={20} color="red" />
            <Text style={{color:'red'}}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Requester;

const styles = StyleSheet.create({
    text:{
      fontSize: 15,
      textAlign:'center'
    },
    requestedUserDetailsContaner:{
      flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      marginTop: 5
    },
    accept:{
      flex:1,
      flexDirection: 'row',
      borderColor:FLAG_COLOR_GREEN,
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:5
    },
    reject:{
      flex:1,
      flexDirection: 'row',
      borderColor:'red',
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:5
    }
  });