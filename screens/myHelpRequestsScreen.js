import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import Context from '../context';
import { useQueue } from '../effects';

const MyHelpRequestsScreen = (props) => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const { db } = props;
    const helpRequests = useQueue(`users/${uid}/${db}`);

    getHelpRequest = ({ item }) => <HelpRequest keyOfHelpRequest={item.data} db={db} />

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={helpRequests}
                renderItem={getHelpRequest}
                keyExtractor={(item, index) => item.key + index.toString()}
                listKey={(item, index) => item.key + index.toString()}
            />
        </View>
    );
}
export default MyHelpRequestsScreen;
