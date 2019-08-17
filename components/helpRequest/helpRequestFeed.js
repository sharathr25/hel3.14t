import React, { Component } from "react";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";
import HelpRequest from "./helpRequest";
import { getDistanceFromLatLonInKm } from "../../utils";
import Geolocation from 'react-native-geolocation-service';

class HelpRequestFeed extends Component {
  constructor(props) {
    super(props);
    // const { navigation } = this.props;
    // const {
    //   displayName, email, phoneNumber, uid
    // } = navigation.state.params.currentUser;
    this.state = {
      // name: displayName,
      // mobileNumber: phoneNumber,
      // email,
      // uid,
      helpRequests: [],
      latitude: null,
      longitude: null
    };
  }

  componentDidMount() {
    firebase.database().ref('/helps').on('child_moved', (data) => {
      console.log(data.val());
    });
    firebase.database().ref("/helps").on("child_added", data => {
      const { helpRequests } = this.state;
      const newObj = {...data.val(),key: data.key}
          this.setState({ helpRequests: [...helpRequests, newObj] });
    });
  }

  handleLogOut = () => {
    const { navigation } = this.props;
    firebase.auth().signOut();
    navigation.navigate("Login", {});
  };

  getHelpRequests = () => {
    const { helpRequests } = this.state;
    return helpRequests.map(helpRequest => (
      <HelpRequest data={helpRequest} key={helpRequest.key} />
    ));
  };

  render() {
    console.log(this.state.helpRequests.length);
    return (
      <>
        <ScrollView>
          {this.getHelpRequests()}
        </ScrollView>
      </>
    );
  }
}

export default HelpRequestFeed;
