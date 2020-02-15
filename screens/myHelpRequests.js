import React from 'react';
import { FlatList, View, Text } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import { useAuth } from '../customHooks';
import { WHITE, ORANGE } from '../constants/styleConstants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const REQUESTED_HELPS_QUERY = gql`
query User($uid: String!) {
    user(uid:$uid) {
        createdHelpRequests
    }
}
`;

const REQUESTED_HELPS_SUBSCRPTION = gql`
subscription{
onUpdateUser{
    uid,
    createdHelpRequests
} 
}
`;

const HELPING_HELPS_QUERY = gql`
query User($uid: String!){
    user(uid:$uid) {
        helpedHelpRequests
    }
}
`;

const HELPING_HELPS_SUBSCRPTION = gql`
subscription{
    onUpdateUser{
        uid,
        helpedHelpRequests
    } 
    }
`;

const Helps = (props) => {
    const { user: currentUser } = useAuth();
    const { uid } = currentUser;
    const { queryGql, subscriptionGql } = props;

    const { data } = useQuery(queryGql, { variables: { uid } });

    const subscriptionData = useSubscription(subscriptionGql);

    const updatedUser = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateUser || null;

    if (!data) return null;

    let { user } = data;

    if (updatedUser) {
        if (updatedUser.uid === uid) {
            user = { ...data.user, ...updatedUser }
        }
    }
    let { createdHelpRequests, helpedHelpRequests } = user;

    getHelpRequest = ({ item }) => <HelpRequest keyOfHelpRequest={item} showDone={createdHelpRequests ? true : false} />

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <FlatList
                data={createdHelpRequests || helpedHelpRequests}
                renderItem={getHelpRequest}
                keyExtractor={(item, index) => item.key + index.toString()}
                listKey={(item, index) => item.key + index.toString()}
            />
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

function MyHelpRequestsScreen(props) {
    return (
        <Tab.Navigator tabBarOptions={{ indicatorStyle: { backgroundColor: ORANGE } }}>
            <Tab.Screen name="Requested" children={() => <Helps queryGql={REQUESTED_HELPS_QUERY} subscriptionGql={REQUESTED_HELPS_SUBSCRPTION} />} />
            <Tab.Screen name="Helping" children={() => <Helps queryGql={HELPING_HELPS_QUERY} subscriptionGql={HELPING_HELPS_SUBSCRPTION} />} />
        </Tab.Navigator>
    );
}

export default MyHelpRequestsScreen;
