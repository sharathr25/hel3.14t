import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import { notifyUser, getDataFromFirebase, firebaseOnEventListner, firebaseOnEventListnerTurnOff, updateFirebaseWithURL, pushToFirebaseWithURL, getDataFromFirebaseByValue } from '../../../fireBase/database';

export default class HelpButton extends Component {
    constructor(props){
        super(props);
        const {data } = this.props;
        this.uid = firebase.auth().currentUser && firebase.auth().currentUser && firebase.auth().currentUser.uid;
        this.key = data.key;
        this.state = {
        noPeopleRequired: data.noPeopleRequired,
        noPeopleRequested: data.noPeopleRequested,
        noPeopleAccepted: data.noPeopleAccepted,
        uidOfHelpRequester: data.uidOfHelpRequester,
        userHelping: false,
        disableHelp: false,
        helpErrorMessage: ""
      }
    }
  
    updateState = (data) => {
      this.setState( { [data.key]: data.val() })
        if (data.key === "noPeopleAccepted") {
          if( data.val() === this.state.noPeopleRequired ){
            updateFirebaseWithURL(`helps/${this.key}`,'helpingStartedAt', new Date().getTime());
            updateFirebaseWithURL(`helps/${this.key}`, 'status', 'ON_GOING');
            this.setState({ disableHelp : true, helpErrorMessage: "Helpers Filled, try helping others" }); 
          }
      }
    }

    componentDidMount() {
        firebaseOnEventListner(`helps/${this.key}`,"child_changed",this.updateState);
        this.setHelpButtonStatus();
    }

    componentWillUnmount(){
        firebaseOnEventListnerTurnOff(`helps/${this.key}`);
    }
  
    handleHelp = async () => {
        //TODO: we have send help requested user a notification. If he accepts then only we will allow this guy to help
        const { noPeopleRequested,disableHelp, uidOfHelpRequester } = this.state;
        if(!disableHelp){
          updateFirebaseWithURL(`helps/${this.key}`,"noPeopleRequested", noPeopleRequested+1);
          await pushToFirebaseWithURL(`helps/${this.key}/usersRequested`, this.uid);
          const uidOfHelper = this.uid;
          await notifyUser(uidOfHelpRequester,{type:"REQUEST", screenToRedirect:"My Help Requests", timeStamp: new Date().getTime(), uidOfHelper, idOfHelpRequest: this.key});
          this.setHelpButtonStatus();
        } else {
          Alert.alert(this.state.helpErrorMessage);
        }
    }
  
    setHelpButtonStatus = async () => {
        const { noPeopleRequired } = this.state;
        let data;
        data = await getDataFromFirebaseByValue(`helps/${this.key}/usersAccepted`, this.uid);
        if(data.val()){
          this.setState({disableHelp: true, helpErrorMessage: "You are already helping ..." })
        }

        data = await getDataFromFirebaseByValue(`helps/${this.key}/usersRequested`, this.uid);
        if(data.val()){
          this.setState({disableHelp: true, helpErrorMessage: "You have requested please wait..." })
        }

        data = await getDataFromFirebaseByValue(`helps/${this.key}/usersRejected`, this.uid);
        if(data.val()){
          this.setState({disableHelp: true, helpErrorMessage: "You have rejected, try help others ..." })
        }

        const urlToGetNoPeopleAccepted = `helps/${this.key}/noPeopleAccepted`;
        const data1 = await getDataFromFirebase(urlToGetNoPeopleAccepted);

        if(data1.val() === noPeopleRequired){
          const urlToGetStatus = `helps/${this.key}/status`
          const data2 = await getDataFromFirebase(urlToGetStatus);
          if(data2.val() !== "ON_GOING"){
            updateFirebaseWithURL(`helps/${this.key}`,"helpingStartedAt", new Date().getTime());
            updateFirebaseWithURL(`helps/${this.key}`,"status", ON_GOING);
          }
          this.setState({ disableHelp : true , helpErrorMessage: "Helpers Filled, try helping others" });
        }
      }
    
    render(){
      return (
        <TouchableOpacity style={styles.container} onPress={this.handleHelp}>
            <Text style={styles.help}>Help</Text>
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
      padding: 5,
    },
    help:{
        width: 50,
        fontSize: 20,
        color:FLAG_COLOR_ORANGE
    },
    text:{
        fontSize: 20
    }
  });