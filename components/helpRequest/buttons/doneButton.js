import React, { useContext } from "react";
import { Alert } from "react-native";
import { 
    notifyUser, 
    removeFromFirebaseWithUrlAndValue,
    updateFirebaseWithURL, 
    getDataFromFirebase, 
    removeFromFirebaseWithURl, 
    removeFromFirebaseOrderingChild, 
    pushToFirebaseWithURL, 
} from '../../../fireBase/database';
import { HELPS_REQUESTED_DB, HELPS_COMPLETED_DB } from "../../../constants/appConstants";
import Context from '../../../context';
import Button from "../../common/button";

const XP_INCREMENT_PER_HELP = 10;

const DoneButton = (props) => {
    const contextValues = useContext(Context);
    const { currentUser } = contextValues;
    const { uid } = currentUser;
    const { status } = props;
    const key = props.keyOfHelpRequest;

    removeAndNotifyHelpers = async (helpers) => {
        Object.keys(helpers.val()).forEach(async (key) => {
            const uidOfhelper = helpers.val()[key];
            await notifyUser(uidOfhelper,{type:"CLOSED", screenToRedirect:"NONE", timeStamp: new Date().getTime(), idOfHelpRequest: key});
            await removeFromFirebaseOrderingChild(`users/${uidOfhelper}/notifications`, key);
        });
    }

    notifyRequesters = async (requesters) => {
        Object.keys(requesters.val()).forEach(async (key) => {
            const uidOfRequester = requesters.val()[key];
            await notifyUser(uidOfRequester,{type:"CLOSED", screenToRedirect:"NONE", timeStamp: new Date().getTime(), idOfHelpRequest: key});
            await removeFromFirebaseOrderingChild(`users/${uidOfRequester}/notifications`, key);
        });
    }

    pushToHelpersDbAndAddXp = async (helpers, keyOfHelpRequest) => {
        Object.keys(helpers.val()).forEach(async (key) => {
            const uidOfhelper = helpers.val()[key];
            await pushToFirebaseWithURL(`users/${uidOfhelper}/${HELPS_COMPLETED_DB}`, keyOfHelpRequest);
            const xp = await getDataFromFirebase(`users/${uidOfhelper}/xp`)
            await updateFirebaseWithURL(`users/${uidOfhelper}`,'xp',xp.val()+XP_INCREMENT_PER_HELP);
        });
    }

    removeHelpRequestFromHelpsAndRequestedUser = async () => {
        await removeFromFirebaseWithUrlAndValue(`users/${uid}/helpsRequested`, key);
        await removeFromFirebaseWithURl(`${HELPS_REQUESTED_DB}/${key}`);
    }

    handleYes = async () => {
        //get helpers who are accepted
        const urlToGetUsersAccepted = `helps/${key}/usersAccepted`
        const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
        
        //get helpers who are requested
        const urlToGetUsersRequested = `helps/${key}/usersRequested`
        const usersRequested = await getDataFromFirebase(urlToGetUsersRequested);
        
        //notify and remove this help request from helping key of helpers(users accepted and users requested)
        if(usersRequested.val()!==null){
            await notifyRequesters(usersRequested);
        }
        if(usersAccepted.val()!==null){
            await removeAndNotifyHelpers(usersAccepted);
        }

        //removing help request from helps queue and users helpsRequested db
        await removeHelpRequestFromHelpsAndRequestedUser();
    }

    updateHelpRequestAndUsers = async () => {
        //changing the current status of help request
        const helpRequestUrl = `${HELPS_REQUESTED_DB}/${key}`;
        updateFirebaseWithURL(helpRequestUrl,'status',"COMPLETED");

        //getting the updated help request and pushing it to 'helped' queue
        const data = await getDataFromFirebase(helpRequestUrl);

        //pushing updated help request and getting the key so we can store them in users profile
        const keyOfHelpRequest = await pushToFirebaseWithURL(HELPS_COMPLETED_DB, data);
        await pushToFirebaseWithURL(`users/${uid}/${HELPS_COMPLETED_DB}`,keyOfHelpRequest);

        //Updating helpers with new key and removing old key
        const urlToGetUsersAccepted = `${HELPS_REQUESTED_DB}/${key}/usersAccepted`
        const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
        if(usersAccepted.val()!==null){
            await removeAndNotifyHelpers(usersAccepted);
            await pushToHelpersDbAndAddXp(usersAccepted, keyOfHelpRequest);
        }

        //removing help request from helps queue and users helpsRequested db
        await removeHelpRequestFromHelpsAndRequestedUser();
    }

    handleDone = async () => {
        if(status==="ON_GOING") {
            await updateHelpRequestAndUsers();
            } else if(status==="REQUESTED") {
            Alert.alert(
                'Help request still not filled with helpers',
                'Do you really want to close this help request?',
                [
                  {
                    text: 'Yes',
                    onPress: () => handleYes(),
                  },
                  {text: 'No', onPress: () => {}},
                ],
                {cancelable: false},
            );
        }
    }

    return (
        <Button onPress={handleDone}>
            Done
        </Button>
    );
}

export default DoneButton;