import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FLAG_COLOR_GREEN } from '../../../constants/styleConstants';
import ProfileLetter from '../../common/profileLetter';
import Icon from 'react-native-vector-icons/FontAwesome';
import BoxText from '../../common/boxText';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useAuth } from '../../../customHooks';

const Requester = props => {
  const { user:currentUser } = useAuth();
  const { phoneNumber } = currentUser;
  const { uidOfRequester, keyOfHelpRequest, usersAccepted, noPeopleRequired, xp, name } = props;

  const QUERY = gql`
    mutation UpdateHelp($key:String!, $value:Any, $operation:String!){
      updateHelp(id:"${keyOfHelpRequest}", key:$key, value:$value, type:"array", operation:$operation){
        _id
      }
    }
  `;

  const [updateHelp, { loading }] = useMutation(QUERY);

  const handleAccept = async () => {
    if (noPeopleRequired === usersAccepted.length) {
      Alert.alert("Users filled....")
    } else if (usersAccepted.indexOf(uidOfRequester) > -1) {
      Alert.alert("You are already helping....");
    } else {
      updateHelp({ variables: { key: "usersAccepted", value: { uid: uidOfRequester, name, mobileNo: phoneNumber }, operation: "push" } });
    }
  };

  const handleReject = async () => {
    updateHelp({ variables: { key:"usersRejected", value: {uid: uidOfRequester}, operation:"push", type:"array"}});
  };

  const firstLetterOfName = name.substring(0, 1);

  return (
    <View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ margin: 5 }}>
          <ProfileLetter letter={firstLetterOfName} />
        </View>
        <View style={{ marginLeft: 5 }}>
          <Text>{name}</Text>
          <BoxText leftText="XP" rightText={xp}></BoxText>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity style={styles.accept} onPress={handleAccept}>
            <Icon name="check" size={20} color={FLAG_COLOR_GREEN} />
            <Text style={{ color: FLAG_COLOR_GREEN }}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reject} onPress={handleReject}>
            <Icon name="remove" size={20} color="red" />
            <Text style={{ color: 'red' }}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Requester;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    textAlign: 'center'
  },
  requestedUserDetailsContaner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5
  },
  accept: {
    flex: 1,
    flexDirection: 'row',
    borderColor: FLAG_COLOR_GREEN,
    borderWidth: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  reject: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});