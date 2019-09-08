import React, { Component } from "react";
import { View, Alert, StyleSheet } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "./helpDescription";
import Time from "../time";
import HelpRequestRequestedUsers from './helpRequestUserRequested';
import PushUpButton from '../pushUpButton';
import PullUpButton from '../pullUpButton';
import HelpButton from "../helpButton";
import { updateHelpRequest } from '../../fireBase/database';

class HelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helps");
    this.helpRequest = this.helps.child(this.key);
    this.status = this.helpRequest.child('status');
    this.noPeopleRequested = this.helpRequest.child("noPeopleRequested");
    this.noPeopleAccepted = this.helpRequest.child("noPeopleAccepted");
    this.usersRequested = this.helpRequest.child("usersRequested");
    this.usersAccepted= this.helpRequest.child("usersAccepted");
    this.usersRejected = this.helpRequest.child("usersRejected");
    this.state = {
      pushUps: data.pushUps,
      pullUps: data.pullUps,
      noPeopleRequested: data.noPeopleRequested,
      noPeopleAccepted: data.noPeopleAccepted,
      status: data.status,
      userPushed: false,
      userPulled: false,
      userHelping: false,
      disableHelp: false,
      helpErrorMessage: ""
    };
  }

  componentDidMount() {
    this.helpRequest.on("child_changed", data => {
      this.setState( { [data.key]: data.val() })
    });
  }
  
  componentWillUnmount(){
      this.helpRequest.off();
  }

  removeUserAsRequested = (helperUid) => {
    this.usersRequested.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', data => {
      this.usersRequested.child(Object.keys(data.val())[0]).remove();
    });
  }

  handleAccept = (helperUid) => {
    const { noPeopleAccepted } = this.state;
    this.usersAccepted.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', data => {
      if(!data.val()){
        updateHelpRequest(this.helpRequest,"noPeopleAccepted",noPeopleAccepted+1, this.usersAccepted, helperUid);
        this.removeUserAsRequested(helperUid);
      } else {
        Alert.alert("user already accepted");
      }
    });
  }

  handleReject = (helperUid) => {
    this.usersRejected.push(helperUid).catch(err => {
      console.log(err);
    });
    this.removeUserAsRequested(helperUid);
  }

  render() {
    const { data } = this.props;
    const { description, title, distance, timeStamp } = data;
    return (
      <View style={styles.outerContanier}>
        <View style={styles.innerContaner}>
          <HelpDescription
            data={{
              title,
              description,
              distance
            }}
          />
          <View style={styles.buttons}>
            <PullUpButton data={data} helpRequest={this.helpRequest} />
            <PushUpButton data={data} helpRequest={this.helpRequest} />
            <HelpButton data={data} helpRequest={this.helpRequest}/>
          </View>
          {this.props.type === "USER" && <HelpRequestRequestedUsers handleAccept={(helperUid) => this.handleAccept(helperUid)} handleReject={(helperUid) => this.handleReject(helperUid)} usersRequestedDb={this.usersRequested} usersAcceptedDb={this.usersAccepted} />}
          <Time time={timeStamp} />
        </View>
      </View>
    );
  }
}

export default HelpRequest;

const styles = StyleSheet.create({
  outerContanier: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row"
  },
  innerContaner: {
    flex: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    margin: 5
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  }
});
