// @flow
import { useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "react-apollo";
import { useAuth } from "../customHooks";
import { POLL_INTERVAL } from "../config";

const USER_NOTIFICATIONS_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid) {
            notifications{
                _id,
                message,
                timeStamp,
                type,
                idOfHelpRequest
            }
        }
    }
`;

const useNotifications = () => {
    const { user: currentUser } = useAuth();
    const [getNotifications, { data, loading, error }] = useLazyQuery(USER_NOTIFICATIONS_QUERY, { pollInterval: POLL_INTERVAL });
    
    useEffect(() => {
        if(currentUser) {
            const { uid } = currentUser;
            getNotifications({ variables: { uid } })
        }
    }, [currentUser])

    if (data) {
        const { user: { notifications } } = data;
        return notifications;
    }

    return [];
}

export default useNotifications;