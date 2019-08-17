import React, { Component } from "react";
import firebase from "react-native-firebase";
import { ScrollView } from "react-native-gesture-handler";
import HelpRequest from "./helpRequest";
import { getDistanceFromLatLonInKm } from "../../utils";
import Geolocation from 'react-native-geolocation-service';

class HelpRequestFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpRequests: []
    };
  }

  componentDidMount() {
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
