// @flow
import React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { BoxButton, Heading, InlineLoader } from '../atoms';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { FONT_BOLD } from '../../styles/typography';
import { ORANGE, BLACK, GREEN, LIGHT_GREEN, RED, LIGHT_RED, LIGHTEST_GRAY } from '../../styles/colors';
import { margin } from '../../styles/mixins';

type RequesterProps = {
  userDetails: {
    username:string, 
    xp: number, 
    stars:number, 
    mobileNo:string, 
    uidOfRequester: string
  },
  helpRequestDetails: {
    keyOfHelpRequest: string, 
    noPeopleRequired: number, 
    usersAccepted: Array<Object>
  }
}

const QUERY = gql`
  mutation UpdateHelp($id:String!, $key:String!, $value:Any){
    updateHelp(id:$id, key:$key, value:$value, type:"array", operation:"push"){
      _id
    }
  }
`;

const Requester = (props: RequesterProps) => {
  const { userDetails, helpRequestDetails } = props;
  const { keyOfHelpRequest, usersAccepted, noPeopleRequired } = helpRequestDetails;
  const { uidOfRequester, xp, mobileNo, stars, username, pushNotificationToken } = userDetails;
  const [updateHelpForAccept, { loading: loadingForAccept }] = useMutation(QUERY, { variables: { id: keyOfHelpRequest }});
  const [updateHelpForReject, { loading: loadingForReject }] = useMutation(QUERY, { variables: { id: keyOfHelpRequest }});

  const handleAccept = async () => {
    if (noPeopleRequired === usersAccepted.length) {
      Alert.alert("Users filled....")
    } else if (usersAccepted.indexOf(uidOfRequester) > -1) {
      Alert.alert("You are already helping....");
    } else {
      updateHelpForAccept({ 
        variables: { 
          id: keyOfHelpRequest,
          key: "usersAccepted", 
          value: { uid: uidOfRequester, mobileNo, username, pushNotificationToken }, 
        } 
      });
    }
  };

  const handleReject = async () => {
    updateHelpForReject({ 
      variables: { 
        id: keyOfHelpRequest,
        key: "usersRejected", 
        value: { uid: uidOfRequester, pushNotificationToken }, 
      } 
    });
  };

  const { container, content, details, buttons } = styles;

  if(loadingForAccept || loadingForReject) {
    return (
      <View style={{...container, padding: 25 }}>
        <InlineLoader />
      </View>
    )
  }

  return (
    <View style={container}>
      <View style={content}>
        <View style={details}>
          <Heading color={ORANGE}>{username}</Heading>
          <Text><Text style={{...FONT_BOLD , color:BLACK }}>{xp}</Text> Earned XP</Text>
          <Text><Text style={{...FONT_BOLD , color:BLACK }}>{stars}</Text> Average rating</Text>
        </View>
      </View>
      <View style={buttons}>
        <BoxButton 
          title="Accept" 
          titleColor={GREEN} 
          bgColor={LIGHT_GREEN} 
          onPress={handleAccept} 
          loading={loadingForAccept} 
          iconName="check"
        />
        <BoxButton 
          title="Reject" 
          titleColor={RED} 
          bgColor={LIGHT_RED} 
          onPress={handleReject} 
          loading={loadingForReject} 
          iconName="remove"  
        />
      </View>
    </View>
   );
};

export default Requester;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: LIGHTEST_GRAY,
    justifyContent: 'space-between',
    ...margin(5,0,5,0)
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5
  },
  details: {
    flexDirection: 'column',
  },
  buttons: {
    flexDirection: 'row',
  },
});