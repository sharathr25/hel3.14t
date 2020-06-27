
import React from "react";
import {  TouchableOpacity } from 'react-native';
import { BLACK, LIGHT_GRAY, ORANGE } from "../../styles/colors";
import { DescriptionFixed, ProfileLetter } from "../atoms";
import TimeAndDistance from "../molecules/TimeAndDistance";
import { FONT_SIZE_14, FONT_SIZE_18 } from "../../styles/typography";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';
import { ProfileName } from "../molecules";
import { margin } from "../../styles/mixins";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { POLL_INTERVAL } from "../../config";
import { Card, CardItem, Body, Text, View, Subtitle } from 'native-base';
import { getTimeDiffrence } from "../../utils";

const { HELP_REQUEST } = SCREEN_DETAILS;

const QUERY = gql`
query Help($id: String!){
  help(id:$id) {
    status,
    timeStamp,
    description,
    status,
    creatorName
  }
}
`;

const HelpRequestCard = (props) => {
  const { helpRequestDetails , removeMe } = props;
  const navigation = useNavigation();
  const { distance, _id } = helpRequestDetails;
  const { data } = useQuery(QUERY, { variables: { id: _id }, pollInterval: POLL_INTERVAL });
  if(!data) return null;
  const { help } = data;
  const { creatorName, timeStamp, description, status } = help;

  if(status !== 'REQUESTED') {
    removeMe(_id);
  }

  const _onPress = () => {
      navigation.navigate(HELP_REQUEST.screenName, { idOfHelpRequest: _id, distance });
  }

  return (
    <Card>
      <TouchableOpacity onPress={_onPress}>
      <CardItem header>
        <ProfileLetter letter={creatorName.substring(0,1).toUpperCase()} size={40} />
        <View style={{ width: 3, backgroundColor: ORANGE, borderRadius: 1.5, height: 25, marginHorizontal: 15 } }><Text /></View>
        <View>
            <Subtitle style={{ color: ORANGE }}>{creatorName}</Subtitle>
            <TimeAndDistance timeStamp={timeStamp} distance={distance} />
        </View>
      </CardItem>
      <CardItem>
        <Body>
          <Text numberOfLines={5} style={{ minHeight: 100 }}>
            {description}
          </Text>
        </Body>
      </CardItem>
      </TouchableOpacity>
    </Card>
  );
}

export default HelpRequestCard;