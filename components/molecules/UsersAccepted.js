// @flow
import React from 'react';
import { View, FlatList } from 'react-native';
import Accepter from '../molecules/Accepter';
import { Heading } from '../atoms';

type UsersAcceptedProps = {
  usersAccepted: [Object],
  keyOfHelpRequest: string,
  status: string
}

const UsersAccepted = ({usersAccepted, keyOfHelpRequest, status }:UsersAcceptedProps) => {
  const getAcceptedUser = ({ item }) => {
    const { mobileNo, stars, uid, username } = item;
    const userDetails = { username, mobileNo, stars, uidOfAccepter: uid }
    const helpRequestDetails = { keyOfHelpRequest, status }
    return <Accepter userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
  }

  const getAcceptedUserKey = (item : { key:string }, index) => {
    return "acceptedusers" + item.key + index + `${new Date().getTime()}`;
  }

  const heading = status === "COMPLETED" ? "Contributors who helped you" : "Contributors who are helping you"

  return (
    <View>
        <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Heading>{heading}</Heading> : null}
        />
    </View>
  );
}

export default UsersAccepted;