import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import { notifyUser, updateFirebaseWithURL, pushToFirebaseWithURL, getDataFromFirebaseByValue } from '../../../fireBase/database';
import Context from "../../../context";
import Loader from '../../common/inlineLoader';
import Button from "../../common/button";

const REQUESTED_ERROR = "You have requested please wait...";
const ACCEPTED_ERROR = "You are already helping ...";
const REJECTED_ERROR = "You have rejected, try help others ...";

const HelpButton = (props) => {
  const { data } = props;
  const { noPeopleRequired,noPeopleRequested,noPeopleAccepted,uidOfHelpRequester,key} = data;
  const contextValues = useContext(Context);
  const { currentUser } = contextValues;
  const { uid } = currentUser;
  const [state, setState] = useState({
    noPeopleRequired,
      noPeopleRequested,
      noPeopleAccepted,
      uidOfHelpRequester,
      userHelping: false,
      disableHelp: noPeopleRequired === noPeopleAccepted,
      helpErrorMessage: noPeopleRequired === noPeopleAccepted ? "Helpers Filled, try helping others" : ""
  });
  const [isLoading, setIsLoading] = useState(false);

  userCanHelp = async (db, errorMessage, uid) => {
    const data = await getDataFromFirebaseByValue(db, uid);
    if(data.val()){
      Alert.alert(errorMessage);
      setState({...state, disableHelp:true});
      return false;
    }
    return true;
  }

  handleHelp = async () => {
    setIsLoading(true);
    const { noPeopleRequested,disableHelp, uidOfHelpRequester } = state;
    const canTheUserHelp = await userCanHelp(`helps/${key}/usersAccepted`,ACCEPTED_ERROR,uid) && await userCanHelp(`helps/${key}/usersRequested`,REQUESTED_ERROR,uid) && await userCanHelp(`helps/${key}/usersRejected`,REJECTED_ERROR,uid);  
    if(!disableHelp && canTheUserHelp){
        updateFirebaseWithURL(`helps/${key}`,"noPeopleRequested", noPeopleRequested+1);
        await pushToFirebaseWithURL(`helps/${key}/usersRequested`, uid);
        const uidOfHelper = uid;
        await notifyUser(uidOfHelpRequester,{type:"REQUEST", screenToRedirect:"My Help Requests", timeStamp: new Date().getTime(), uidOfHelper, idOfHelpRequest: key});  
      }
    setIsLoading(false);
  }

  if(state.disableHelp)return null;

  if(isLoading)return <Loader title="Please Wait..." bgColor={FLAG_COLOR_WHITE} color={FLAG_COLOR_ORANGE} />

  return <Button onPress={handleHelp}>Help</Button>
}

export default HelpButton;