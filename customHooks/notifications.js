// @flow
import { useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "react-apollo";
import { useAuth } from "../customHooks";

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

const useNotifications = () => {
    const { user } = useAuth();
    const [getNotifications, { data, loading, error }] = useLazyQuery(USER_NOTIFICATIONS_QUERY, { pollInterval: 100 });
    useEffect(() => {
        if(user) 
            getNotifications({ variables: { uid:user.uid } })
    }, [user])

    if (data) {
        const { user: { notifications } } = data;
        return notifications;
    }

    return [];
}

export default useNotifications;