import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import HelpButton from "../buttons/helpButton";
import ReferButton from "../buttons/referButton";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from "../../../fireBase/database";
import NoOfHelpers from './noOfHelpers';
import Distance from '../../common/distance';

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
      noPeopleRequired:data.noPeopleRequired,
      status: data.status,
      userPushed: false,
      userPulled: false,
      userHelping: false,
      disableHelp: false,
      helpErrorMessage: ""
    };
  }

  updateState = (data) => {
    this.setState( { [data.key]: data.val() })
  }
  
  componentDidMount() {
    firebaseOnEventListner(`helps/${this.key}`,"child_changed",this.updateState)
  }
  
  componentWillUnmount(){
    firebaseOnEventListnerTurnOff(`helps/${this.key}`)
  }

  render() {
    const { data } = this.props;
    const { description, distance, timeStamp } = data;
    const { noPeopleAccepted, noPeopleRequired} = this.state;
    return (
      <View style={styles.outerContanier}>
        <View style={styles.innerContaner}>
          <HelpDescription data={{ description }}
          />
          <NoOfHelpers noPeopleAccepted={noPeopleAccepted} noPeopleRequired={noPeopleRequired} />
          <View style={styles.buttons}>
            <HelpButton data={data} helpRequest={this.helpRequest}/>
            <ReferButton data={data} helpRequest={this.helpRequest}/>
          </View>
          <View style={styles.timeAndDistance}>
            <Time time={timeStamp} /><Distance distance={distance} />
          </View>
        </View>
      </View>
    );
  }
}

export default HelpRequest;

const styles = StyleSheet.create({
  outerContanier: {
    margin:10,
    borderRadius: 5,
    flexDirection: "row",
    elevation: 5
  },
  innerContaner: {
    flex: 5,
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  },
  timeAndDistance:{
    flex: 1,
    flexDirection: 'row',
  }
});
