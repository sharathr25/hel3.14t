import React, { useContext } from 'react';
import { View, FlatList } from 'react-native';
import NotificationItem from '../components/common/NotificationItem';
import Context from '../context';
import {useQueue} from '../effects';

const NotificationsScreen = () => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const notifications = useQueue(`users/${uid}/notifications`);
    return (
        <View>
            <FlatList
                data={notifications}
                renderItem={NotificationItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

NotificationsScreen.navigationOptions = {
    title: 'Notifications',
    headerRight: null
}

export default NotificationsScreen;
