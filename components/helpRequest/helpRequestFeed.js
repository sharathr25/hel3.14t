import React, { Component } from "react";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";
import HelpRequest from "./helpRequest";
import { getDistanceFromLatLonInKm } from "../../utils";
import geolocation from 'react-native-geolocation-service';

class HelpRequestFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpRequests: [],
      latitude: null,
      longitude: null,
      locationProviderAvailable: false,
      locationErrorMessage:""
    };
  }

  componentDidMount() {
    // geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log(position.coords.latitude, position.coords.longitude);
    //       this.setState({
    //         latitude:position.coords.latitude,
    //         longitude:position.coords.longitude,
    //         locationProviderAvailable: true
    //       });
    //   },
    //   (error) => {
    //       // See error code charts below.
    //       console.log(error.code, error.message);
    //       let locationErrorMessage;
    //       switch(error.code){
    //         case 1:locationErrorMessage="Location permission is not granted";break;
    //         case 2:locationErrorMessage="Location provider not available";break;
    //         case 3:locationErrorMessage="Location request timed out";break;
    //         case 4:locationErrorMessage="Google play service is not installed or has an older version";break;
    //         case 5:locationErrorMessage="Location service is not enabled or location mode is not appropriate for the current request";break;
    //       }
    //       this.setState({
    //         locationErrorMessage,
    //         locationProviderAvailable: false
    //       });
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
    const {db} = this.props;
    firebase.database().ref(`${db}`).on('child_moved', (data) => {
      console.log(data.val());
    });
    firebase.database().ref(`${db}`).on("child_added", data => {
      const { helpRequests } = this.state;
      const newObj = {...data.val(),key: data.key}
      this.setState({ helpRequests: [...helpRequests, newObj] });
    });
    firebase.database().ref(`/${db}`).on("child_removed", data => {
      const { helpRequests } = this.state;
      const newHelpRequests = helpRequests.filter((helpRequest)=>helpRequest.key !== data.key);
      this.setState({ helpRequests: newHelpRequests });
    });
  }

  handleLogOut = () => {
    const { navigation } = this.props;
    firebase.auth().signOut();
    navigation.navigate("Login", {});
  };

  getHelpRequests = () => {
    const { helpRequests } = this.state;
    const { db } = this.props;
    if (db!=="helps"){
      return helpRequests.map(helpRequest => (
        <HelpRequest data={helpRequest} key={helpRequest.key} disableFooter={false}/>
      ));
    } else {
      return helpRequests.map(helpRequest => (
        <HelpRequest data={helpRequest} key={helpRequest.key} disableFooter={true} />
      ));
    }
  };

  render() {
    return (
      <ScrollView>
        {this.getHelpRequests()}
      </ScrollView>
    );
  }
}

export default HelpRequestFeed;
