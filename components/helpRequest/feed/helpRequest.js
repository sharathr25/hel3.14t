import React from "react";
import { View, StyleSheet, Text } from "react-native";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import HelpButton from "../buttons/helpButton";
import ReferButton from "../buttons/referButton";
import NoOfHelpers from './noOfHelpers';
import Distance from '../../common/distance';
import Card from "../../common/card";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";
import { STATUS_COLOR_MAPPING } from "../../../constants/styleConstants";
import { STATUS_TEXT_MAPPING } from "../../../constants/appConstants";

const HELP_SUBSCRIPTION = gql`
subscription{
  onUpdateHelp{
    status,
    usersAccepted{
      _id
    }
  }
}
`;

const HelpRequest = (props) => {
  const { data } = props;
  const subscriptionData = useSubscription(HELP_SUBSCRIPTION, { shouldResubscribe: true });

  if(!data) return null;

  let updatedData = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateHelp || null;

  if (updatedData) {
    const { _id } = updatedData;
    if (_id === data._id) {
      data = { ...data, ...updatedData }
    }
  }

  const { usersAccepted, description,distance, timeStamp, noPeopleRequired, creator, status } = data;


  return (
    <Card borderLeftColor={STATUS_COLOR_MAPPING[status]}>
        <HelpDescription data={{ description }}/>
        <Text style={{color: STATUS_COLOR_MAPPING[status], marginLeft: 10}}>{STATUS_TEXT_MAPPING[status]}</Text>
        <NoOfHelpers noPeopleAccepted={usersAccepted.length} noPeopleRequired={noPeopleRequired} />
        <View style={styles.buttons}>
          {status === "REQUESTED" && <HelpButton data={data} />}
          <ReferButton data={data} />
        </View>
        <View style={styles.timeAndDistance}>
          <Time time={new Date(timeStamp).getTime()} /><Distance distance={distance} />
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
