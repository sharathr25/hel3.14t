import React, { useContext } from "react";
import { FlatList,Platform,UIManager } from 'react-native';
import Context from "../../../context";
import { getDistanceFromLatLonInKm, sortByDistance } from '../../../utils';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const HelpRequestFeed = (props) => {
  console.log(props.feedItems);
  const contextValues = useContext(Context);

  gethelpRequestsSortedByDistance = (feedItems) => {
    const newHelpRequests = getHelpRequestsByDistance(feedItems);
    const helpRequestsSortedByDistance = sortByDistance(newHelpRequests);
    return helpRequestsSortedByDistance;
  }

  getHelpRequestsByDistance = (helpRequests) => {
    const {latitude, locationProviderAvailable, longitude} = contextValues;
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
    const { feedItems } = props;
    if(feedItems.length === 0) return;
    setHelpRequestsWithDistance(feedItems);
  }

  getHelpRequest = ({item}) => {
    const {ChildComponent} = props;
    return <ChildComponent data={item} key={item.key} />
  }

  return (
    <FlatList
        data={gethelpRequestsSortedByDistance(props.feedItems)}
        renderItem={getHelpRequest}
        keyExtractor={(item, index) => index.toString()}
        refreshing={props.isLoading}
        onRefresh={props.getFeedItems}
      />
  );
}

export default HelpRequestFeed;
