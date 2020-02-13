import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GREEN, RED } from '../../../constants/styleConstants';
import ProfileLetter from '../../common/profileLetter';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useAuth } from '../../../customHooks';

const Requester = props => {
  const { user: currentUser } = useAuth();
  const { phoneNumber } = currentUser;
  const { uidOfRequester, keyOfHelpRequest, usersAccepted, noPeopleRequired, xp, name, stars } = props;

  const QUERY = gql`
    mutation UpdateHelp($key:String!, $value:Any, $operation:String!){
      updateHelp(id:"${keyOfHelpRequest}", key:$key, value:$value, type:"array", operation:$operation){
        _id
      }
    }
  `;

  const [updateHelpForAccept, { loadingForAccept }] = useMutation(QUERY);
  const [updateHelpForReject, { loadingForReject }] = useMutation(QUERY);

  const handleAccept = async () => {
    if (noPeopleRequired === usersAccepted.length) {
      Alert.alert("Users filled....")
    } else if (usersAccepted.indexOf(uidOfRequester) > -1) {
      Alert.alert("You are already helping....");
    } else {
      updateHelpForAccept({ variables: { key: "usersAccepted", value: { uid: uidOfRequester, name, mobileNo: phoneNumber }, operation: "push" } });
    }
  };

  const handleReject = async () => {
    updateHelpForReject({ variables: { key: "usersRejected", value: { uid: uidOfRequester }, operation: "push", type: "array" } });
  };

  const firstLetterOfName = name.substring(0, 1);

  const { container, content, details, nameStyle, detailsText, reject, accept, buttons } = styles;

  return (
    <View style={container}>
      <View style={content}>
      <ProfileLetter letter={firstLetterOfName} />
        <View style={details}>
          <Text style={nameStyle}>{name}</Text>
          <Text style={detailsText}>{xp} XP</Text>
          <Text style={detailsText}>{stars} Stars</Text>
          <Text style={detailsText}></Text>
        </View>
      </View>
      <View style={buttons}>
        <TouchableOpacity style={reject} onPress={handleReject}>
          {
            loadingForReject
              ? <ActivityIndicator size={20} color={RED} />
              : <Icon name="remove" size={20} color={RED} />
          }
        </TouchableOpacity>
        <TouchableOpacity style={accept} onPress={handleAccept}>
          {
            loadingForAccept
              ? <ActivityIndicator size={20} color={GREEN} />
              : <Icon name="check" size={20} color={GREEN} />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Requester;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  nameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
  },
  accept: {
    width: 40,
    height: 40,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: GREEN,
    margin: 10,
    borderRadius: 20
  },
  reject: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RED,
    margin: 10,
    borderRadius: 20
  }
});