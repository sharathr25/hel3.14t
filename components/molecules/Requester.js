import React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { ProfileLetter, RightButton, WrongButton } from '../atoms';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { useAuth } from '../../customHooks';
import { FONT_SIZE_16, FONT_WEIGHT_BOLD } from '../../styles/typography';

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

  const [updateHelpForAccept, { loading: loadingForAccept }] = useMutation(QUERY);
  const [updateHelpForReject, { loading: loadingForReject }] = useMutation(QUERY);

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

  const { container, content, details, nameStyle, detailsText, buttons } = styles;

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
        <WrongButton onPress={handleReject} loading={loadingForReject} />
        <RightButton onPress={handleAccept} loading={loadingForAccept} />
      </View>
    </View>
  );
};

export default Requester;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    display: 'flex',
    flex: 5,
    flexDirection: 'row',
  },
  details: {
    flexDirection: 'column',
  },
  nameStyle: {
    fontSize: FONT_SIZE_16,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  buttons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});