import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../../../fireBase/database';
import { FONT_FAMILY } from '../../../constants/styleConstants';
import Requester from './requester';
import DoneButton from '../buttons/doneButton';
import AccetedUser from './acceptedUser';
import Card from '../../common/card';
import { useQueue } from '../../../effects';

const HelpRequest = (props) => {
  const {data, db} = props;
  const { key, description, timeStamp,noPeopleRequired} = data;
  const [noPeopleAccepted, setNoPeopleAccepted] = useState(data.noPeopleAccepted);
  const [status,setStatus] = useState(data.status);
  const usersRequested = useQueue(`${db}/${key}/usersRequested`);
  const usersAccepted = useQueue(`${db}/${key}/usersAccepted`);

  updateState = (data) => {
    if(data.key === 'noPeopleAccepted')setNoPeopleAccepted(data.val());
    if(data.key === 'status')setStatus(data.val());
  }

  getRequestedUser = ({item}) => {
    const { data } = item;
    return <Requester uidOfRequestingHelper={data} keyOfHelpRequest={key} noPeopleAccepted={noPeopleAccepted} noPeopleRequired={noPeopleRequired} />
  }

  getAcceptedUser = ({item}) => {
    const { data } = item;
    return <AccetedUser uidOfAcceptedHelper={data} keyOfHelpRequest={key} />
  }

  useEffect(() => {
    firebaseOnEventListner(`${db}/${key}`,'child_changed', updateState);
    return () => {
      firebaseOnEventListnerTurnOff(`${db}/${key}`);
    }
  });

  getRequestedUserKey = (item, index) => {
    return "requestedusers"+item.data+index.toString()+new Date().getTime();
  }

  getAcceptedUserKey = (item, index) => {
    return "acceptedusers"+item.data+index.toString()+new Date().getTime();
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
            ListHeaderComponent={usersAccepted.length ? <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>{status === "COMPLETED" ? "people who helped you" : "People who are helping"}</Text> : null}
        />
        </View>}
        <DoneButton keyOfHelpRequest={key} status={status} />
        <Time time={timeStamp} />
      </Card>
  );
}

export default HelpRequest;