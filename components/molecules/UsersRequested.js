import React from 'react';
import { View, FlatList } from 'react-native';
import Requester from './Requester';
import { Heading } from '../atoms';

const UsersRequested = (props) => {
  const { usersRequested, keyOfHelpRequest, noPeopleRequired , usersAccepted} = props;
  
  const getRequestedUser = ({ item }) => {
    const { xp, uid, stars, mobileNo, username } = item;
    const userDetails = { username, xp, stars, mobileNo, uidOfRequester: uid } 
    const helpRequestDetails = { keyOfHelpRequest, noPeopleRequired, usersAccepted }
    return <Requester userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
  }

  const getRequestedUserKey = (item, index) => {
    return "requestedusers" + item.key + index.toString() + new Date().getTime();
  }

  const heading = usersRequested.length ? <Heading>People who are willing to help you</Heading> : null

  return (
    <View>
        <FlatList
            data={usersRequested}
            renderItem={getRequestedUser}
            keyExtractor={getRequestedUserKey}
            listKey={getRequestedUserKey}
            ListHeaderComponent={heading}
        />
    </View>
  );
}

export default UsersRequested;