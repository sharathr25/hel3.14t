import React, { useState, useEffect, useContext } from 'react';
import { Text, View, FlatList } from 'react-native';
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../../../fireBase/database';
import { FONT_FAMILY } from '../../../constants/styleConstants';
import Requester from './requester';
import DoneButton from '../buttons/doneButton';
import AccetedUser from '../common/acceptedUser';
import Card from '../../common/card';
import Context from '../../../context';
import { HELPS_REQUESTED_DB } from '../../../constants/appConstants';
import { useQueue } from '../../../fireBase/effects';

const HelpRequestRequestedUsers = (props) => {
  const contextValues = useContext(Context);
  const { currentUser } = contextValues;
  const { uid } = currentUser;
  const {data} = props;
  const { key, description, timeStamp} = data;
  const [noPeopleAccepted, setNoPeopleAccepted] = useState(data.noPeopleAccepted);
  const [status,setStatus] = useState(data.status);
  const usersRequested = useQueue(`${HELPS_REQUESTED_DB}/${key}/usersRequested`);
  const usersAccepted = useQueue(`${HELPS_REQUESTED_DB}/${key}/usersAccepted`);

  updateState = (data) => {
    if(data.key === 'noPeopleAccepted')setNoPeopleAccepted(data.val());
    if(data.key === 'status')setStatus(data.val());
  }

  getRequestedUser = ({item}) => {
    const { data } = item;
    return <Requester uidOfRequestingHelper={data} keyOfHelpRequest={key} noPeopleAccepted={noPeopleAccepted}/>
  }

  getAcceptedUser = ({item}) => {
    const { data } = item;
    return <AccetedUser uidOfAcceptedHelper={data} keyOfHelpRequest={key}/>
  }

  useEffect(() => {
    firebaseOnEventListner(`${HELPS_REQUESTED_DB}/${key}`,'child_changed', updateState);
    return () => {
      firebaseOnEventListnerTurnOff(`${HELPS_REQUESTED_DB}/${key}`);
    }
  },[key]);

  return (
      <Card>
        <HelpDescription data={{ description }} />
        {usersRequested.length !== 0 && <View style={{margin: 10}}>
        <Text>{status}</Text>
        <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People Willing to help you</Text>
        <FlatList
            data={usersRequested}
            renderItem={getRequestedUser}
            keyExtractor={(item, index) => index.toString()}
            listKey="requested users"
        />
        </View>}
        {usersAccepted.length !== 0 && <View style={{margin: 10}}>
        <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People who are helping</Text>
        <FlatList
            data={usersAccepted}
            renderItem={getAcceptedUser}
            keyExtractor={(item, index) => index.toString()}
            listKey="accepted users"
        />
        </View>}
        <DoneButton keyOfHelpRequest={key} data={data}/>
        <Time time={timeStamp} />
      </Card>
  );
}

export default HelpRequestRequestedUsers;