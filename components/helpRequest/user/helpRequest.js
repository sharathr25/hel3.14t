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
import { useQueue, useVal } from '../../../effects';

const HelpRequest = (props) => {
  const {keyOfHelpRequest, db, test} = props;
  const [description,setDescription] = useState('');
  const [timeStamp,setTimeStamp] = useState('');
  const [noPeopleRequired,setNoPeopleRequired] = useState('');
  const status = useVal(`${db}/${keyOfHelpRequest}/status`,'');
  const noPeopleAccepted = useVal(`${db}/${keyOfHelpRequest}/noPeopleAccepted`,0);
  const usersRequested = useQueue(`${db}/${keyOfHelpRequest}/usersRequested`);
  const usersAccepted = useQueue(`${db}/${keyOfHelpRequest}/usersAccepted`);

  getRequestedUser = ({item}) => {
    const { data } = item;
    return <Requester uidOfRequestingHelper={data} keyOfHelpRequest={keyOfHelpRequest} noPeopleAccepted={noPeopleAccepted} noPeopleRequired={noPeopleRequired} />
  }

  getAcceptedUser = ({item}) => {
    const { data, key } = item;
    return <AccetedUser dataOfAcceptedHelper={data} uidOfAcceptedHelper={key} keyOfHelpRequest={keyOfHelpRequest} status={status} />
  }

  useEffect(() => {
    getDataFromFirebase(`${db}/${keyOfHelpRequest}`).then((data) => {
      if(!data.val()) return;
      const { timeStamp, description, noPeopleRequired } = data.val();
      setDescription(description);
      setNoPeopleRequired(noPeopleRequired);
      setTimeStamp(timeStamp);
    });
  }, [])

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
}

export default HelpRequest;