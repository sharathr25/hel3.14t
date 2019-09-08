import React, { Component } from "react";
import { View, Alert } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "./helpDescription";
import HelpRequestModifier from "./helpRequestFooter";
import Time from "../time";
import ProgressBar from '../progressBar';
import HelpRequestRequestedUsers from './helpRequestUserRequested';

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
    this.usersPushed = this.helpRequest.child("usersPushed");
    this.usersRequested = this.helpRequest.child("usersRequested");
    this.usersAccepted= this.helpRequest.child("usersAccepted");
    this.usersRejected = this.helpRequest.child("usersRejected");
    this.usersPulled = this.helpRequest.child("usersPulled");
    this.helpedUpQuery = this.usersAccepted.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.pushedUpQuery = this.usersPushed.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.pulledUpQuery = this.usersPulled.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.requestedQuery = this.usersRequested.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.rejectedQuery = this.usersRejected.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.state = {
      pushUps: data.pushUps,
      pullUps: data.pullUps,
      noPeopleRequired: data.noPeopleRequired,
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
      if (data.key === "noPeopleAccepted") {
        if( data.val() === this.state.noPeopleRequired ){
          this.updateHelpRequest("helpingStartedAt",new Date().getTime(),null);
          this.updateHelpRequest("status","ON_GOING",null);
          this.setState({ disableHelp : true, helpErrorMessage: "Helpers Filled, try helping others" });
        }
      }
    });
    this.setPushUpStatus();
    this.setPullUpStatus();
    this.setHelpButtonStatus();
  }

  componentWillUnmount(){
    this.helpRequest.off();
  }

  updateHelpRequest = (key,value,userDb,uid) => {
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
    const { noPeopleRequired } = this.state;
    this.noPeopleAccepted.once("value", data => {// here we need to this to 'noPeopleAccepted' later when the help request creator accepts who ever is willing to help
      if(data.val() === noPeopleRequired){
        this.updateHelpRequest("helpingStartedAt",new Date().getTime(),null);
        this.updateHelpRequest("status","ON_GOING",null);
        this.setState({ disableHelp : true , helpErrorMessage: "Helpers Filled, try helping others" });
        // this.helpRequest.once('value', (data) => {
        //   firebase.database().ref('/helping').push(data.val(),() => {
        //     this.helpRequest.remove();
        //     //TODO: need to set status:ONGOING rather than removing
        //     //TODO: need to remove this help request in 'Your requested'
        //   });
        // });
      }
    });
    this.requestedQuery.once("value", data => {
      if(data.val()){
        this.setState({disableHelp: true, helpErrorMessage: "You have requested please wait..." })
      }
    })
    this.helpedUpQuery.once("value", data => {
      if(data.val()){
        this.setState({disableHelp: true , helpErrorMessage: "You are already helping" })
      }
    })
    this.rejectedQuery.once("value", data => {
      if(data.val()){
        this.setState({disableHelp: true, helpErrorMessage: "You have rejected, try help others"  })
      }
    })
  }

  handlePush = () => {
    const { pushUps,userPushed } = this.state;
    if (!userPushed) {
      this.updateHelpRequest("pushUps", pushUps+1 ,this.usersPushed, this.uid);
      this.setPushUpStatus();
    } else {
      Alert.alert("u already pushed");
    }
  };

  handlePull = () => {
    const { pullUps,userPulled } = this.state;
    if (!userPulled) {
      this.updateHelpRequest("pullUps", pullUps+1, this.usersPulled, this.uid);
      this.setPullUpStatus();
    } else {
      Alert.alert("u already pulled");
    }
  };

  handleHelp = () => {
    //TODO: we have send help requested user a notification. If he accepts then only we will allow this guy to help
    const { noPeopleRequested,disableHelp } = this.state;
    if(!disableHelp){
      this.updateHelpRequest("noPeopleRequested",noPeopleRequested+1, this.usersRequested, this.uid);
      this.setHelpButtonStatus();
    } else {
      Alert.alert(this.state.helpErrorMessage);
    }
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
        this.updateHelpRequest("noPeopleAccepted",noPeopleAccepted+1, this.usersAccepted, helperUid);
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
    const { pushUps, pullUps, noPeopleRequired, noPeopleRequested,status } = this.state;
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
              noPeopleRequired,
              distance,
              noPeopleRequested,
              status
            }}
            getUsersHelping={this.usersAccepted}
          />
          <ProgressBar pushUps={pushUps} pullUps={pullUps}/>
          {this.props.disableFooter && <HelpRequestModifier
            pushUps={pushUps}
            pullUps={pullUps}
            handlePush={() => this.handlePush()}
            handlePull={() => this.handlePull()}
            handleHelp={() => this.handleHelp()}
          />}
          {this.props.type === "USER" && <HelpRequestRequestedUsers handleAccept={(helperUid) => this.handleAccept(helperUid)} handleReject={(helperUid) => this.handleReject(helperUid)} usersRequestedDb={this.usersRequested} usersAcceptedDb={this.usersAccepted} />}
          <Time time={timeStamp} />
        </View>
      </View>
    );
  }
}

export default HelpRequest;
