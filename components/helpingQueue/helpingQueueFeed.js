import React, { Component } from "react";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";
import HelpRequest from "../helpRequest/helpRequest";
import { getDistanceFromLatLonInKm } from "../../utils";

class HelpingQueueFeed extends Component {
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
    firebase.database().ref("/helping").on("child_added", data => {
      const { helpRequests } = this.state;
      const newObj = { key: data.key, ...data.val(), distance: 10,}; // need to change this , will depends on user and help request
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
    return (
      <>
        <ScrollView>
          {this.getHelpRequests()}
        </ScrollView>
      </>
    );
  }
}

export default HelpingQueueFeed;
