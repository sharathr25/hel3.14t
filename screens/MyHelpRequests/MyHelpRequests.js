// @flow
import React from 'react';
import { FlatList, View } from 'react-native';
import { UserHelpRequestCard } from '../../components/oraganisms';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import type { DocumentNode } from 'graphql';
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from "../../customHooks";
import { FullScreenLoader } from '../../components/atoms';

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
type HelpsProps = {
    queryGql: DocumentNode,
    subscriptionGql: DocumentNode,
    currentUser: Object
}

const Helps = (props:HelpsProps) => {
    const { queryGql, subscriptionGql, currentUser } = props;
    const subscriptionData = useSubscription(subscriptionGql);

    const { uid } = currentUser;

    const { data, error } = useQuery(queryGql, { variables: { uid } });

    const updatedUser = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateUser || null;

    if (!data) return null;

    let { user } = data;

    if (updatedUser) {
        if (updatedUser.uid === uid) {
            user = { ...data.user, ...updatedUser }
        }
    }
    let { createdHelpRequests, helpedHelpRequests } = user;

    const getHelpRequest = ({ item }) => <UserHelpRequestCard keyOfHelpRequest={item} />

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <FlatList
                data={createdHelpRequests || helpedHelpRequests}
                renderItem={getHelpRequest}
                keyExtractor={(item, index) => item.key + index.toString()}
            />
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

function MyHelpRequestsScreen() {
    const { user } = useAuth();
    if(!user) return <FullScreenLoader /> 
    return (
        <Tab.Navigator tabBarOptions={{ indicatorStyle: { backgroundColor: ORANGE } }}>
            <Tab.Screen name="Requested" children={() => <Helps queryGql={REQUESTED_HELPS_QUERY} subscriptionGql={REQUESTED_HELPS_SUBSCRPTION} currentUser={user} />} />
            {/* <Tab.Screen name="Helping" children={() => <Helps queryGql={HELPING_HELPS_QUERY} subscriptionGql={HELPING_HELPS_SUBSCRPTION} currentUser={user} />} /> */}
        </Tab.Navigator>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    );
}

export default MyHelpRequestsScreen;
