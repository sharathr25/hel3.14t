import { useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery, useSubscription } from "react-apollo";
import { useAuth } from ".";

const USER_NOTIFICATIONS_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid) {
            notifications{
                _id,
                message,
                timeStamp
            }
        }
    }
`;

const SUBSCRPTION = gql`
    subscription {
        onUpdateUser{
            uid,
            notifications{
                _id,
                message,
                timeStamp
            }
        } 
    }
`;

const useNotifications = () => {
    const { user } = useAuth();
    const [getNotifcations, { data: initialData }] = useLazyQuery(USER_NOTIFICATIONS_QUERY);
    let { data: subscriptionData } = useSubscription(SUBSCRPTION);

    useEffect(() => {
        if (uid) {
            getNotifcations({ variables: { uid } });
        }
    }, [uid]);

    let uid = null;

    if(user) {
        ({ uid } = user);
    }

    if (subscriptionData) {
        const { onUpdateUser } = subscriptionData;
        const { uid: newUid, notifications: notificationsFromSubscription } = onUpdateUser;
        if (newUid === uid) {
            subscriptionData = null;
            return notificationsFromSubscription;
        }
    }

    if (initialData) {
        const { user: { notifications } } = initialData;
        return notifications;
    }

    return [];
}

export default useNotifications;