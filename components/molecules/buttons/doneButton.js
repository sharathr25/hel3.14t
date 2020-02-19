// @flow
import React from "react";
import { Alert } from "react-native";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { WHITE, ORANGE } from "../../../styles/colors";
import { Button } from "../../atoms";
import { ActivityIndicator } from "react-native-paper";

type DoneButtonProps = {
    status: string, 
    keyOfHelpRequest: string, 
    usersAccepted: Array<Object>
}

const UPDATE_HELP_QUERY = gql`
    mutation UpdateHelp($key:String!, $value:Any, $type:String!, $operation:String!, !id: String!){
        updateHelp(id:$id, key:$key, value:$value, type:$type, operation:$operation){
            _id
        }
    }
`;

const UPDATE_USER = gql`
    mutation UpdateUser($uid:String!, $value:Any, $key:String!, $type:String!, $operation:String!){
        updateUser(uid:$uid, key:$key,value:$value, type:$type, operation:$operation){
            uid
        }
    }
`;

const INCREMENT_XP_FOR_USER = gql`
    mutation IncrementXpForUser($uid:String!) {
        incrementXpForUser(uid:$uid) {
            xp
        }
    }
`;

const DoneButton = (props: DoneButtonProps) => {
    const { status, keyOfHelpRequest, usersAccepted } = props;

    const [updateHelp, { loading }] = useMutation(UPDATE_HELP_QUERY);
    const [incrementXpForUser, { }] = useMutation(INCREMENT_XP_FOR_USER);


    const updateHelpRequestAndUsers = async (canAddXp) => {
        updateHelp({ variables: { key: "status", value: "COMPLETED", type: "update", operation: "update", id: keyOfHelpRequest } });
        usersAccepted.forEach((user) => {
            const { uid } = user;
            if (canAddXp) {
                incrementXpForUser({ variables: { uid } });
            }
        });
    }

    const handleDone = async () => {
        if (status === "ON_GOING") {
            await updateHelpRequestAndUsers(true);
        } else if (status === "REQUESTED") {
            Alert.alert(
                'Help request still not filled with helpers',
                'Do you really want to close this help request?',
                [
                    {
                        text: 'Yes',
                        onPress: () => updateHelpRequestAndUsers(false),
                    },
                    { text: 'No', onPress: () => { } },
                ],
                { cancelable: false },
            );
        }
    }

    if (loading) {
        return <ActivityIndicator color={ORANGE} />
    }

    return (
        <Button onPress={handleDone}>
            Done
        </Button>
    );
}

export default DoneButton;