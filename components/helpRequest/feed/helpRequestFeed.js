import React, { useContext } from "react";
import { FlatList, Platform, UIManager, Text } from 'react-native';
import Context from "../../../context";
import { getDistanceFromLatLonInKm, sortByDistance } from '../../../utils';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import HelpRequest from "./helpRequest";
import { useLocation } from "../../../customHooks";

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

// const HELPS_CREATE_SUBSCRIPITON = gql`
// subscription {
//   onCreateHelp{
//     _id,
//     latitude,
//     longitude,
//     timeStamp,
//     description,
//     usersAccepted{
//       uid,
//       name,
//       mobileNo
//     }
//     usersRequested{
//       uid,
//       name,
//       xp
//     },
//     usersRejected {
//       uid
//     }
//     noPeopleRequired,
//     creator
//   }
// }
// `;

let helps = [];

const HelpRequestFeed = (props) => {
  const { locationErrorMessage, longitude, latitude, locationProviderAvailable } = useLocation();
  const contextValues = useContext(Context);
  const { loading, data, error, fetchMore} = useQuery(HELPS, {
    variables: {
      offset: 0
    },
    fetchPolicy: "cache-and-network"
  });

  const getHelps = () => {
    fetchMore({
      variables: {
        offset: data.helps.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          helps: [...prev.helps, ...fetchMoreResult.helps]
        });
      }
    })
  }

  // const subscriptionDataForNewHelp = useSubscription(HELPS_CREATE_SUBSCRIPITON);

  // let newHelp = subscriptionDataForNewHelp && subscriptionDataForNewHelp.data && subscriptionDataForNewHelp.data.onCreateHelp || null;

  // if (newHelp) {
  //   console.log(helps, "**************");
  //   helps = [newHelp, ...helps];
  //   console.log(helps, "______________");
  //   newHelp = null;
  // }

  if (loading) return <Text>loading</Text>
  else if (error) return <Text>Error</Text>

  gethelpRequestsSortedByDistance = (feedItems) => {
    const newHelpRequests = getHelpRequestsByDistance(feedItems);
    const helpRequestsSortedByDistance = sortByDistance(newHelpRequests);
    return helpRequestsSortedByDistance;
  }

  getHelpRequestsByDistance = (helpRequests) => {
    // const { latitude, locationProviderAvailable, longitude } = contextValues;
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
      data={gethelpRequestsSortedByDistance(data.helps)}
      renderItem={getHelpRequest}
      keyExtractor={(item, index) => index.toString()}
      refreshing={false}
      onRefresh={getHelps}
    />
  );
}

export default HelpRequestFeed;
