
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { NotificationItem } from '../../components/molecules';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { StyleProvider, Container, Content, List } from 'native-base';

const NotificationsScreen = ({ notifications }) => {
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
        <StyleProvider style={getTheme(material) }>
            <Container>
                <Content>
                    <List>
                        <FlatList
                            data={_notifications.reverse()}
                            renderItem={getNotification}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </List>
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default NotificationsScreen;
