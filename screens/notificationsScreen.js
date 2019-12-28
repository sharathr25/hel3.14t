import React, { useContext } from 'react';
import { View, FlatList } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import NotificationItem from '../components/common/NotificationItem';
import Context from '../context';
import { FLAG_COLOR_ORANGE } from '../constants/styleConstants';

const NotificationsScreen = () => {
    const contextValues = useContext(Context);
    const { notifications } = contextValues;

    getNotification = ({ item }) => <NotificationItem keyOfNotification={item.key} dataOfNotificaion={item.data} />

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
