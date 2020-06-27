import React from 'react';
import { StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Description, Heading, InlineLoader } from '../../components/atoms';
import { TimeAndStatus, UsersAccepted, UsersRequested, EventLocation } from "../../components/molecules";
import { WHITE, LIGHTEST_GRAY, GREEN, RED } from '../../styles/colors';
import { margin } from '../../styles/mixins';
import { POLL_INTERVAL } from '../../config';
import { StyleProvider, Container, Content } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { Button, Text, View } from 'native-base';

const FINISH_HELP = gql`
  mutation FinishHelp($idOfHelpRequest:String!) {
    finishHelp(idOfHelpRequest:$idOfHelpRequest) {
        _id
    }
  }
`;

const REPOST_HELP = gql`
  mutation RepostHelp($idOfHelpRequest:String!) {
    repostHelp(idOfHelpRequest:$idOfHelpRequest) {
        _id
    }
  }
`;

const CANCEL_HELP = gql`
  mutation CancelHelp($idOfHelpRequest:String!) {
    cancelHelp(idOfHelpRequest:$idOfHelpRequest) {
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
        stars,
        pushNotificationToken
      },
      timeStamp,
      noPeopleRequired,
      latitude,
      longitude
    }
  }
`;

const UserHelpRequestScreen = ({ route }) => {
    const { params } = route;
    const { keyOfHelpRequest } = params;
    let { data } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: POLL_INTERVAL });
    const [finishHelp, { loading: loadingForFinsihHelp }] = useMutation(FINISH_HELP);
    const [repostHelp, { loading: loadingForRepostHelp }] = useMutation(REPOST_HELP);
    const [cancelHelp, { loading: loadingForCancelHelp }] = useMutation(CANCEL_HELP);

    if (!data) return null;

    const { help } = data;
    const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired, latitude, longitude } = help;

    const handleCancel = () => {
      cancelHelp({ variables: { idOfHelpRequest: keyOfHelpRequest }})
    }

    const handleRepost = () => {
      repostHelp({ variables: { idOfHelpRequest: keyOfHelpRequest }})
    }

    const handleFinish = () => {
      finishHelp({ variables: { idOfHelpRequest: keyOfHelpRequest }})
    }

    const { CTAContainerStyle } = styles;
    const statusToCTAMapping = {
        'REQUESTED': (
        <View style={CTAContainerStyle}>
            <Heading>If help not required</Heading>
            <Button onPress={handleCancel} danger bordered><Text>Cancel</Text></Button>
        </View>
        ),
        'ON_GOING': (
        <View style={CTAContainerStyle}>
            <Heading>If requested help satisfied</Heading>
            <Button onPress={handleFinish} success bordered><Text>End</Text></Button>
        </View>
        ),
        'COMPLETED': null,
        'CANCELLED': (
        <View style={CTAContainerStyle}>
            <Heading>If help required again</Heading>
            <Button onPress={handleRepost} primary bordered><Text>Repost</Text></Button>
        </View>
        ),
    }

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Content style={{ margin: 10 }} contentContainerStyle={{ flexGrow: 1 }}>
            <Description height={300}>{description}</Description>
            <TimeAndStatus timeStamp={timeStamp} status={status} />
            <EventLocation latitude={latitude} longitude={longitude} />
            {
              loadingForFinsihHelp || loadingForRepostHelp || loadingForCancelHelp
                ?  <View style={{...CTAContainerStyle, padding: 20 }}><InlineLoader /></View> 
                : statusToCTAMapping[status]
            }
            <UsersRequested usersRequested={usersRequested} keyOfHelpRequest={keyOfHelpRequest} noPeopleRequired={noPeopleRequired} usersAccepted={usersAccepted} />
            <UsersAccepted usersAccepted={usersAccepted} keyOfHelpRequest={keyOfHelpRequest} status={status} />
          </Content>
        </Container>
      </StyleProvider>
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