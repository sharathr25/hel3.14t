import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign'
import { NOTIFICATION_TYPES } from '../../constants/appConstants';
import { removeFromFirebaseWithURl } from '../../fireBase/database';
import Time from './time';

const uid = firebase.auth().currentUser && firebase.auth().currentUser.uid;

const removeFromNotfications = (key) => {
    removeFromFirebaseWithURl(`users/${uid}/notifications/${key}`);
}

const NotificationItem = (props) => {
    const { item } = props;
    return (
        <View style={styles.notificationContainer}>
            <View style={{ flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={{flex:3,fontSize: 20, paddingLeft: 5, justifyContent:"flex-start"}}>{NOTIFICATION_TYPES[item.type]}</Text>
                <TouchableOpacity style={{flex:2}} onPress={() => removeFromNotfications(item.key)}><Icon style={{justifyContent:"flex-end", borderWidth: 1, borderColor: 'black' }} name="close" size={25} /></TouchableOpacity>
            </View>
            <Time time={item.timeStamp} />
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