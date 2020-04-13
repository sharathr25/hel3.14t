// @flow
import React from 'react';
import { FlatList, View } from 'react-native';
import { UserHelpRequest } from '../../components/molecules';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import type { DocumentNode } from 'graphql';
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from "../../customHooks";

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
    subscriptionGql: DocumentNode
}

const Helps = (props:HelpsProps) => {
    const { user: currentUser } = useAuth();
    
    const { uid } = currentUser;
    const { queryGql, subscriptionGql } = props;

    const { data, error } = useQuery(queryGql, { variables: { uid } });

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

    const getHelpRequest = ({ item }) => <UserHelpRequest keyOfHelpRequest={item} showDone={createdHelpRequests ? true : false} />

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
    return (
        <Tab.Navigator tabBarOptions={{ indicatorStyle: { backgroundColor: ORANGE } }}>
            <Tab.Screen name="Requested" children={() => <Helps queryGql={REQUESTED_HELPS_QUERY} subscriptionGql={REQUESTED_HELPS_SUBSCRPTION} />} />
            <Tab.Screen name="Helping" children={() => <Helps queryGql={HELPING_HELPS_QUERY} subscriptionGql={HELPING_HELPS_SUBSCRPTION} />} />
        </Tab.Navigator>
    );
}

export default MyHelpRequestsScreen;
