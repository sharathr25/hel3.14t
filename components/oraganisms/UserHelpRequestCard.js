// @flow
import React from "react";
import { TouchableOpacity, View } from 'react-native';
import { Card, DescriptionFixed } from "../atoms";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { TimeAndStatus } from "../molecules";
import { margin } from "../../styles/mixins";

const { USER_HELP_REQUEST } = SCREEN_DETAILS;

const QUERY = gql`
  query Help($id: String!){
    help(id:$id) {
      status,
      description,
      usersAccepted {
        uid
        username
        mobileNo
        xp
        stars
      },
      usersRequested {
        uid
        username,
        xp,
        mobileNo,
        stars
      },
      timeStamp,
      noPeopleRequired
    }
  }
`;

const UserHelpRequestCard = (props) => {
  const { keyOfHelpRequest } = props;
  let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }, pollInterval: 100 });
  const navigation = useNavigation();

  if (!data) return null;

  const { help } = data;
  const { status, description, timeStamp } = help;


  const _onPress = () => {
      navigation.navigate(USER_HELP_REQUEST.screenName, { keyOfHelpRequest });
  }

  return (
    <Card>
        <TouchableOpacity style={{ padding: 10 }} onPress={_onPress}>
          <View style={{ ...margin(5, 0, 5, 0)}}>
            <DescriptionFixed>{description}</DescriptionFixed>
          </View>
          <TimeAndStatus timeStamp={timeStamp} status={status} />
        </TouchableOpacity>
    </Card>
  );
}

export default UserHelpRequestCard;