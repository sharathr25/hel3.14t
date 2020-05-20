// @flow
import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { NotificationItem } from '../../components/molecules';
import { WHITE } from '../../styles/colors';

const NotificationsScreen = ({ notifications } : { notifications : Object }) => {
    const [_notifications, setNotifications] = useState(notifications);

    useEffect(() => {
        setNotifications(notifications)
    }, [notifications.length]);

    const _removeNotification = (id) => {
        setNotifications(_notifications.filter(({ _id }) => _id !== id));
    }

    const getNotification = ({ item }) => {
        const { _id } = item;
        return <NotificationItem id={_id} {...item} removeNotification={_removeNotification} />
    };

    return (
        <View style={{ flex: 1, backgroundColor: WHITE }}>
            <FlatList
                data={_notifications}
                renderItem={getNotification}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    );
}

export default NotificationsScreen;
