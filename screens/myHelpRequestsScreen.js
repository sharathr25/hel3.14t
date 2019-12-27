import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import Context from '../context';
import { useQueue } from '../effects';

const MyHelpRequestsScreen = (props) => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const { db } = props;
    const helpRequests = useQueue(`users/${uid}/${db}`);

    getHelpRequest = ({item}) => <HelpRequest keyOfHelpRequest={item.data} db={db} />
    
    return (
        <FlatList
            data={helpRequests}
            renderItem={getHelpRequest}
            keyExtractor={(item, index) => index.toString()}
            listKey={`db`}
        />
    );
}
export default MyHelpRequestsScreen;
