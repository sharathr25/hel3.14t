import React, { Component } from "react";
import { View, Alert } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "./helpDescription";
import HelpRequestModifier from "./helpRequestFooter";
import Time from "../time";
import ProgressBar from '../progressBar';

class HelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helps");
    this.helpRequest = this.helps.child(this.key);
    this.usersPushed = this.helpRequest.child("usersPushed");
    this.usersRequested = this.helpRequest.child("usersRequested");
    this.usersAccepted= this.helpRequest.child("usersAccepted");
    this.noPeopleRequested = this.helpRequest.child("noPeopleRequested");
    this.usersPulled = this.helpRequest.child("usersPulled");
    this.pushedUpQuery = this.usersPushed.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.pulledUpQuery = this.usersPulled.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.helpedUpQuery = this.usersAccepted.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.state = {
      pushUps: data.pushUps,
      pullUps: data.pullUps,
      noPeople: data.noPeople,
      noPeopleRequested: data.noPeopleRequested,
      userPushed: false,
      userPulled: false,
      userHelping: false,
      disableHelp: false
    };
  }

  componentDidMount() {
    this.helpRequest.on("child_changed", data => {
      this.setState( { [data.key]: data.val() })
      if (data.key === "noPeopleRequested") {
        if( data.val() === this.state.noPeople ){
          this.setState({ disableHelp : true });
        }
      }
    });
    this.setPushUpStatus();
    this.setPullUpStatus();
    this.setHelpButtonStatus();
  }

  updateHelpRequest = (key,value,userDb) => {
    const { uid } = this;
    this.helpRequest.update({ [key]: value });
    if(userDb){
      userDb.push(uid).catch(err => {
        console.log(err);
      });
    }
  };

  setPushUpStatus = () => {
    this.pushedUpQuery.once("value", data => {
      if (data.val()) {
        this.setState({ userPushed: true });
      }
    });
  };

  setPullUpStatus = () => {
    this.pulledUpQuery.once("value", data => {
      if (data.val()) {
        this.setState({ userPulled: true });
      }
    });
  };

  setHelpButtonStatus = () => {
    const { noPeople } = this.state;
    this.noPeopleRequested.once("value", data => {
      if(data.val() === noPeople){
        this.updateHelpRequest("helpingStartedAt",new Date().getTime(),null);
        this.setState({ disableHelp : true });
        this.helpRequest.once('value', (data) => {
          firebase.database().ref('/helping').push(data.val(),() => {
            this.helpRequest.remove();
          });
        });
      }
    });
    this.helpedUpQuery.once("value", data => {
      if(data.val()){
        this.setState({disableHelp: true })
      }
    })
  }

  handlePush = () => {
    const { pushUps,userPushed } = this.state;
    if (!userPushed) {
      this.updateHelpRequest("pushUps", pushUps+1 ,this.usersPushed);
      this.setPushUpStatus();
    } else {
      Alert.alert("u already pushed");
    }
  };

  handlePull = () => {
    const { pullUps,userPulled } = this.state;
    if (!userPulled) {
      this.updateHelpRequest("pullUps", pullUps+1, this.usersPulled);
      this.setPullUpStatus();
    } else {
      Alert.alert("u already pulled");
    }
  };

  handleHelp = () => {
    //TODO: we have send help requested user a notification. If he accepts then only we will allow this guy to help
    const { noPeopleRequested,disableHelp } = this.state;
    if(!disableHelp){
      this.updateHelpRequest("noPeopleRequested",noPeopleRequested+1, this.usersAccepted);
      this.setHelpButtonStatus();
    } else {
      Alert.alert("u already helping");
    }
  }

  render() {
    const { data } = this.props;
    const { description, title, distance, timeStamp } = data;
    const { pushUps, pullUps, noPeople, noPeopleRequested } = this.state;
    return (
      <View
        style={{
          margin: 10,
          padding: 10,
          borderRadius: 5,
          flexDirection: "row"
        }}
      >
        <View
          style={{
            flex: 5,
            backgroundColor: "#F5F5F5",
            borderRadius: 5,
            margin: 5
          }}
        >
          <HelpDescription
            data={{
              title,
              description,
              noPeople,
              distance,
              noPeopleRequested
            }}
          />
          <ProgressBar pushUps={pushUps} pullUps={pullUps}/>
          {this.props.disableFooter && <HelpRequestModifier
            pushUps={pushUps}
            pullUps={pullUps}
            handlePush={() => this.handlePush()}
            handlePull={() => this.handlePull()}
            handleHelp={() => this.handleHelp()}
          />}
          <Time time={timeStamp} />
        </View>
      </View>
    );
  }
}

export default HelpRequest;
