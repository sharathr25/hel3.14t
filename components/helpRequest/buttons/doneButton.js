import React from "react";
import { Alert } from "react-native";
import Button from "../../common/button";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import Loader from "../../common/inlineLoader";
import { WHITE, ORANGE } from "../../../constants/styleConstants";

const DoneButton = (props) => {
    const { status, keyOfHelpRequest, usersAccepted } = props;

    const UPDATE_HELP_QUERY = gql`
    mutation UpdateHelp($key:String!, $value:Any, $type:String!, $operation:String!){
        updateHelp(id:"${keyOfHelpRequest}", key:$key, value:$value, type:$type, operation:$operation){
          _id
        }
      }
    `;

    UPDATE_USER = gql`
    mutation UpdateUser($uid:String!, $value:Any, $key:String!, $type:String!, $operation:String!){
        updateUser(uid:$uid, key:$key,value:$value, type:$type, operation:$operation){
            uid
        }
    }
    `;

    INCREMENT_XP_FOR_USER = gql`
        mutation IncrementXpForUser($uid:String!) {
            incrementXpForUser(uid:$uid) {
                xp
            }
        }
    `;

    const [updateHelp, { loading }] = useMutation(UPDATE_HELP_QUERY);
    const [incrementXpForUser, { }] = useMutation(INCREMENT_XP_FOR_USER);


    updateHelpRequestAndUsers = async (canAddXp) => {
        updateHelp({ variables: { key: "status", value: "COMPLETED", type: "update", operation: "update" } });
        usersAccepted.forEach((user) => {
            const { uid } = user;
            if(canAddXp) {
            incrementXpForUser({ variables: { uid } });
            }
        });
    }

    handleDone = async () => {
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

    if(loading) {
        return <Loader bgColor={WHITE} color={ORANGE}/>
    }

    return (
        <Button onPress={handleDone}>
            Done
        </Button>
    );
}

export default DoneButton;