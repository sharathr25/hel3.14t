// @flow
import React from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import HelpButton from "./buttons/helpButton";
import ReferButton from "./buttons/referButton";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";
import { TimeAndDistance, ProfileName } from ".";
import { FONT_SIZE_14, FONT_SIZE_20 } from "../../styles/typography";
import { margin } from "../../styles/mixins";
import { WHITE, BLACK } from "../../styles/colors";
import { useAuth } from "../../customHooks"

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
  const { user } = useAuth();
  let uid = "";

  if(user) {
    uid = user.uid;
  }

  const { description, distance, timeStamp, status, usersRequested, usersRejected, creatorName } = data;

  const subscriptionData = useSubscription(HELP_SUBSCRIPTION, { shouldResubscribe: true });

  if (!data || status !== 'REQUESTED') return null;

  let updatedData = subscriptionData && subscriptionData.data && subscriptionData.data.onUpdateHelp || null;

  if (updatedData) {
    const { _id } = updatedData;
    if (_id === data._id) {
      data = { ...data, ...updatedData }
    }
  }

  const isUserRequested = () => usersRequested.some((user) => user.uid === uid);

  const { descriptionStyle, buttons } = styles;
  const heightForDescription = Dimensions.get('screen').height - 330

  return (
    <ScrollView style={{backgroundColor: WHITE}}>
      <View style={{flex: 1, backgroundColor: WHITE, padding: 10 }}>
      <ProfileName name={creatorName} />
      <Text style={{...descriptionStyle, minHeight: heightForDescription}}>
        {description}
      </Text>
      <TimeAndDistance timeStamp={timeStamp} distance={distance} />
      {!isUserRequested()
        ? <View style={buttons}>
            <HelpButton data={data} />
            <ReferButton data={data} />
          </View>
        : <Text style={{textAlign: 'center', fontSize: FONT_SIZE_20}}>Authentencation is pending</Text>
      }
    </View>
    </ScrollView>
  );
}

export default HelpRequest;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: 10
  },
  timeAndDistance: {
    flex: 1,
    flexDirection: 'row',
  },
  descriptionStyle: {
    color: BLACK,
    fontSize: FONT_SIZE_14,
    borderWidth: 1, 
    borderColor: BLACK, 
    ...margin(10,0,10,0),
    padding: 10, 
    minHeight: 450
  }
});
