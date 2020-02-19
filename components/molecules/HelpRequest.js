// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import HelpButton from "./buttons/helpButton";
import ReferButton from "./buttons/referButton";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";
import { STATUS_COLOR_MAPPING } from "../../components/atoms/Status";
import { Status, NoOfHelpers, Card } from "../atoms";
import { TimeAndDistance } from ".";
import { FONT_FAMILY_BOLD, FONT_SIZE_16, FONT_WEIGHT_BOLD } from "../../styles/typography";
import { margin } from "../../styles/mixins";

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

type HelpRequestProps = {
  data: {
    usersAccepted: Array<Object>, 
    usersRequested: Array<Object>,
    usersRejected: Array<Object>,
    description: Array<Object>, 
    distance: number, 
    timeStamp: number, 
    noPeopleRequired: number,
    creator: string, 
    status:  string,
    _id: string
  }
}

const HelpRequest = (props: HelpRequestProps) => {
  let { data } = props;

  const { usersAccepted, description, distance, timeStamp, noPeopleRequired, creator, status, usersRequested, usersRejected } = data;

  const subscriptionData = useSubscription(HELP_SUBSCRIPTION, { shouldResubscribe: true });

  if (!data || status !== 'REQUESTED') return null;

  let updatedData = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateHelp || null;

  if (updatedData) {
    const { _id } = updatedData;
    if (_id === data._id) {
      data = { ...data, ...updatedData }
    }
  }

  const { descriptionStyle, buttons, button } = styles;

  return (
    <Card borderLeftColor={STATUS_COLOR_MAPPING[status]}>
      <Text style={descriptionStyle}>{description}</Text>
      <Status>{status}</Status>
      <NoOfHelpers noPeopleAccepted={usersAccepted.length} noPeopleRequired={noPeopleRequired} />
      <View style={buttons}>
        <View style={button}>
          <HelpButton data={data} />
        </View>
        <View style={button}>
          <ReferButton data={data} />
        </View>
      </View>
      <TimeAndDistance timeStamp={timeStamp} distance={distance} />
    </Card>
  );
}

export default HelpRequest;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
  },
  button: {
    ...margin(0, 10, 0, 0)
  },
  timeAndDistance: {
    flex: 1,
    flexDirection: 'row',
  },
  descriptionStyle: {
    fontFamily: FONT_FAMILY_BOLD,
    fontSize: FONT_SIZE_16,
    fontWeight: FONT_WEIGHT_BOLD
  }
});
