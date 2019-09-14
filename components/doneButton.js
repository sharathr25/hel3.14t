import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import { updateFirebase, notifyUser, pushToFirebase,updateFirebaseWithURL, getDataFromFirebase, removeFromFirebase, removeFromFirebaseWithURl, removeFromFirebaseOrderingChild, pushToFirebaseWithURL } from '../fireBase/database';

const XP_INCREMENT_PER_HELP = 10;
export default class DoneButton extends Component {
    constructor(props){
        super(props);
        const {data} = this.props;
        this.uid = firebase.auth().currentUser.uid;
        this.key = this.props.keyOfHelpRequest;
        this.helpRequest = firebase.database().ref('helps').child(this.key);
        this.state = {
            status : data.status
        }
    }

    componentDidMount() {
        this.helpRequest.on("child_changed", data => {
            this.setState( { [data.key]: data.val() })
        });
    }

    componentWillUnmount(){
        this.helpRequest.off();
    }

    removeAndNotifyHelpers = async (helpers) => {
        Object.keys(helpers.val()).forEach(async (key) => {
            const uidOfhelper = helpers.val()[key];
            await removeFromFirebase(firebase.database().ref(`users/${uidOfhelper}/helping`),this.key);
            await notifyUser(uidOfhelper,{type:"CLOSED", screenToRedirect:"NONE", timeStamp: new Date(), idOfHelpRequest: this.key});
            await removeFromFirebaseOrderingChild(`users/${uidOfhelper}/notifications`, this.key);
        });
    }

    handleYes = async () => {
        const urlToGetUsersAccepted = `helps/${this.key}/usersAccepted`
        const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
        const urlToGetUsersRequested = `helps/${this.key}/usersRequested`
        const usersRequested = await getDataFromFirebase(urlToGetUsersRequested);
        if(usersRequested.val()!==null){
            await this.removeAndNotifyHelpers(usersRequested);
        }
        if(usersAccepted.val()!==null){
            await this.removeAndNotifyHelpers(usersAccepted);
        }
        await removeFromFirebase(firebase.database().ref(`users/${this.uid}/helpsRequested`),this.key);
        await removeFromFirebase(firebase.database().ref(`users/${this.uid}/helping`),this.key);
        await removeFromFirebaseWithURl(`helps/${this.key}`);
    }

    handleDone = async () => {
        const { status } = this.state; 
        if(status==="ON_GOING") {
            const helpRequestUrl = `helps/${this.key}`;
            updateFirebaseWithURL(helpRequestUrl,'status',"COMPLETED");
            const data = await getDataFromFirebase(helpRequestUrl);
            const keyOfHelpRequest = await pushToFirebaseWithURL('helped', data);
            const urlToGetUsersAccepted = `helps/${this.key}/usersAccepted`
            const usersAccepted = await getDataFromFirebase(urlToGetUsersAccepted);
            if(usersAccepted.val()!==null){
                await this.removeAndNotifyHelpers(usersAccepted);
            }
            Object.keys(usersAccepted.val()).forEach(async (key) => {
                const uidOfhelper = usersAccepted.val()[key];
                await pushToFirebaseWithURL(`users/${uidOfhelper}/helpsCompleted`, keyOfHelpRequest);
                const xp = await getDataFromFirebase(`users/${uidOfhelper}/xp`)
                await updateFirebaseWithURL(`users/${uidOfhelper}`,'xp',xp.val()+XP_INCREMENT_PER_HELP);
            });
            await removeFromFirebase(firebase.database().ref(`users/${this.uid}/helpsRequested`),this.key);
            await pushToFirebaseWithURL(`users/${this.uid}/helpsCompleted`,keyOfHelpRequest);
            await removeFromFirebaseWithURl(`helps/${this.key}`);
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
      margin: 3,
      borderRadius: 5,
      padding: 5
    },
    done:{
        width: 50,
        fontSize: 20
    },
    text:{
        fontSize: 20
    }
  });