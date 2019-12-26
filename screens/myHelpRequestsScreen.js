import React, { useContext, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import HelpRequest from '../components/helpRequest/user/helpRequest';
import { firebaseOnEventListner, getDataFromFirebase, firebaseOnEventListnerTurnOff } from '../fireBase/database';
import Context from '../context';

const MyHelpRequestsScreen = (props) => {
    const [helpRequests, setHelpRequests] = useState([]);
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const { db } = props;

    useEffect(() => {
        firebaseOnEventListner(`users/${uid}/${db}`,'child_added', addToHelpRequests);
        firebaseOnEventListner(`users/${uid}/${db}`, 'child_removed', removeFromHelpRequests);
        return () => firebaseOnEventListnerTurnOff(`users/${uid}/${db}`)
    },[]);

    addToHelpRequests = async (data) => {
        const key = data.val();
        const dbTogetHelps = props.db;
        const tempHelpRequest = await getDataFromFirebase(`${dbTogetHelps}/${key}`);
        const newHelprequest = {...tempHelpRequest.val(), key:key, distance:0};
        setHelpRequests(prevState => [newHelprequest,...prevState]);
    }

    removeFromHelpRequests = (data) => {
        setHelpRequests(prevState => prevState.filter((datum) => datum.key !== data.val()));
    }

    getHelpRequest = ({item}) => <HelpRequest data={item} key={item.key} db={db} />
    
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
