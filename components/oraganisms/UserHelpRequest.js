import React from 'react';
import { Text, View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useQuery, useSubscription, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import Requester from '../molecules/Requester';
import Accepter from '../molecules/Accepter';
import { Description, Heading, Button } from '../atoms';
import { TimeAndStatus } from "../molecules";
import { WHITE, LIGHT_GRAY, LIGHTEST_GRAY, GREEN, RED } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { openMapsAppWithLatLng } from '../../utils';

const SUBSCRIPTION = gql`
    subscription{
      onUpdateHelp{
        _id,
        status,
        timeStamp,
        usersAccepted {
          uid
          name
          mobileNo,
          xp,
          stars
        },
        usersRequested {
          uid
          name,
          mobileNo,
          xp,
          stars
        },
    }
  }
  `;

  const UPDATE_HELP_QUERY = gql`
    mutation UpdateHelp($key:String!, $value:Any, $type:String!, $operation:String!, $id: String!){
        updateHelp(id:$id, key:$key, value:$value, type:$type, operation:$operation){
            _id
        }
    }
`;

  const QUERY = gql`
    query Help($id: String!){
      help(id:$id) {
        status,
        description,
        usersAccepted {
          uid
          name
          mobileNo
          xp
          stars
        },
        usersRequested {
          uid
          name,
          xp,
          mobileNo,
          stars
        },
        timeStamp,
        noPeopleRequired,
        latitude,
        longitude
      }
    }
  `;

  const INCREMENT_XP_FOR_USER = gql`
    mutation IncrementXpForUser($uid:String!) {
        incrementXpForUser(uid:$uid) {
            xp
        }
    }
`;

const getUpdatedData = (newData, oldData, keyOfHelpRequest) => {
  const { _id } = newData;
    if (_id === keyOfHelpRequest) {
      return { ...oldData, ...newData }
    }
    return oldData;
}

const UserHelpRequest = (props) => {
  const { keyOfHelpRequest, showDone = true } = props;
  let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: 500});
  const subscriptionData = useSubscription(SUBSCRIPTION, { shouldResubscribe: true });
  const [updateHelp, { }] = useMutation(UPDATE_HELP_QUERY);
  const [incrementXpForUser, { }] = useMutation(INCREMENT_XP_FOR_USER);

  if (!data) return null;
  if(subscriptionData.data) {
    data.help = getUpdatedData(subscriptionData.data.onUpdateHelp, data.help, keyOfHelpRequest);
  }

  const { help } = data;
  const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired, latitude, longitude } = help;

  getRequestedUser = ({ item }) => {
    const { name, xp, uid, stars, mobileNo } = item;
    return <Requester 
      uidOfRequester={uid} 
      name={name} xp={xp} 
      stars={stars} 
      keyOfHelpRequest={keyOfHelpRequest} 
      usersAccepted={usersAccepted} 
      noPeopleRequired={noPeopleRequired} 
      mobileNo={mobileNo}
    />
  }

  getAcceptedUser = ({ item }) => {
    const { name, mobileNo, stars, uid } = item;
    return <Accepter 
      name={name} 
      mobileNo={mobileNo} 
      status={status} 
      stars={stars} 
      keyOfHelpRequest={keyOfHelpRequest} 
      uidOfAccepter={uid} 
    />
  }

  getRequestedUserKey = (item, index) => {
    return "requestedusers" + item.key + index.toString() + new Date().getTime();
  }

  getAcceptedUserKey = (item, index) => {
    return "acceptedusers" + item.key + index.toString() + new Date().getTime();
  }

  const handleCancel = () => {
    updateHelp({ variables: { key: "status", value: "CANCELLED", type: "update", operation: "update", id: keyOfHelpRequest } });
    // TODO : send notification to accepted users if any that notification is closed either in app or backend 
  }

  const handleRepost = () => {
    updateHelp({ variables: { key: "", value: { status: "REQUESTED", timeStamp: new Date().getTime() }, type: "update", operation: "update", id: keyOfHelpRequest } });
  }

  const updateHelpRequestAndUsers = async () => {
    updateHelp({ variables: { key: "status", value: "COMPLETED", type: "update", operation: "update", id: keyOfHelpRequest } });
    usersAccepted.forEach((user) => {
        const { uid } = user;
        incrementXpForUser({ variables: { uid } });
    });
  }

  const handleFinish = async () => {
    await updateHelpRequestAndUsers();
  }

  const handleNavigate = () => {
    openMapsAppWithLatLng(latitude, longitude)
  }

  const { CTAContainerStyle } = styles;
  const statusToCTAMapping = {
    'REQUESTED': (
      <View style={CTAContainerStyle}>
        <Heading>If no need of help</Heading>
        <Button bgColor={LIGHTEST_GRAY} onPress={handleCancel} borderColor={RED} textColor={RED}> Cancel </Button>
      </View>
    ),
    'ON_GOING': (
      <View style={CTAContainerStyle}>
        <Heading>If requested help satisfied</Heading>
        <Button onPress={handleFinish} bgColor={LIGHTEST_GRAY} borderColor={GREEN} textColor={GREEN}> Finish </Button>
      </View>
    ),
    'COMPLETED': null,
    'CANCELLED': (
      <View style={CTAContainerStyle}>
        <Heading>If help required again</Heading>
        <Button bgColor={LIGHTEST_GRAY} onPress={handleRepost}> Repost </Button>
      </View>
    ),
  }

  if (!status) return null;

  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View style={{ margin: 10 }}>
        <Description height={200}>{description}</Description>
        <TimeAndStatus timeStamp={timeStamp} status={status} />
        <View style={CTAContainerStyle}>
          <Heading>Event Location</Heading>
          <Button bgColor={LIGHTEST_GRAY} onPress={handleNavigate}>Navigate</Button>
        </View>
        {statusToCTAMapping[status]}
        <View>
          <FlatList
            data={usersRequested}
            renderItem={getRequestedUser}
            keyExtractor={getRequestedUserKey}
            listKey={getRequestedUserKey}
            ListHeaderComponent={usersRequested.length ? <Heading>People who are willing to help you</Heading> : null}
          />
        </View>
        <View>
          <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            listKey={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Heading>People who are helping</Heading> : null}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default UserHelpRequest;

const styles = StyleSheet.create({
  CTAContainerStyle: {
    flexDirection: 'row', 
    alignItems: 'center' , 
    backgroundColor: LIGHTEST_GRAY, 
    ...margin(10,0,10,0), 
    padding: 10,
    justifyContent: 'space-between'
  }
});