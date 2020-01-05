import React, { useState, useEffect} from "react";
import { View, StyleSheet } from "react-native";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import HelpButton from "../buttons/helpButton";
import ReferButton from "../buttons/referButton";
import NoOfHelpers from './noOfHelpers';
import Distance from '../../common/distance';
import Card from "../../common/card";
import { HELPS_REQUESTED_DB } from "../../../constants/appConstants";
import { useVal } from "../../../effects";

const HelpRequest = (props) => {
  const { data } = props;
  if(!data) return null;
  const { noPeopleRequested, noPeopleRequired, description,distance, timeStamp, key } = data;
  const [state, setState] = useState(
    {
      noPeopleRequested,  
      noPeopleRequired,
      disableHelp: false,
      helpErrorMessage: ""
    }
  );

  const noPeopleAccepted = useVal(`${HELPS_REQUESTED_DB}/${key}/noPeopleAccepted`,0);

  updateState = (data) => {
    if(Object.keys(state).includes(data.key)){
      setState( { ...state,[data.key]: data.val() })
    }
  }

  return (
    <Card>
        <HelpDescription data={{ description }}/>
        <NoOfHelpers noPeopleAccepted={noPeopleAccepted} noPeopleRequired={state.noPeopleRequired} />
        <View style={styles.buttons}>
          <HelpButton data={data} />
          <ReferButton data={data} />
        </View>
        <View style={styles.timeAndDistance}>
          <Time time={timeStamp} /><Distance distance={distance} />
        </View>
    </Card>
  );
} 

export default HelpRequest;

const styles = StyleSheet.create({
  outerContanier: {
    margin:10,
    borderRadius: 5,
    flexDirection: "row",
    elevation: 5
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  },
  timeAndDistance:{
    flex: 1,
    flexDirection: 'row',
  }
});
