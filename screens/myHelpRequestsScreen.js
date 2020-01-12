import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import Context from '../context';
import { useQueue } from '../effects';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

const MyHelpRequestsScreen = (props) => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const { db } = props;

    const QUERY = gql`
        query {
            user(uid:"${uid}") {
                createdHelpRequests
            }
        }
    `;
    const {data} = useQuery(QUERY);

    if(!data) return null;

    const { user } = data;
    const { createdHelpRequests } = user;

    getHelpRequest = ({ item }) => <HelpRequest keyOfHelpRequest={item} />

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={createdHelpRequests}
                renderItem={getHelpRequest}
                keyExtractor={(item, index) => item.key + index.toString()}
                listKey={(item, index) => item.key + index.toString()}
            />
        </View>
    );
}
export default MyHelpRequestsScreen;
