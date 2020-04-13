// @flow
import React from "react";
import { Alert } from "react-native";
import Button from "../../atoms/Button";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { ORANGE, WHITE } from "../../../styles/colors";
import { useAuth } from "../../../customHooks";

const REQUESTED_ERROR = "You have requested please wait...";
const ACCEPTED_ERROR = "You are already helping ...";
const REJECTED_ERROR = "You have rejected, try help others ...";

const HELP_UPDATE_SCHEMA = gql`
  mutation UpdateHelp($id:String!,$key:String!,$value:Any){
    updateHelp(id:$id,key:$key,value:$value, type:"array", operation:"push"){
      _id
    }
  }
`;

type HelpButtonProps = {
  data: {
    usersAccepted: Array<Object>, 
    usersRequested: Array<Object>, 
    usersRejected: Array<Object>,
    creator: string, 
    _id: string, 
  }
}

const HelpButton = (props: HelpButtonProps) => {
  const { data } = props;
  const { usersAccepted, usersRequested, creator, _id, usersRejected } = data;
  const { user: currentUser } = useAuth();
  const { uid , attributes } = currentUser;
  const { name , phone_number} = attributes;
  const [updateHelp, { loading }] = useMutation(HELP_UPDATE_SCHEMA);

  const handleHelp = () => {
    if (usersAccepted.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(ACCEPTED_ERROR);
    } else if (usersRequested.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(REQUESTED_ERROR);
    } else if (usersRejected.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(REJECTED_ERROR);
    } else {
      updateHelp({ variables: { id: _id, key: "usersRequested", value: { uid, name , xp: 0, mobileNo: phone_number , stars: 0 } } });
    }
  }

  return <Button onPress={handleHelp} loading={loading} bgColor={ORANGE} textColor={WHITE}>Help</Button>
}

export default HelpButton;