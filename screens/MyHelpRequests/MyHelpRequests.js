// @flow
import React from 'react';
import { FlatList, View } from 'react-native';
import { UserHelpRequestCard, UserContributionCard } from '../../components/oraganisms';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { WHITE, ORANGE } from '../../styles/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useAuth } from "../../customHooks";
import { CustomModal } from '../../components/molecules';

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
    currentUser: Object
}


type ContributionsProps = {
    currentUser: Object
};

const MyHelps = (props:HelpsProps) => {
    const { currentUser } = props;
    const { uid } = currentUser;
    const { data, error, loading, refetch } = useQuery(REQUESTED_HELPS_QUERY, { variables: { uid }, pollInterval: 100 });
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

const MyContributions = (props: ContributionsProps) => {
    const { currentUser } = props;
    const { uid } = currentUser;
    const { data, error, loading, refetch } = useQuery(HELPING_HELPS_QUERY, { variables: { uid }, pollInterval: 100 });
    if (!data) return null;
    let { user } = data;
    let { helpedHelpRequests } = user;

    const getHelpRequest = ({ item }) => <UserContributionCard keyOfHelpRequest={item} />

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <FlatList
                data={helpedHelpRequests}
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
    if(!user) return <CustomModal variant="loading" /> 
    return (
        <Tab.Navigator tabBarOptions={{ indicatorStyle: { backgroundColor: ORANGE } }}>
            <Tab.Screen name="Requested" children={() => <MyHelps currentUser={user} />} />
            <Tab.Screen name="Helping" children={() => <MyContributions currentUser={user} />} />
        </Tab.Navigator>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    );
}

export default MyHelpRequestsScreen;
