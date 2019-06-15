import React, { Component } from "react";
import { View, Alert } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "./helpDescription";
import HelpRequestModifier from "./helpRequestModifier";
import Time from "./time";
import HelpRequestHandler from "./helpRequestHandler";

class HelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helps");
    this.helpRequest = this.helps.child(this.key);
    this.usersPushed = this.helpRequest.child("usersPushed");
    this.pushedUpQuery = this.usersPushed.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.usersPulled = this.helpRequest.child("usersPulled");
    this.pulledUpQuery = this.usersPushed.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
    this.state = {
      pushUps: data.pushUps,
      pullUps: data.pullUps,
      usersPushed: false,
      usersPulled: false
    };
  }

  componentDidMount() {
    this.helpRequest
      .on("child_changed", data => {
        if (data.key === "pushUps" || data.key === "pullUps") {
          if(data.key === "pushUps")this.setState({ pushUps: data.val() });
          if(data.key === "pullUps")this.setState({ pullUps: data.val() });
        }
      });
    this.setPushUpStatus();
    this.setPullUpStatus();
  }

  updateHelpRequest = type => {
    const { pushUps,pullUps } = this.state;
    const { uid } = this;
    if (type === "push") {
      this.helpRequest.update({ pushUps: pushUps + 1 });
      this.usersPushed.push(uid).catch(err => {
        console.log(err);
      });
    } else {
      this.helpRequest.update({ pullUps: pullUps + 1 });
      this.usersPulled.push(uid).catch(err => {
        console.log(err);
      });
    }
  };

  setPushUpStatus = () => {
    this.pushedUpQuery.once("value", data => {
      if (data.val()) {
        this.setState({ usersPushed: true });
      }
    });
  };

  setPullUpStatus = () => {
    this.pulledUpQuery.once("value", data => {
      if (data.val()) {
        this.setState({ usersPulled: true });
      }
    });
  };

  handlePush = () => {
    if (!this.state.usersPushed) {
      this.updateHelpRequest("push");
      this.setPushUpStatus();
    } else {
      Alert.alert("u already pushed");
    }
  };

  handlePull = () => {
    if (!this.state.usersPulled) {
      this.updateHelpRequest("pull");
      this.setPullUpStatus();
    } else {
      Alert.alert("u already pulled");
    }
  };

  render() {
    const { data } = this.props;
    const { description, noPeople, title, distance, timeStamp } = data;
    const { pushUps } = this.state;
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
              distance
            }}
          />
          <HelpRequestModifier
            pushUps={pushUps}
            handlePush={() => this.handlePush()}
            handlePull={() => this.handlePull()}
          />
          <HelpRequestHandler />
          <Time time={timeStamp} />
        </View>
      </View>
    );
  }
}

export default HelpRequest;
