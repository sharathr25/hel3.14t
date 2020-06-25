
import React from "react";
import { TouchableOpacity, View } from 'react-native';
import { Card, DescriptionFixed } from "../atoms";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { TimeAndStatus } from "../molecules";
import { margin } from "../../styles/mixins";
import { POLL_INTERVAL } from "../../config";
import { Text } from "react-native";
import { LIGHT_RED } from "../../styles/colors";

const { USER_HELP_REQUEST } = SCREEN_DETAILS;

const QUERY = gql`
  query Help($id: String!){
    help(id:$id) {
      status,
      description,
      timeStamp,
      usersAccepted {
        stars
      },
      usersRequested {
        _id
      }
    }
  }
`;

const UserHelpRequestCard = ({ keyOfHelpRequest }: { keyOfHelpRequest: string }) => {
  let { data } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: POLL_INTERVAL });
  const navigation = useNavigation();

  if (!data) return null;

  const { help } = data;
  const { status, description, timeStamp, usersAccepted, usersRequested } = help;

  const _onPress = () => {
      navigation.navigate(USER_HELP_REQUEST.screenName, { keyOfHelpRequest });
  }

  const statusToTextMapping = {
    "ON_GOING" : <Text style={{color: LIGHT_RED}}>Contributors helping you please contact them & if requested help satisfied please end</Text>,
    "REQUESTED" : usersRequested.length !== 0 ? <Text style={{color: LIGHT_RED}}>Contributors are willing to help you, please check</Text> : null,
    "COMPLETED" : usersAccepted.some(({stars}) => stars === 0) ? <Text style={{color: LIGHT_RED}}>Please rate contributors upon there help</Text> : null
  }

  return (
    <Card>
        <TouchableOpacity style={{ padding: 10 }} onPress={_onPress}>
          <View style={{ ...margin(5, 0, 5, 0)}}>
            <DescriptionFixed>{description}</DescriptionFixed>
          </View>
          {statusToTextMapping[status]}
          <TimeAndStatus timeStamp={timeStamp} status={status} />
        </TouchableOpacity>
    </Card>
  );
}

export default UserHelpRequestCard;