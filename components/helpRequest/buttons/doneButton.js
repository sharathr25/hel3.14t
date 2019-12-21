import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import { 
    notifyUser, 
    removeFromFirebaseWithUrlAndValue,
    updateFirebaseWithURL, 
    getDataFromFirebase, 
    removeFromFirebaseWithURl, 
    removeFromFirebaseOrderingChild, 
    pushToFirebaseWithURL, 
    firebaseOnEventListner, 
    firebaseOnEventListnerTurnOff 
} from '../../../fireBase/database';

const XP_INCREMENT_PER_HELP = 10;

export default class DoneButton extends Component {
    constructor(props){
        super(props);
        const {data} = this.props;
        this.uid = firebase.auth().currentUser && firebase.auth().currentUser && firebase.auth().currentUser.uid;
        this.key = this.props.keyOfHelpRequest;
        this.state = {
            status : data.status
        }
    }

    updateState = (data) => {
        this.setState( { [data.key]: data.val() })
    }

    componentDidMount() {
        firebaseOnEventListner(`helps/${this.key}`,"child_changed",this.updateState);
    }

    componentWillUnmount(){
        firebaseOnEventListnerTurnOff(`helps/${this.key}`);
    }

    removeAndNotifyHelpers = async (helpers) => {
        Object.keys(helpers.val()).forEach(async (key) => {
            const uidOfhelper = helpers.val()[key];
            await removeFromFirebaseWithUrlAndValue(`users/${uidOfhelper}/helping`, this.key);
            await notifyUser(uidOfhelper,{type:"CLOSED", screenToRedirect:"NONE", timeStamp: new Date().getTime(), idOfHelpRequest: this.key});
            await removeFromFirebaseOrderingChild(`users/${uidOfhelper}/notifications`, this.key);
        });
    }

    notifyRequesters = async (requesters) => {
        Object.keys(requesters.val()).forEach(async (key) => {
            const uidOfRequester = requesters.val()[key];
            await notifyUser(uidOfRequester,{type:"CLOSED", screenToRedirect:"NONE", timeStamp: new Date().getTime(), idOfHelpRequest: this.key});
            await removeFromFirebaseOrderingChild(`users/${uidOfRequester}/notifications`, this.key);
        });
    }

    pushToHelpersDbAndAddXp = async (helpers, keyOfHelpRequest) => {
        Object.keys(helpers.val()).forEach(async (key) => {
            const uidOfhelper = helpers.val()[key];
            await pushToFirebaseWithURL(`users/${uidOfhelper}/helpingCompleted`, keyOfHelpRequest);
            const xp = await getDataFromFirebase(`users/${uidOfhelper}/xp`)
            await updateFirebaseWithURL(`users/${uidOfhelper}`,'xp',xp.val()+XP_INCREMENT_PER_HELP);
        });
    }

    removeHelpRequestFromHelpsAndRequestedUser = async () => {
        await removeFromFirebaseWithUrlAndValue(`users/${this.uid}/helpsRequested`, this.key);
        await removeFromFirebaseWithURl(`helps/${this.key}`);
    }

    handleYes = async () => {
        //get helpers who are accepted
        const urlToGetUsersAccepted = `helps/${this.key}/usersAccepted`
        const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
        
        //get helpers who are requested
        const urlToGetUsersRequested = `helps/${this.key}/usersRequested`
        const usersRequested = await getDataFromFirebase(urlToGetUsersRequested);
        
        //notify and remove this help request from helping key of helpers(users accepted and users requested)
        if(usersRequested.val()!==null){
            await this.notifyRequesters(usersRequested);
        }
        if(usersAccepted.val()!==null){
            await this.removeAndNotifyHelpers(usersAccepted);
        }

        //removing help request from helps queue and users helpsRequested db
        await this.removeHelpRequestFromHelpsAndRequestedUser();
    }

    updateHelpRequestAndUsers = async () => {
        //changing the current status of help request
        const helpRequestUrl = `helps/${this.key}`;
        updateFirebaseWithURL(helpRequestUrl,'status',"COMPLETED");

        //getting the updated help request and pushing it to 'helped' queue
        const data = await getDataFromFirebase(helpRequestUrl);

        //pushing updated help request and getting the key so we can store them in users profile
        const keyOfHelpRequest = await pushToFirebaseWithURL('helped', data);
        await pushToFirebaseWithURL(`users/${this.uid}/helpRequetsCompleted`,keyOfHelpRequest);

        //Updating helpers with new key and removing old key
        const urlToGetUsersAccepted = `helps/${this.key}/usersAccepted`
        const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
        if(usersAccepted.val()!==null){
            await this.removeAndNotifyHelpers(usersAccepted);
            await this.pushToHelpersDbAndAddXp(usersAccepted, keyOfHelpRequest);
        }

        //removing help request from helps queue and users helpsRequested db
        await this.removeHelpRequestFromHelpsAndRequestedUser();
    }

    handleDone = async () => {
        const { status } = this.state; 
        if(status==="ON_GOING") {
            await this.updateHelpRequestAndUsers();
            } else if(status==="REQUESTED") {
            Alert.alert(
                'Help request in still not filled with helpers',
                'Do you really want to close this help request?',
                [
                  {
                    text: 'Yes',
                    onPress: () => this.handleYes(),
                  },
                  {text: 'No', onPress: () => {}},
                ],
                {cancelable: false},
              );
        }
    }

    render(){
      return (
        <TouchableOpacity style={styles.container} onPress={this.handleDone}>
            <Text style={styles.done}>Done</Text><Text style={styles.text}></Text>
        </TouchableOpacity>
      );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderWidth: 1,
      borderColor: FLAG_COLOR_ORANGE,
      margin: 10,
      borderRadius: 5,
      padding: 5
    },
    done:{
        width: 50,
        fontSize: 20,
        color:FLAG_COLOR_ORANGE
    },
    text:{
        fontSize: 20
    }
  });