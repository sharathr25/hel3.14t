import React from "react";
import { FlatList, Platform, UIManager, Text } from 'react-native';
import { getDistanceFromLatLonInKm, sortByDistance } from '../../utils';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { HelpRequest } from "../molecules";
import { useLocation } from "../../customHooks";

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
      status,
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

const HelpRequestFeed = (props) => {
  const { longitude, latitude, locationProviderAvailable } = useLocation();
  const { loading, data, error, fetchMore } = useQuery(HELPS, {
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
  //   helps = [newHelp, ...helps];
  //   newHelp = null;
  // }

  if (error) return <Text>{error.networkError}</Text>

  gethelpRequestsSortedByDistance = (feedItems) => {
    const newHelpRequests = getHelpRequestsByDistance(feedItems);
    const helpRequestsSortedByDistance = sortByDistance(newHelpRequests);
    return helpRequestsSortedByDistance;
  }

  getHelpRequestsByDistance = (helpRequests) => {
    if (!locationProviderAvailable) return helpRequests;
    return helpRequests.filter(({ status }) => status === "REQUESTED").map((helpRequest) => {
      const lattitudeOfUser = latitude;
      const longitudeOfUser = longitude;
      const lattitudeOfHelpRequest = helpRequest.latitude;
      const longitudeOfHelpRequest = helpRequest.longitude;
      const dist = getDistanceFromLatLonInKm(lattitudeOfUser, longitudeOfUser, longitudeOfHelpRequest, lattitudeOfHelpRequest);
      const newObj = {
        ...helpRequest,
        userLatitude: lattitudeOfUser,
        userLongitude: longitudeOfUser,
        distance: dist
      };
      return newObj;
    });
  }

  getHelpRequest = ({ item }) => {
    return <HelpRequest data={item} key={item._id} />
  }

  return (
    <FlatList
      data={gethelpRequestsSortedByDistance(data ? data.helps : [])}
      renderItem={getHelpRequest}
      keyExtractor={(_, index) => index.toString()}
      refreshing={loading}
      onRefresh={getHelps}
    />
  );
}

export default HelpRequestFeed;
