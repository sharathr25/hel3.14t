import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import NotificationItem from '../components/common/NotificationItem';
import { FLAG_COLOR_ORANGE } from '../constants/styleConstants';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState(navigation.getParam('notifications'));

    const _removeNotf = (id) => {
        setNotifications(notifications.filter(notification => notification._id !== id))
    }

    getNotification = ({ item: { _id, message, timeStamp } }) => <NotificationItem id={_id} message={message} timeStamp={timeStamp} removeNotf={_removeNotf} />

    return (
        <View>
            <FlatList
                data={notifications}
                renderItem={getNotification}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

NotificationsScreen.navigationOptions = ({ navigation }) => ({
    title: 'Notifications',
    headerLeft: (<HeaderBackButton onPress={() => { navigation.goBack() }} tintColor={FLAG_COLOR_ORANGE} />),
    headerRight: null
})

export default NotificationsScreen;
