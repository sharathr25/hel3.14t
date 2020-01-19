import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import Context from "../../../context";
import Loader from '../../common/inlineLoader';
import Button from "../../common/button";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { useAuth } from "../../../auth";

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

const HelpButton = (props) => {
  const { data } = props;
  const { usersAccepted, usersRequested, creator, _id, usersRejected } = data;
  // const contextValues = useContext(Context);
  // const { currentUser } = contextValues;
  const { user: currentUser} = useAuth();
  const { uid, displayName } = currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [updateHelp, { response }] = useMutation(HELP_UPDATE_SCHEMA);

  handleHelp = async () => {
    setIsLoading(true);
    if (usersAccepted.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(ACCEPTED_ERROR);
    } else if (usersRequested.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(REQUESTED_ERROR);
    } else if (usersRejected.map((user) => user.uid).indexOf(uid) > -1) {
      Alert.alert(REJECTED_ERROR);
    } else {
      updateHelp({ variables: { id: _id, key: "usersRequested", value: { uid, name: displayName, xp: 0 } } });
    }
    setIsLoading(false);
  }

  if (isLoading) return <Loader title="Please Wait..." bgColor={FLAG_COLOR_WHITE} color={FLAG_COLOR_ORANGE} />

  return <Button onPress={handleHelp}>Help</Button>
}

export default HelpButton;