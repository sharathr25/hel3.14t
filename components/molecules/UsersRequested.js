import React from 'react';
import { View, FlatList } from 'react-native';
import Requester from './Requester';
import { Heading } from '../atoms';

const UsersRequested = ({ usersRequested, keyOfHelpRequest, noPeopleRequired , usersAccepted}) => {
  getRequestedUser = ({ item }) => {
    const { xp, uid, stars, mobileNo, username } = item;
    const userDetails = { username, xp, stars, mobileNo, uidOfRequester: uid } 
    const helpRequestDetails = { keyOfHelpRequest, noPeopleRequired, usersAccepted }
    return <Requester userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
  }

  getRequestedUserKey = (item, index) => {
    return "requestedusers" + item.key + index.toString() + new Date().getTime();
  }

  return (
    <View>
        <FlatList
            data={usersRequested}
            renderItem={getRequestedUser}
            keyExtractor={getRequestedUserKey}
            listKey={getRequestedUserKey}
            ListHeaderComponent={usersRequested.length ? <Heading>People who are willing to help you</Heading> : null}
        />
    </View>
  );
}

export default UsersRequested;