// @flow
import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useMutation, useLazyQuery } from 'react-apollo';
import { useAuth } from '../../customHooks';
import { Description, Button } from '../../components/atoms';
import { WHITE, ORANGE } from '../../styles/colors';
import { ProfileName, TimeAndDistance, CustomModal, Message } from '../../components/molecules';
import { POLL_INTERVAL } from '../../config';
import { getRatings } from '../../utils';

const heightForDescription = Dimensions.get('screen').height - 380

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

const HelpRequestScreen = ({ route } : { route: Object }) => {
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

    let footer;
    if(error) {
        footer = <Message>something went wrong</Message>
    } else if(loading || !userData) {
        footer = <Message loading={true}>Please wait</Message>
    } else if(isUserIsThereInUsers(usersRequested, uid)) {
        footer = <Message>Verification pending</Message>
    } else if(isUserIsThereInUsers(usersRejected, uid)) {
        footer = <Message>You can't help(Rejected)</Message>
    } else if((isUserIsThereInUsers(usersAccepted, uid))) {
        footer = <Message>Your already helping this guy</Message>
    } else if(isUserIsThereInUsers(usersCancelled, uid)) {
        footer = <Message>You Rejected to help this guy</Message>
    } else {
        footer = (
            <View style={{ alignItems: 'center', padding: 10 }}>
                <Button onPress={handleHelp} bgColor={ORANGE} textColor={WHITE}>Help</Button>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 5, backgroundColor: WHITE, padding: 20 }}>
                <ProfileName name={creatorName} />
                <View style={{height: 20 }} />
                <Description height={heightForDescription}>{description}</Description>
                <TimeAndDistance timeStamp={timeStamp} distance={distance} />
            </View>
            {footer}
        </View>
    );
}

export default HelpRequestScreen;
