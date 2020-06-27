import React from 'react';
import { StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, InlineLoader } from '../../components/atoms';
import { TimeAndStatus, Creator, CustomModal, EventLocation, Message } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, LIGHT_GRAY, RED } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { FONT_SIZE_20 } from '../../styles/typography';
import { useAuth } from '../../customHooks';
import { POLL_INTERVAL } from '../../config';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { StyleProvider, Container, Content, Button, View, Text } from 'native-base';

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

const CANCEL_TO_HELP = gql`
  mutation CancelTOHelp($idOfHelpRequest:String!, $uid: String!) {
    cancelToHelp(idOfHelpRequest:$idOfHelpRequest, userDetails: {
      uid: $uid
    }) {
        _id
    }
  }
`;

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const UserContributionScreen = ({ route }) => {
    const { params } = route;
    const { keyOfHelpRequest } = params;
    const { user } = useAuth();
    let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: POLL_INTERVAL });
    const [cancelToHelp, { loading: loadingForCancelToHelp }] = useMutation(CANCEL_TO_HELP);
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
      if(status === "COMPLETED") return "Your contribution to help request ended please rate the help requester"
      else if(status === "CANCELLED") return "This request got cancelled"
      else if(isUserIsThereInUsers(usersRequested, user.uid)) return "Verification pending from help requester"
      else if(isUserIsThereInUsers(usersAccepted, user.uid)) return "Your Verified you can help now please contact help requester"
      else if(isUserIsThereInUsers(usersRejected, user.uid)) return "You got rejected, Sorry"
      else if(isUserIsThereInUsers(usersCancelled, user.uid)) return "You rejected to help this guy"
      return "";
    }

    const handleCancel = () => {
      const { uid } = user;
      cancelToHelp({
        variables: {
          idOfHelpRequest: keyOfHelpRequest,
          uid
        }
      })
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
        <StyleProvider style={getTheme(material)}>
          <Container>
            <Content style={{ margin: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
              <Description height={300}>{description}</Description>
              <TimeAndStatus timeStamp={timeStamp} status={status} />
              <EventLocation latitude={latitude} longitude={longitude} />
              <Message>{getMessage()}</Message>
              {
                (status === "REQUESTED" && !isUserIsThereInUsers(usersCancelled, user.uid)) 
                ?
                  loadingForCancelToHelp 
                    ? <View style={{...CTAContainerStyle, padding: 20}}><InlineLoader /></View>
                    : <View style={CTAContainerStyle}>
                        <Heading color={LIGHT_GRAY} size={FONT_SIZE_20}>If you can't help</Heading>
                        <Button onPress={handleCancel} danger bordered>
                          <Text>Cancel</Text>
                        </Button>
                      </View>
                : null
              }
              <Creator userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
            </Content>
          </Container>
        </StyleProvider>
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