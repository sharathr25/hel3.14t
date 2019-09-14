import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "./helpDescription";
import Time from "../time";
import HelpButton from "../helpButton";
import LikeButton from "../likeButton";

class HelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helps");
    this.helpRequest = this.helps.child(this.key);
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
            {/* <LikeButton helpRequest={this.helpRequest} data={data}/> */}
            <HelpButton data={data} helpRequest={this.helpRequest}/>
          </View>
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
