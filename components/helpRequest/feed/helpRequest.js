import React, { useState, useEffect} from "react";
import { View, StyleSheet } from "react-native";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import HelpButton from "../buttons/helpButton";
import ReferButton from "../buttons/referButton";
import NoOfHelpers from './noOfHelpers';
import Distance from '../../common/distance';
import Card from "../../common/card";

const HelpRequest = (props) => {
  const { data } = props;
  if(!data) return null;
  const { usersAccepted, description,distance, timeStamp, noPeopleRequired, creator } = data;

  return (
    <Card>
        <HelpDescription data={{ description }}/>
        <NoOfHelpers noPeopleAccepted={usersAccepted.length} noPeopleRequired={noPeopleRequired} />
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
