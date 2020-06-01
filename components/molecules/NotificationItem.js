// @flow
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { Time } from '../atoms';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { ORANGE, BLACK } from '../../styles/colors';
import { useAuth } from "../../customHooks/index";
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { typeToScreenMapping } from '../../constants/appConstants';

const QUERY_TO_REMOVE_NOTIFICATION = gql`
    mutation UpdateUser($uid: String!, $value: Any) {
        updateUser(uid:$uid,key:"notifications", value:$value, type:"array", operation:"pull"){
        notifications{
                _id
            }
        }
    }
`;

const REMOVE_NOTIFICATION = gql`
mutation RemoveNotification($uid: String!, $idOfNotification: String!) {
    removeNotification(uid:$uid,idOfNotification:$idOfNotification ){
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
    removeNotification: Function,
    type?: string,
    idOfHelpRequest?: string
}

const NotificationItem = (props: NotificationItemProps) => {
    const { message, id, timeStamp = "", removeNotification, type, idOfHelpRequest } = props;
    const navigation = useNavigation()
    const { user } = useAuth();
    const { uid } = user || {};
    const [removeNotificationFromDb] = useMutation(REMOVE_NOTIFICATION);

    const _removeNotification = () => {
        removeNotification(id);
        removeNotificationFromDb({ variables: { uid, idOfNotification: id } });
    }

    const _onClick = () => {
        if(type) {
            navigation.navigate(typeToScreenMapping[type], { keyOfHelpRequest : idOfHelpRequest })
        }
    }

    return (
        <ListItem 
            onPress={_onClick}
            title={message} 
            subtitle={<Time time={timeStamp} />}
            rightIcon={
                <TouchableOpacity onPress={_removeNotification}>
                    <Icon name="close" size={25} color={ORANGE} />
                </TouchableOpacity>
            }
            bottomDivider={true}
        />
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