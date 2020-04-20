// @flow
import React from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import HelpButton from "../molecules/buttons/helpButton";
import ReferButton from "../molecules/buttons/referButton";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";
import { TimeAndDistance, ProfileName } from "../molecules";
import { FONT_SIZE_14, FONT_SIZE_20 } from "../../styles/typography";
import { margin } from "../../styles/mixins";
import { WHITE, BLACK, RED, LIGHTEST_GRAY } from "../../styles/colors";
import { useAuth } from "../../customHooks"
import { FullScreenLoader, Description } from "../atoms";

const HELP_SUBSCRIPTION = gql`
subscription{
  onUpdateHelp{
    status,
    usersAccepted{
      uid
    }
    usersRequested{
      uid
    }
    _id
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

const getUpdatedData = (newData, oldData) => {
  const { _id } = newData;
  if(_id === oldData._id) {
    return { ...oldData, ...newData }
  }
  return oldData;
}

const HelpRequest = ({data}: HelpRequestProps) => {
  const subscriptionData = useSubscription(HELP_SUBSCRIPTION, { shouldResubscribe: true });
  const { user } = useAuth();

  if(!user) return <FullScreenLoader />
  const { uid } = user;

  if (!data) return null;
  if(subscriptionData.data) {
    data = getUpdatedData(subscriptionData.data.onUpdateHelp, data);
  }
  const { description, distance, timeStamp, usersRequested, creatorName } = data;
  const { buttons } = styles;
  const heightForDescription = Dimensions.get('screen').height - 380
  const isUserRequested = () => usersRequested.some((user) => user.uid === uid);

  return (
    <View style={{flex: 1}}>
    <View style={{flex: 5, backgroundColor: WHITE, padding: 20 }}>
      <ProfileName name={creatorName} />
      <Description height={heightForDescription}>{description}</Description>
      <TimeAndDistance timeStamp={timeStamp} distance={distance} />
    </View>
    <View style={{backgroundColor: LIGHTEST_GRAY, ...margin(10,20,10,20) }}>
    {
      !isUserRequested()
        ? <View style={buttons} >
            <ReferButton data={data} />
            <View style={{width: 10}} />
            <HelpButton data={data} />
          </View>
        : <Text style={{textAlign: 'center', fontSize: FONT_SIZE_20}}>Verification is pending</Text>
    }
    </View>
    </View>
  );
}

export default HelpRequest;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: 'flex-end',
  },
});
