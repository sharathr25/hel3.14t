// @flow
import React from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { BLACK, LIGHT_GRAY } from "../../styles/colors";
import { Card, DescriptionFixed } from "../atoms";
import TimeAndDistance from "../molecules/TimeAndDistance";
import { FONT_SIZE_14, FONT_SIZE_18 } from "../../styles/typography";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';
import { ProfileName } from "../molecules";
import { margin } from "../../styles/mixins";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { POLL_INTERVAL } from "../../config";

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

type HelpRequestCardProps = {
  helpRequestDetails:Object, 
  removeMe: Function
}

const HelpRequestCard = (props: HelpRequestCardProps) => {
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
      <TouchableOpacity style={{ padding: 10 }} onPress={_onPress}>
        <ProfileName name={creatorName} />
        <View style={{ ...margin(5, 0, 5, 0) }}>
          <DescriptionFixed>
            {description}
          </DescriptionFixed>
        </View>
        <TimeAndDistance timeStamp={timeStamp} distance={distance} />
      </TouchableOpacity>
    </Card>
  );
}

export default HelpRequestCard;