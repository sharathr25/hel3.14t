import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import { FONT_FAMILY, STATUS_COLOR_MAPPING } from '../../../constants/styleConstants';
import DoneButton from '../buttons/doneButton';
import Requester from './requester';
import Accepter from './accepter';
import Card from '../../common/card';
import Status from '../../common/status';

const HelpRequest = (props) => {
  const { keyOfHelpRequest, showDone = true } = props;

  const QUERY = gql`
    query {
      help(id:"${keyOfHelpRequest}") {
        status,
        description,
        usersAccepted {
          uid
          name
          mobileNo
          stars
        },
        usersRequested {
          uid
          name,
          xp,
          stars
        },
        timeStamp,
        noPeopleRequired
      }
    }
  `;

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
          xp,
          stars
        },
    }
  }
  `;

  let { data } = useQuery(QUERY);

  const subscriptionData = useSubscription(SUBSCRIPTION, { shouldResubscribe: true });

  let updatedData = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateHelp || null;

  if (updatedData) {
    const { _id } = updatedData;
    if (_id === keyOfHelpRequest) {
      data.help = { ...data.help, ...updatedData }
    }
  }

  if (!data) return null;

  const { help } = data;

  const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired } = help;

  getRequestedUser = ({ item }) => {
    const { name, xp, uid, stars } = item;
    return <Requester uidOfRequester={uid} name={name} xp={xp} stars={stars} keyOfHelpRequest={keyOfHelpRequest} usersAccepted={usersAccepted} noPeopleRequired={noPeopleRequired} />
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

  if (status === "COMPLETED") {
    return (
      <Card borderLeftColor={STATUS_COLOR_MAPPING[status]}>
        <HelpDescription data={{ description }} />
        <Status>{status}</Status>
        <View>
          <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            listKey={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Text style={{ fontFamily: FONT_FAMILY, marginBottom: 5 }}>people who helped you</Text> : null}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card borderLeftColor={STATUS_COLOR_MAPPING[status]}>
      <HelpDescription data={{ description }} />
      <View>
        <Status>{status}</Status>
        <FlatList
          data={usersRequested}
          renderItem={getRequestedUser}
          keyExtractor={getRequestedUserKey}
          listKey={getRequestedUserKey}
          ListHeaderComponent={usersRequested.length ? <Text style={{ fontFamily: FONT_FAMILY, marginBottom: 5 }}>People Willing to help you</Text> : null}
        />
      </View>
      <View>
        <FlatList
          data={usersAccepted}
          renderItem={getAcceptedUser}
          keyExtractor={getAcceptedUserKey}
          listKey={getAcceptedUserKey}
          ListHeaderComponent={usersAccepted.length ? <Text style={{ fontFamily: FONT_FAMILY, marginBottom: 5 }}>People who are helping</Text> : null}
        />
      </View>
      {showDone && <DoneButton keyOfHelpRequest={keyOfHelpRequest} status={status} usersAccepted={usersAccepted} />}
      <Time time={timeStamp} />
    </Card>
  );
}

export default HelpRequest;