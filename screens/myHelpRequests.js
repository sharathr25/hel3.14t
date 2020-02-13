import React from 'react';
import { FlatList, View } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import { useAuth } from '../customHooks';
import { WHITE } from '../constants/styleConstants';

const MyHelpRequestsScreen = (props) => {
    const { user:currentUser } = useAuth();
    const { uid } = currentUser;

    const QUERY = gql`
        query {
            user(uid:"${uid}") {
                createdHelpRequests
            }
        }
    `;

    const SUBSCRPTION = gql`
    subscription{
        onUpdateUser{
            uid,
            createdHelpRequests
        } 
    }
    `;

    const {data} = useQuery(QUERY);

    const subscriptionData = useSubscription(SUBSCRPTION);

    const updatedUser = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateUser || null;

    if(!data) return null;

    let { user } = data;
    
    if(updatedUser){
        if(updatedUser.uid === uid) {
            user = { ...data.user, ...updatedUser}
        }
    }
    let { createdHelpRequests } = user;

    getHelpRequest = ({ item }) => <HelpRequest keyOfHelpRequest={item} />

    return (
        <View style={{flex: 1, backgroundColor: WHITE}}>
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
