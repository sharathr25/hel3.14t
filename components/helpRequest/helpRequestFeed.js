import React, { Component } from "react";
import firebase from "react-native-firebase";
import { FlatList,Alert } from 'react-native';
import HelpRequest from "./helpRequest";
import Context from "../../context";
import { getDistanceFromLatLonInKm } from '../../utils';

const FIREBASE_FETCH_LIMIT = 5;
const HELPREQUEST_FEED_LIMIT = 50;
const HELPREQUEST_FEED_REMOVE_LIMIT = 5;

const sortByDistance = (helpRequests) => {
  const sortedHelpRequests = helpRequests.sort((a,b)=>{
    return a.distance>b.distance?1:-1
  })
  return sortedHelpRequests;
}

class HelpRequestFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpRequests: [],
      helpRequestsSortedByDistance:[],
      referenceToOldestKey: "",
      isLoading: false,
      lastKey:"",
    };
  }

  setHelpRequests = (keys,data) => {
    let { helpRequests } = this.state;
    const results = keys.map((key) => {
      return {...data[key],key}
    });
    const { locationProviderAvailable, locationErrorMessage, getLocation } = this.context;
    if(!locationProviderAvailable){
      Alert.alert(locationErrorMessage.length===0?'location not availabe':locationErrorMessage);
      return;
    }
    helpRequests = helpRequests.length >= HELPREQUEST_FEED_LIMIT ? helpRequests.splice(-HELPREQUEST_FEED_REMOVE_LIMIT) : helpRequests;
    const newHelpRequests = this.getHelpRequestsByDistance([...results,...helpRequests]);
    const helpRequestsSortedByDistance = sortByDistance(newHelpRequests);
    this.setState({ 
      helpRequests: newHelpRequests,
      helpRequestsSortedByDistance: helpRequestsSortedByDistance, 
      referenceToOldestKey: keys[0], 
      referenceToOldestStartKey: keys[keys.length - 1],
      isLoading: false });
  }

  getHelpRequestsByDistance = (helpRequests) => {
    const {latitude, locationProviderAvailable, longitude} = this.context;
    if(!locationProviderAvailable) return helpRequests;
    helpRequestsWithDistance = helpRequests.map((helpRequest) => {
      const currentLatitude = latitude
      const currentLongitude = longitude
      const lat1 = currentLatitude;
      const lon1 = currentLongitude;
      const lat2 = helpRequest.latitude;
      const lon2 = helpRequest.longitude;
      const dist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
      const newObj = {
        ...helpRequest,
        userLatitude: lat1,
        userLongitude: lon1,
        distance: dist
      };
      return newObj;
    });
    return helpRequestsWithDistance;
  }

  getHelpRequests = () => {
    const { db } = this.props;
    const { referenceToOldestKey,lastKey } = this.state;
    this.setState({ isLoading: true})
    firebase.database().ref(`${db}`).orderByKey().limitToLast(1).once("value", data => {
      if(lastKey !== Object.keys(data.val())[0]);{
        this.setState({lastKey:Object.keys(data.val())[0]});
      }
    });
    if(lastKey !== "" && referenceToOldestKey!=="" && referenceToOldestKey=== lastKey){
      this.setState({isLoading:false});
      return;//return if we are last key in firebase
    }if(referenceToOldestKey === ""){
      firebase.database().ref(`${db}`).orderByKey().limitToFirst(FIREBASE_FETCH_LIMIT).once("value", data => {
        const keys = Object.keys(data.val()).sort().reverse();
        this.setHelpRequests(keys, data.val())
      }).catch(err => {console.log(err);this.setState({isLoading: false})});
    } else {
      firebase.database().ref(`${db}`).orderByKey().startAt(referenceToOldestKey).limitToFirst(FIREBASE_FETCH_LIMIT+1).once("value", data => {
        const keys = Object.keys(data.val()).sort().slice(1).reverse();
        this.setHelpRequests(keys, data.val())
      }).catch(err => {console.log(err);this.setState({isLoading: false})});
    }
  }

  componentDidMount() {
    this.getHelpRequests();
    const {db} = this.props;
    firebase.database().ref(`/${db}`).on("child_removed", data => {
      const { helpRequests } = this.state;
      const newHelpRequests = helpRequests.filter((helpRequest)=>helpRequest.key !== data.key);
      this.setState({ helpRequests: newHelpRequests });
    });
  }

  getHelpRequest = ({item}) => {
    const { db } = this.props;
    const helpRequest = item;
    return (
      db!=="helps" 
        ? <HelpRequest data={helpRequest} key={helpRequest.key} disableFooter={false} /> 
        : <HelpRequest data={helpRequest} key={helpRequest.key} disableFooter={true} />
    );
  };

  render() {
    const { isLoading } = this.state;
    return (
      <FlatList
        data={this.state.helpRequestsSortedByDistance}
        renderItem={this.getHelpRequest}
        keyExtractor={(item, index) => index.toString()}
        onScroll={this.onScroll}
        refreshing={isLoading}
        onRefresh={this.getHelpRequests}
      />
    );
  }
}

HelpRequestFeed.contextType = Context;
export default HelpRequestFeed;
