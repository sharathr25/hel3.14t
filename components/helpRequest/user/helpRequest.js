import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import { getDataFromFirebase } from '../../../fireBase/database';
import { FONT_FAMILY } from '../../../constants/styleConstants';
import Requester from './requester';
import DoneButton from '../buttons/doneButton';
import AccetedUser from './acceptedUser';
import Card from '../../common/card';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

const HelpRequest = (props) => {
  const {keyOfHelpRequest} = props;

  const QUERY = gql`
    query {
      help(id:"${keyOfHelpRequest}") {
        status,
        description,
        usersAccepted {
          name
          mobileNo
        },
        usersRequested {
          uid
          name,
          xp
        },
        timeStamp,
        noPeopleRequired
      }
    }
  `;
  const {data} = useQuery(QUERY);

  if(!data) return null;

  const { help } = data;

  const { status, usersRequested, usersAccepted, description, timeStamp, noPeopleRequired } = help;

  getRequestedUser = ({item}) => {
    const { name, xp, uid } = item;
    return <Requester uidOfRequester={uid} name={name} xp={xp} keyOfHelpRequest={keyOfHelpRequest} usersAccepted={usersAccepted} noPeopleRequired={noPeopleRequired} />
  }

  getAcceptedUser = ({item}) => {
    const { name, mobileNo } = item;
    return <AccetedUser name={name} mobileNo={mobileNo} status={status} />
  }

  getRequestedUserKey = (item, index) => {
    return "requestedusers"+item.key+index.toString()+new Date().getTime();
  }

  getAcceptedUserKey = (item, index) => {
    return "acceptedusers"+item.key+index.toString()+new Date().getTime();
  }

  if(!status) return null;

  if(status === "COMPLETED") {
    return (
      <Card>
        <HelpDescription data={{ description }} />
        {<View style={{ margin: 10 }}>
          <Text>{status}</Text>
        </View>}
        {<View style={{ margin: 10 }}>
          <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            listKey={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Text style={{ fontFamily: FONT_FAMILY, marginBottom: 5 }}>people who helped you</Text> : null}
          />
        </View>}
      </Card>
    );
  }

  return (
      <Card>
        <HelpDescription data={{ description }} />
        {<View style={{margin: 10}}>
        <Text>{status}</Text>
        <FlatList
            data={usersRequested}
            renderItem={getRequestedUser}
            keyExtractor={getRequestedUserKey}
            listKey={getRequestedUserKey}
            ListHeaderComponent={usersRequested.lnegth ? <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People Willing to help you</Text> : null}
        />
        </View>}
        {<View style={{margin: 10}}>  
        <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={getAcceptedUserKey}
            listKey={getAcceptedUserKey}
            ListHeaderComponent={usersAccepted.length ? <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People who are helping</Text> : null}
        />
        </View>}
        <DoneButton keyOfHelpRequest={keyOfHelpRequest} status={status} />
        <Time time={timeStamp} />
      </Card>
  );
  return null;
}

export default HelpRequest;