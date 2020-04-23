import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, Button, InlineLoader } from '../../components/atoms';
import { TimeAndStatus, UsersAccepted, UsersRequested, Creator } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, GREEN, RED, LIGHT_GRAY } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { openMapsAppWithLatLng } from '../../utils';
import Accepter from '../../components/molecules/Accepter';
import { FONT_SIZE_20 } from '../../styles/typography';
import { useAuth } from '../../customHooks';

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
      creator,
      creatorName,
      mobileNo
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
      usersRejected {
        uid
      }
      timeStamp,
      noPeopleRequired,
      latitude,
      longitude
    }
  }
`;

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const UserContributionScreen = ({ route } : { route: Object }) => {
    const { params } = route;
    const { keyOfHelpRequest } = params;
    const { user } = useAuth();
    let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: 100 });
    // const [updateHelp, { loading: loadingForUpdateHelp }] = useMutation(UPDATE_HELP_QUERY);

    if (!data || !user) return null;

    const { help } = data;
    const { 
      status, 
      usersRequested, 
      usersRejected,
      usersAccepted, 
      description, 
      timeStamp, 
      creator,
      creatorName,
      mobileNo } = help;

    const userDetails = {
      username: creatorName, 
      mobileNo,
      stars: 0, 
      uidOfAccepter: creator
    }

    const helpRequestDetails = {
      keyOfHelpRequest,
      status
    }

    let message = "";

    if(isUserIsThereInUsers(usersRequested, user.uid)) message = "Your are in waiting list"
    else if(isUserIsThereInUsers(usersAccepted, user.uid)) message = "Your got accepted, You can help him"
    else if(isUserIsThereInUsers(usersRejected, user.uid)) message = "You got rejected, Sorry"

    const handleNavigate = () => {
        openMapsAppWithLatLng(latitude, longitude)
    }

    const { CTAContainerStyle } = styles;

    return (
        <ScrollView style={{ backgroundColor: WHITE }}>
          <View style={{ margin: 10 }}>
            <Description height={200}>{description}</Description>
            <TimeAndStatus timeStamp={timeStamp} status={status} />
            <View style={CTAContainerStyle}>
              <Heading>Event Location</Heading>
              <Button bgColor={LIGHTEST_GRAY} onPress={handleNavigate}>Navigate</Button>
            </View>
            <View style={{alignItems: 'center', backgroundColor: LIGHTEST_GRAY, padding: 10 }}>
              <Heading color={LIGHT_GRAY} size={FONT_SIZE_20}>{message}</Heading>
            </View>
            <Heading>Creator Details</Heading>
            <Creator userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
          </View>
        </ScrollView>
    );
}

export default UserContributionScreen;

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