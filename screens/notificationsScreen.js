import React, { useState , useEffect, useContext} from 'react';
import { View, FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import { getDataFromFirebase, firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../fireBase/database';
import NotificationItem from '../components/common/NotificationItem';
import Context from '../context';

const uid = firebase.auth().currentUser &&  firebase.auth().currentUser.uid;

function useNotifications() {
    const [notifications, setNotifications] = useState([]);

    const addToNotifications = (data) => {
        setNotifications(prevState => prevState.concat({key:data.key, ...data.val()}));
    }
    
    const removeFromNotifications = (data) => {
        setNotifications(prevState => prevState.filter((datum) => datum.key !== data.key));
    }

    useEffect(() => {
        firebaseOnEventListner(`users/${uid}/notifications`,"child_added", addToNotifications);
        firebaseOnEventListner(`users/${uid}/notifications`,"child_removed", removeFromNotifications);
    }, [uid]);

    return notifications;
}

const NotificationsScreen = () => {
    const notifications = useNotifications();
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
