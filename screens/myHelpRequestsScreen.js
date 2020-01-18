import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import Context from '../context';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';

const MyHelpRequestsScreen = (props) => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
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

    console.log(updatedUser);

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
