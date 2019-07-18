/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
import React, { Component } from "react";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";
import HelpRequest from "../helpRequest/helpRequest";
import { getDistanceFromLatLonInKm } from "../../utils";
import Loader from "../loader";

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
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      firebase
        .database()
        .ref("/helping")
        .on("child_added", data => {
          const { helpRequests, latitude, longitude } = this.state;
          const currentLatitude = latitude || position.coords.latitude;
          const currentLongitude = longitude || position.coords.longitude;
          const lat1 = currentLatitude;
          const lon1 = currentLongitude;
          const lat2 = data.val().latitude;
          const lon2 = data.val().longitude;
          const dist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
          if (dist < 100) { // need to change this distance
            const newObj = {
              ...data.val(),
              userLatitude: lat1,
              userLongitude: lon1,
              distance: dist,
              key: data.key
            };
            const index = helpRequests.findIndex(helpRequest => {
              return helpRequest.distance > dist;
            });
            if (index === -1) {
              this.setState({ helpRequests: [...helpRequests, newObj] });
            } else {
              this.setState({
                helpRequests: [
                  ...helpRequests.slice(0, index),
                  newObj,
                  ...helpRequests.slice(index)
                ]
              });
            }
          }
        });
    });
    navigator.geolocation.watchPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
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
        {/* <Loader loaderVisible={this.state.helpRequests.length !== 0} /> */}
        <ScrollView>
          {this.getHelpRequests()}
        </ScrollView>
      </>
    );
  }
}

export default HelpingQueueFeed;
