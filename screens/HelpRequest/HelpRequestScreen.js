
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useMutation, useLazyQuery } from 'react-apollo';
import { useAuth } from '../../customHooks';
import { ProfileLetter } from '../../components/atoms';
import { WHITE, ORANGE, LIGHTEST_GRAY } from '../../styles/colors';
import { CustomModal, Message, TimeAndDistance } from '../../components/molecules';
import { POLL_INTERVAL } from '../../config';
import { getRatings, getTimeDiffrence } from '../../utils';
import { Container, Header, Content, Footer, StyleProvider, Button, Text, Title, View } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

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
    usersRejected {
        uid
    },
    usersCancelled {
        uid
    }
    timeStamp,
    noPeopleRequired,
    latitude,
    longitude,
    creatorName
  }
}
`;

const REQUEST_TO_HELP = gql`
    mutation RequestToHelp($idOfHelpRequest:String!, $uid: String!, $username: String!, $xp: Int!, $stars: Int!, $mobileNo:String!) {
        requestToHelp(idOfHelpRequest:$idOfHelpRequest, userDetails: {
            uid: $uid,
            username: $username,
            xp: $xp,
            stars: $stars,
            mobileNo: $mobileNo
        }) {
            _id
        }
    }
`;

const USER_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid){
            xp,
            stars,
            totalRaters,
        }
    }
`;

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const HelpRequestScreen = ({ route }) => {
    const { params } = route;
    const { idOfHelpRequest, distance } = params;
    const { data } = useQuery(QUERY, { variables: { id: idOfHelpRequest }, pollInterval: POLL_INTERVAL });
    const [requestToHelp, { loading, error }] = useMutation(REQUEST_TO_HELP);
    const [getUserData, { data: userData }] = useLazyQuery(USER_QUERY, { pollInterval: POLL_INTERVAL });
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            const {uid} = user;
            getUserData({variables: { uid }})
        }
    }, [user])

    if(!user || !data) return <CustomModal variant="loading" />
    const { uid, attributes, username } = user;
    const { phone_number} = attributes;
    const { help } = data;
    const { description, timeStamp, usersRequested, creatorName, usersRejected, usersAccepted, usersCancelled } = help;
    
    const handleHelp = () => {
        if(!loading) {
            const { user } = userData;
            const { xp, stars, totalRaters } = user;
            requestToHelp({
                variables: {
                    idOfHelpRequest,
                    uid,
                    username,
                    mobileNo: phone_number,
                    xp,
                    stars: getRatings(stars, totalRaters)
                }
            })
        }
    }

    const yesOrNoToHelp = () => {
        Alert.alert(
            'Do you want to help?',
            'You can only help if help requester accept your contribution request',
            [
              {
                text: 'No',
                onPress: () => {},
                style: 'cancel'
              },
              {
                text: 'Yes',
                onPress: () => handleHelp(),
              },
            ],
            { cancelable: false }
        );
    }

    let footer;
    if(error) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message>something went wrong</Message></Footer>
    } else if(loading || !userData) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message loading={true}>Please wait</Message></Footer>
    } else if(isUserIsThereInUsers(usersRequested, uid)) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message>Verification pending</Message></Footer>
    } else if(isUserIsThereInUsers(usersRejected, uid)) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message>You can't help(Rejected)</Message></Footer>
    } else if((isUserIsThereInUsers(usersAccepted, uid))) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message>Your already helping this guy</Message></Footer>
    } else if(isUserIsThereInUsers(usersCancelled, uid)) {
        footer = <Footer style={{ backgroundColor: LIGHTEST_GRAY }}><Message>You Rejected to help this guy</Message></Footer>
    } else {
        footer = <Button primary full large onPress={yesOrNoToHelp}><Text>Help</Text></Button>
    }

    return (
        <StyleProvider style={getTheme(material)}>
            <Container>
                <Header style={{ backgroundColor: WHITE, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ProfileLetter letter={creatorName.substring(0,1).toUpperCase()} size={40} />
                    <View style={{ width: 3, backgroundColor: ORANGE, borderRadius: 1.5, height: 25, marginHorizontal: 15 } }><Text /></View>
                    <View>
                        <Title style={{ color: ORANGE }}>{creatorName}</Title>
                        <TimeAndDistance timeStamp={timeStamp} distance={distance} />
                    </View>
                </Header>
                <Content style={{ margin: 10 }}>
                    <Text>{description}</Text>
                </Content>
                {footer}
            </Container>
        </StyleProvider>
    );
}

export default HelpRequestScreen;
