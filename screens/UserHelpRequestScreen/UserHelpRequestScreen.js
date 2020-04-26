import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, Button, InlineLoader } from '../../components/atoms';
import { TimeAndStatus, UsersAccepted, UsersRequested, EventLocation } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, GREEN, RED } from '../../styles/colors';
import { margin } from '../../styles/mixins';

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
        username
        mobileNo
        xp
        stars
      },
      usersRequested {
        uid
        username
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

const UserHelpRequestScreen = ({ route } : { route: Object }) => {
    const { params } = route;
    const { keyOfHelpRequest } = params;
    let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: 100 });
    const [updateHelp, { loading: loadingForUpdateHelp }] = useMutation(UPDATE_HELP_QUERY);
    const [incrementXpForUser] = useMutation(INCREMENT_XP_FOR_USER);

    if (!data) return null;

    const { help } = data;
    const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired, latitude, longitude } = help;

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

    return (
        <ScrollView style={{ backgroundColor: WHITE }}>
          <View style={{ margin: 10 }}>
            <Description height={300}>{description}</Description>
            <TimeAndStatus timeStamp={timeStamp} status={status} />
            <EventLocation latitude={latitude} longitude={longitude} />
            {loadingForUpdateHelp ?  <View style={{...CTAContainerStyle, padding: 20 }}><InlineLoader /></View> : statusToCTAMapping[status]}
            <UsersRequested usersRequested={usersRequested} keyOfHelpRequest={keyOfHelpRequest} noPeopleRequired={noPeopleRequired} usersAccepted={usersAccepted} />
            <UsersAccepted usersAccepted={usersAccepted} keyOfHelpRequest={keyOfHelpRequest} status={status} />
          </View>
        </ScrollView>
    );
}

export default UserHelpRequestScreen;

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