import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, Button, InlineLoader } from '../../components/atoms';
import { TimeAndStatus, Creator, CustomModal, EventLocation, Message } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, LIGHT_GRAY, RED } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { FONT_SIZE_20 } from '../../styles/typography';
import { useAuth } from '../../customHooks';
import { POLL_INTERVAL } from '../../config';

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
        starsForCreator
      },
      usersRequested {
        uid
        username
        xp,
        mobileNo,
        stars,
      },
      usersRejected {
        uid
      },
      usersCancelled {
        uid
      }
      timeStamp,
      noPeopleRequired,
      latitude,
      longitude
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

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const UserContributionScreen = ({ route } : { route: Object }) => {
    const { params } = route;
    const { keyOfHelpRequest } = params;
    const { user } = useAuth();
    const [updateHelp, { loading: loadingForUpdateHelp }] = useMutation(UPDATE_HELP_QUERY);
    let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: POLL_INTERVAL });

    if (!data || !user) return <CustomModal variant="loading" />;
    if(error) return <CustomModal variant="error" />

    const { help } = data;
    const { 
      status, 
      usersRequested, 
      usersRejected,
      usersAccepted, 
      usersCancelled,
      description, 
      timeStamp, 
      creator,
      creatorName,
      mobileNo,
      latitude, 
      longitude
    } = help;

    const getStarsGivenForCreator = () => {
      acceptedUserData = usersAccepted.filter(acceptedUsers => acceptedUsers.uid === user.uid)
      if(acceptedUserData.length) {
        return acceptedUserData[0].starsForCreator;
      }
      return 0
    } 

    const getMessage = () => {
      if(status === "COMPLETED") return "Awesome, Help satisfied"
      else if(isUserIsThereInUsers(usersRequested, user.uid)) return "Your are in waiting list"
      else if(isUserIsThereInUsers(usersAccepted, user.uid)) return "You got accepted, You can help him"
      else if(isUserIsThereInUsers(usersRejected, user.uid)) return "You got rejected, Sorry"
      else if(isUserIsThereInUsers(usersCancelled, user.uid)) return "You rejected to help this guy"
      return "";
    }

    const handleCancel = () => {
      const key = isUserIsThereInUsers(usersAccepted, user.uid) ? "usersAccepted" : "usersRequested"
      updateHelp({ variables: {
        id: keyOfHelpRequest,
        key,
        operation: "pull",
        type: "array",
        value: { uid: user.uid }
      }})
    }

    const userDetails = {
      creatorName, 
      mobileNo,
      stars: getStarsGivenForCreator(), 
      uidOfCreator: creator,
      uidOfAccepter : user.uid
    }
    const helpRequestDetails = { keyOfHelpRequest, status }
    const { CTAContainerStyle } = styles;

    return (
        <ScrollView style={{ backgroundColor: WHITE }}>
          <View style={{ margin: 10 }}>
            <Description height={300}>{description}</Description>
            <TimeAndStatus timeStamp={timeStamp} status={status} />
            <EventLocation latitude={latitude} longitude={longitude} />
            <Message>{getMessage()}</Message>
            {
              (status === "REQUESTED" && !isUserIsThereInUsers(usersCancelled, user.uid)) 
              ?
                loadingForUpdateHelp 
                  ? <View style={{...CTAContainerStyle, padding: 20}}><InlineLoader /></View>
                  : <View style={CTAContainerStyle}>
                      <Heading color={LIGHT_GRAY} size={FONT_SIZE_20}>Change of mind</Heading>
                      <Button onPress={handleCancel} bgColor={LIGHTEST_GRAY} textColor={RED} borderColor={RED}>
                        Cancel
                      </Button>
                    </View>
              : null
            }
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