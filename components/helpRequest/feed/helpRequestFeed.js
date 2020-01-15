import React, { useContext, useEffect, useState } from "react";
import { FlatList, Platform, UIManager, Text } from 'react-native';
import Context from "../../../context";
import { getDistanceFromLatLonInKm, sortByDistance } from '../../../utils';
import gql from 'graphql-tag';
import { useQuery, useSubscription, useLazyQuery } from 'react-apollo';
import HelpRequest from "./helpRequest";

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const HELPS = gql`
  query Helps($offset:Int!) {
    helps(offset:$offset) {
      _id,
      latitude,
      longitude,
      timeStamp,
      description,
      usersAccepted{
        uid,
        name,
        mobileNo
      },
      usersRequested{
        uid,
        name,
        xp
      },
      usersRejected {
        uid
      },
      noPeopleRequired,
      creator
    }
  }
`;

const HELPS_SUBSCRIPITON = gql`
subscription {
  onCreateHelp{
    _id,
    latitude,
    longitude,
    timeStamp,
    description,
    usersAccepted{
      uid,
      name,
      mobileNo
    }
    usersRequested{
      uid,
      name,
      xp
    },
    usersRejected {
      uid
    }
    noPeopleRequired,
    creator
  }
}
`;


const HelpRequestFeed = (props) => {
  const contextValues = useContext(Context);
  const {  loading, data,error, fetchMore } = useQuery(HELPS,{ variables: { offset: 0}});
  const [offset, setOffset] = useState(0);

  // const subscriptionData = useSubscription(HELPS_SUBSCRIPITON);

  getHelps = () => {
    fetchMore({
      variables: {
        offset: offset+1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          helps: [...prev.helps, ...fetchMoreResult.helps]
        });
      }
    });
    setOffset(offset+1);
  }

  if (loading) return <Text>loading</Text>
  else if (error) return <Text>Error</Text>

  gethelpRequestsSortedByDistance = (feedItems) => {
    const newHelpRequests = getHelpRequestsByDistance(feedItems);
    const helpRequestsSortedByDistance = sortByDistance(newHelpRequests);
    return helpRequestsSortedByDistance;
  }

  getHelpRequestsByDistance = (helpRequests) => {
    const { latitude, locationProviderAvailable, longitude } = contextValues;
    if (!locationProviderAvailable) return helpRequests;
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

  getHelpRequest = ({ item }) => {
    return <HelpRequest data={item} key={item._id} />
  }

  return (
    <FlatList
      data={gethelpRequestsSortedByDistance(data ? data.helps : [])}
      renderItem={getHelpRequest}
      keyExtractor={(item, index) => index.toString()}
      refreshing={false}
      onRefresh={getHelps}
    />
  );
}

export default HelpRequestFeed;
