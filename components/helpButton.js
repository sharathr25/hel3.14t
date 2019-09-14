import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import { updateFirebase, notifyUser, pushToFirebase, getDataFromFirebase } from '../fireBase/database';

export default class HelpButton extends Component {
    constructor(props){
        super(props);
        const {data } = this.props;
        this.uid = firebase.auth().currentUser.uid;
        this.helpRequest = this.props.helpRequest;
        this.noPeopleRequested = this.helpRequest.child("noPeopleRequested");
        this.noPeopleAccepted = this.helpRequest.child("noPeopleAccepted");
        this.usersRequested = this.helpRequest.child("usersRequested");
        this.usersRejected = this.helpRequest.child("usersRejected");
        this.usersAccepted= this.helpRequest.child("usersAccepted");
        this.helpedUpQuery = this.usersAccepted.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
        this.requestedQuery = this.usersRequested.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
        this.rejectedQuery = this.usersRejected.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
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
  
    componentDidMount() {
        this.helpRequest.on("child_changed", data => {
            this.setState( { [data.key]: data.val() })
            if (data.key === "noPeopleAccepted") {
              if( data.val() === this.state.noPeopleRequired ){
                updateFirebase(this.helpRequest,"helpingStartedAt",new Date().getTime());
                updateFirebase(this.helpRequest,"status","ON_GOING");
                this.setState({ disableHelp : true, helpErrorMessage: "Helpers Filled, try helping others" }); 
                }
            }
        });
        this.setHelpButtonStatus();
    }

    componentWillUnmount(){
        this.helpRequest.off();
    }
  
    handleHelp = async () => {
        //TODO: we have send help requested user a notification. If he accepts then only we will allow this guy to help
        const { noPeopleRequested,disableHelp, uidOfHelpRequester } = this.state;
        if(!disableHelp){
          updateFirebase(this.helpRequest,"noPeopleRequested",noPeopleRequested+1);
          await pushToFirebase(this.usersRequested, this.uid)
          const uidOfHelper = this.uid;
          await notifyUser(uidOfHelpRequester,{type:"REQUEST", screenToRedirect:"My Help Requests", timeStamp: new Date(), uidOfHelper, idOfHelpRequest: this.key});
          this.setHelpButtonStatus();
        } else {
          Alert.alert(this.state.helpErrorMessage);
        }
    }
  
    setHelpButtonStatus = async () => {
        const { noPeopleRequired } = this.state;
        const helpedUpQuery = this.usersAccepted.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
        helpedUpQuery.once("value", data => {
            if(data.val()){
              this.setState({disableHelp: true , helpErrorMessage: "You are already helping" })
            }
        })

        const requestedQuery = this.usersRequested.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
        requestedQuery.once("value", data => {
            if(data.val()){
              this.setState({disableHelp: true, helpErrorMessage: "You have requested please wait..." })
            }
        })

        const rejectedQuery = this.usersRejected.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
        rejectedQuery.once("value", data => {
            if(data.val()){
              this.setState({disableHelp: true, helpErrorMessage: "You have rejected, try help others"  })
            }
        })

        const urlToGetNoPeopleAccepted = `helps/${this.key}/noPeopleAccepted`;
        const data1 = await getDataFromFirebase(urlToGetNoPeopleAccepted);

        if(data1.val() === noPeopleRequired){
          const urlToGetStatus = `helps/${this.key}/status`
          const data2 = await getDataFromFirebase(urlToGetStatus);
          if(data2.val() !== "ON_GOING"){
            updateFirebase(this.helpRequest,"helpingStartedAt",new Date().getTime());
            updateFirebase(this.helpRequest,"status","ON_GOING");
          }
          this.setState({ disableHelp : true , helpErrorMessage: "Helpers Filled, try helping others" });
        }
      }
    
    render(){
      const { noPeopleAccepted } = this.state;
      return (
        <TouchableOpacity style={styles.container} onPress={this.handleHelp}>
            <Text style={styles.help}>Help</Text><Text style={styles.text}>{noPeopleAccepted}</Text>
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
    help:{
        width: 50,
        fontSize: 20
    },
    text:{
        fontSize: 20
    }
  });