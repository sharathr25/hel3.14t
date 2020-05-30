import PushNotification from "react-native-push-notification";
import { useState, useEffect } from "react";


export default () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: ({token}) => {
              setToken(token)
            },
          
            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: (notification) => {
            },
          
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
          
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
          });          
    },[])
    return token;
}
