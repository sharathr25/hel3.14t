import React, { useContext } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign'
import { NOTIFICATION_TYPES } from '../../constants/appConstants';
import { removeFromFirebaseWithURl } from '../../fireBase/database';
import Time from './time';
import Context from '../../context';

const NotificationItem = (props) => {
    const { keyOfNotification, dataOfNotificaion } = props;
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;

    removeFromNotfications = () => {
        removeFromFirebaseWithURl(`users/${uid}/notifications/${keyOfNotification}`);
    }

    const { type, timeStamp } = dataOfNotificaion;
    return (
        <View style={styles.notificationContainer}>
            <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={{flex:3,fontSize: 20, paddingLeft: 5, justifyContent:"flex-start"}}>{NOTIFICATION_TYPES[type]}</Text>
                <TouchableOpacity style={{flex:2}} onPress={removeFromNotfications}><Icon style={{justifyContent:"flex-end", borderWidth: 1, borderColor: 'black' }} name="close" size={25} /></TouchableOpacity>
            </View>
            <Time time={timeStamp} />
        </View>
    );
}

export default NotificationItem;

const styles = StyleSheet.create({
    notificationContainer: {
        flex:1,
        borderBottomWidth: 1,
        borderBottomColor:"#e3e3e3",
        padding: 5
    }
});