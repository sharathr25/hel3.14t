// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { Time, Button } from '../atoms';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { useAuth } from '../../customHooks';
import { ORANGE, BLACK } from '../../styles/colors';

const QUERY_TO_REMOVE_NOTIFICATION = gql`
    mutation UpdateUser($uid: String!, $value: Any) {
        updateUser(uid:$uid,key:"notifications", value:$value, type:"array", operation:"pull"){
        notifications{
                _id
            }
        }
    }
`;

type NotificationItemProps = {
    message: string,
    id: string,
    timeStamp?: number | "",
    removeNotification: Function
}

const NotificationItem = (props: NotificationItemProps) => {
    const { message, id, timeStamp = "", removeNotification } = props;
    const { user: { uid } } = useAuth();
    const [removeNotificationFromDb] = useMutation(QUERY_TO_REMOVE_NOTIFICATION);

    const _removeNotification = () => {
        removeNotification(id);
        removeNotificationFromDb({ variables: { uid, value: { _id: id } } });
    }

    const { notificationContainer, descriptionStyle, descriptionContainerStyle } = styles;

    return (
        <View style={notificationContainer}>
            <View style={descriptionContainerStyle}>
                <Text style={descriptionStyle}>{message}</Text>
                <Button onPress={_removeNotification}>
                    <Icon name="close" size={15} color={ORANGE} />
                </Button>
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
    },
    descriptionContainerStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        color: BLACK
    },
    descriptionStyle: {
        flex: 3,
        fontSize: 20,
        justifyContent: "flex-start"
    }
});