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

const HELPING_HELPS_QUERY = gql`
query User($uid: String!){
    user(uid:$uid) {
        helpedHelpRequests
    }
}
`;

type HelpsProps = {
    queryGql: DocumentNode,
    currentUser: Object
}

const Helps = (props:HelpsProps) => {
    const { queryGql, currentUser } = props;
    const { uid } = currentUser;
    const { data, error, loading, refetch } = useQuery(queryGql, { variables: { uid }, pollInterval: 100 });
    if (!data) return null;
    let { user } = data;
    let { createdHelpRequests } = user;

    const getHelpRequest = ({ item }) => <UserHelpRequestCard keyOfHelpRequest={item} />

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <FlatList
                data={createdHelpRequests}
                renderItem={getHelpRequest}
                keyExtractor={(item, index) => item.key + index.toString()}
                refreshing={loading}
                onRefresh={refetch}
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
            <Tab.Screen name="Requested" children={() => <Helps queryGql={REQUESTED_HELPS_QUERY} currentUser={user} />} />
            {/* <Tab.Screen name="Helping" children={() => <Helps queryGql={HELPING_HELPS_QUERY} currentUser={user} />} /> */}
        </Tab.Navigator>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    );
}

export default MyHelpRequestsScreen;
