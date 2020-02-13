import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign'
import Time from './time';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { useAuth } from '../../customHooks';

const QUERY_TO_REMOVE_NOTIFICATION = gql`
    mutation UpdateUser($uid: String!, $value: Any) {
        updateUser(uid:$uid,key:"notifications", value:$value, type:"array", operation:"pull"){
        notifications{
                _id
            }
        }
    }
`;

const NotificationItem = ({ message, id, timeStamp = "", removeNotification }) => {
    const { user: { uid } } = useAuth();
    const [removeNotificationFromDb] = useMutation(QUERY_TO_REMOVE_NOTIFICATION);

    const _removeNotification = () => {
        removeNotification(id);
        removeNotificationFromDb({ variables: { uid, value: { _id: id } } });
    }

    return (
        <View style={styles.notificationContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ flex: 3, fontSize: 20, justifyContent: "flex-start" }}>{message}</Text>
                <TouchableOpacity style={{ flex: 2 }} onPress={_removeNotification}>
                    <Icon style={{ justifyContent: "flex-end", borderWidth: 1, borderColor: 'black' }} name="close" size={25} />
                </TouchableOpacity>
            </View>
            {timeStamp ? <Time time={timeStamp} /> : null}
        </View>
    );
}

export default NotificationItem;

const styles = StyleSheet.create({
    notificationContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        padding: 10
    }
});