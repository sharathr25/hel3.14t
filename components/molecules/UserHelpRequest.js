import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import { FONT_FAMILY, STATUS_COLOR_MAPPING } from '../../components/atoms/Status';
import DoneButton from './buttons/doneButton';
import Requester from './Requester';
import Accepter from './Accepter';
import { Status, Time, Card } from '../atoms';
import { FONT_FAMILY_BOLD, FONT_SIZE_16, FONT_WEIGHT_BOLD, FONT_FAMILY_REGULAR } from '../../styles/typography';
import { margin } from '../../styles/mixins';

const SUBSCRIPTION = gql`
    subscription{
      onUpdateHelp{
        _id,
        status,
        usersAccepted {
          uid
          name
          mobileNo,
          xp,
          stars
        },
        usersRequested {
          uid
          name,
          mobileNo,
          xp,
          stars
        },
    }
  }
  `;

  const QUERY = gql`
    query Help($id: String!){
      help(id:$id) {
        status,
        description,
        usersAccepted {
          uid
          name
          mobileNo
          xp
          stars
        },
        usersRequested {
          uid
          name,
          xp,
          mobileNo,
          stars
        },
        timeStamp,
        noPeopleRequired
      }
    }
  `;

const getUpdatedData = (newData, oldData, keyOfHelpRequest) => {
  const { _id } = newData;
    if (_id === keyOfHelpRequest) {
      return { ...oldData, ...newData }
    }
    return oldData;
}

const UserHelpRequest = (props) => {
  const { keyOfHelpRequest, showDone = true } = props;
  let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }});
  const subscriptionData = useSubscription(SUBSCRIPTION, { shouldResubscribe: true });

  if (!data) return null;
  if(subscriptionData.data) {
    data.help = getUpdatedData(subscriptionData.data.onUpdateHelp, data.help, keyOfHelpRequest);
  }

  const { help } = data;
  const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired } = help;

  getRequestedUser = ({ item }) => {
    const { name, xp, uid, stars, mobileNo } = item;
    return <Requester 
      uidOfRequester={uid} 
      name={name} xp={xp} 
      stars={stars} 
      keyOfHelpRequest={keyOfHelpRequest} 
      usersAccepted={usersAccepted} 
      noPeopleRequired={noPeopleRequired} 
      mobileNo={mobileNo}
    />
  }

  getAcceptedUser = ({ item }) => {
    const { name, mobileNo, stars, uid } = item;
    return <Accepter name={name} mobileNo={mobileNo} status={status} stars={stars} keyOfHelpRequest={keyOfHelpRequest} uidOfAccepter={uid} />
  }

  getRequestedUserKey = (item, index) => {
    return "requestedusers" + item.key + index.toString() + new Date().getTime();
  }

  getAcceptedUserKey = (item, index) => {
    return "acceptedusers" + item.key + index.toString() + new Date().getTime();
  }

  if (!status) return null;

  return (
    <Card borderLeftColor={STATUS_COLOR_MAPPING[status]}>
      <Text style={styles.descriptionStyle}>{description}</Text>
      <Status>{status}</Status>
      <View>
        <FlatList
          data={usersRequested}
          renderItem={getRequestedUser}
          keyExtractor={getRequestedUserKey}
          listKey={getRequestedUserKey}
          ListHeaderComponent={usersRequested.length ? <Text style={{ fontFamily: FONT_FAMILY_REGULAR, marginBottom: 5 }}>People Willing to help you</Text> : null}
        />
      </View>
      <View>
        <FlatList
          data={usersAccepted}
          renderItem={getAcceptedUser}
          keyExtractor={getAcceptedUserKey}
          listKey={getAcceptedUserKey}
          ListHeaderComponent={usersAccepted.length ? <Text style={{ fontFamily: FONT_FAMILY_REGULAR, marginBottom: 5 }}>People who are helping</Text> : null}
        />
      </View>
      {showDone && status !== "COMPLETED" && <View style={{ ...margin(5, 0, 0, 0) }}><DoneButton keyOfHelpRequest={keyOfHelpRequest} status={status} usersAccepted={usersAccepted} /></View>}
      <Time time={timeStamp} />
    </Card>
  );
}

export default UserHelpRequest;

const styles = StyleSheet.create({
  descriptionStyle: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE_16,
    fontWeight: FONT_WEIGHT_BOLD
  }
});