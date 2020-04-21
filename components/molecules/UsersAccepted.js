import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Accepter from '../molecules/Accepter';
import { Heading } from '../atoms';
import { LIGHTEST_GRAY } from '../../styles/colors';
import { margin } from '../../styles/mixins';

const UsersAccepted = ({usersAccepted, keyOfHelpRequest, status }) => {
  getAcceptedUser = ({ item }) => {
    const { mobileNo, stars, uid, username } = item;
    const userDetails = { username, mobileNo, stars, uidOfAccepter: uid }
    const helpRequestDetails = { keyOfHelpRequest, status }
    return <Accepter userDetails={userDetails} helpRequestDetails={helpRequestDetails} />
  }

  getAcceptedUserKey = (item, index) => {
    return "acceptedusers" + item.key + index.toString() + new Date().getTime();
  }

  return (
    <View>
        <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            listKey={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Heading>People who are helping</Heading> : null}
        />
    </View>
  );
}

export default UsersAccepted;

const styles = StyleSheet.create({
  CTAContainerStyle: {
    flexDirection: 'row', 
    alignItems: 'center' , 
    backgroundColor: LIGHTEST_GRAY, 
    ...margin(10,0,10,0), 
    padding: 10,
    justifyContent: 'space-between'
  }
});