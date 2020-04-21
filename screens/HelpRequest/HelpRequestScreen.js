// @flow
import React from 'react';
import { Dimensions, View } from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { useAuth } from '../../customHooks';
import { FullScreenLoader, Description, Button, Heading } from '../../components/atoms';
import { WHITE, LIGHTEST_GRAY, ORANGE, LIGHT_GRAY } from '../../styles/colors';
import { ProfileName, TimeAndDistance } from '../../components/molecules';
import { margin } from '../../styles/mixins';
import { FONT_SIZE_20 } from '../../styles/typography';

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
    timeStamp,
    noPeopleRequired,
    latitude,
    longitude,
    creatorName
  }
}
`;

const HELP_UPDATE_SCHEMA = gql`
  mutation UpdateHelp($id:String!,$key:String!,$value:Any){
    updateHelp(id:$id,key:$key,value:$value, type:"array", operation:"push"){
      _id
    }
  }
`;

const FooterMessage = ({children}) => {
    return (
        <View style={{alignItems: 'center' }}>
            <Heading color={LIGHT_GRAY} size={FONT_SIZE_20}>{children}</Heading>
        </View>
    );
}

const isUserIsThereInUsers = (users, userUid) => users.some((user) => user.uid === userUid);

const HelpRequestScreen = ({ route } : { route: Object }) => {
    const { params } = route;
    const { idOfHelpRequest } = params;
    const { data, loading, error } = useQuery(QUERY, { variables: { id: idOfHelpRequest }, pollInterval: 100 });
    const [updateHelp, { loading: loadingForUpdateHelp }] = useMutation(HELP_UPDATE_SCHEMA);
    const { user } = useAuth();

    if(!user) return <FullScreenLoader />
    const { uid, attributes, username } = user;
    const { name , phone_number} = attributes;

    if (!data) return null;
    const { help } = data;
    const { description, distance, timeStamp, usersRequested, creatorName, usersRejected, usersAccepted } = help;
    
    const handleHelp = () => {
        if(!loadingForUpdateHelp)
            updateHelp({ variables: { id: idOfHelpRequest, key: "usersRequested", value: { uid, name , xp: 0, mobileNo: phone_number , stars: 0, username } } });
    }

    let footer;
    if(isUserIsThereInUsers(usersRequested, uid)) {
        footer = <FooterMessage>Verification pending</FooterMessage>
    } else if(isUserIsThereInUsers(usersRejected, uid)) {
        footer = <FooterMessage>You can't help(Rejected)</FooterMessage>
    } else if((isUserIsThereInUsers(usersAccepted, uid))) {
        footer = <FooterMessage>Your already helping this guy</FooterMessage>
    } else {
        footer = (
            <View style={{flexDirection: "row", justifyContent: 'flex-end' }}>
                <Button bgColor={LIGHTEST_GRAY}>Refer</Button>
                <View style={{width: 10}} />
                <Button onPress={handleHelp} loading={loadingForUpdateHelp} bgColor={ORANGE} textColor={WHITE}>Help</Button>
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
            <View style={{backgroundColor: LIGHTEST_GRAY, ...margin(10,20,10,20) }}>
                {footer}
            </View>
        </View>
    );
}

export default HelpRequestScreen;
