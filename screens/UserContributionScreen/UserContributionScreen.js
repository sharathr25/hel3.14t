import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, Button } from '../../components/atoms';
import { TimeAndStatus, Creator, CustomModal } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, LIGHT_GRAY } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { openMapsAppWithLatLng } from '../../utils';
import { FONT_SIZE_20 } from '../../styles/typography';
import { useAuth } from '../../customHooks';

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

    if (!data || !user) return <CustomModal variant="loading" />;
    if(error) return <CustomModal variant="error" />

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

    const userDetails = {
      creatorName, 
      mobileNo,
      stars: getStarsGivenForCreator(), 
      uidOfCreator: creator,
      uidOfAccepter : user.uid
    }
    const helpRequestDetails = { keyOfHelpRequest, status }

    const getMessage = () => {
      if(status === "COMPLETED") return "Awesome, Help satisfied"
      else if(isUserIsThereInUsers(usersRequested, user.uid)) return "Your are in waiting list"
      else if(isUserIsThereInUsers(usersAccepted, user.uid)) return "You got accepted, You can help him"
      else if(isUserIsThereInUsers(usersRejected, user.uid)) return "You got rejected, Sorry"
      return "";
    }
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
              <Heading color={LIGHT_GRAY} size={FONT_SIZE_20}>{getMessage()}</Heading>
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