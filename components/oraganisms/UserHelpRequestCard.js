// @flow
import React from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { BLACK, LIGHT_GRAY } from "../../styles/colors";
import { Card, Time, Status, DescriptionFixed } from "../atoms";
import { FONT_SIZE_14 } from "../../styles/typography";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';
import gql from "graphql-tag";
import { useQuery, useSubscription } from "react-apollo";
import { TimeAndStatus } from "../molecules";
import { margin } from "../../styles/mixins";

const { USER_HELP_REQUEST } = SCREEN_DETAILS;

const SUBSCRIPTION = gql`
    subscription{
      onUpdateHelp{
        _id,
        status,
        usersAccepted {
          uid
          name
          mobileNo,
          xp,
          stars
        },
        usersRequested {
          uid
          name,
          mobileNo,
          xp,
          stars
        },
    }
  }
  `;

  const QUERY = gql`
    query Help($id: String!){
      help(id:$id) {
        status,
        description,
        usersAccepted {
          uid
          name
          mobileNo
          xp
          stars
        },
        usersRequested {
          uid
          name,
          xp,
          mobileNo,
          stars
        },
        timeStamp,
        noPeopleRequired
      }
    }
  `;

const getUpdatedData = (newData, oldData, keyOfHelpRequest) => {
    const { _id } = newData;
    if (_id === keyOfHelpRequest) {
        return { ...oldData, ...newData }
    }
    return oldData;
}

const CARD_HEIGHT = 150;
const UserHelpRequestCard = (props) => {
    const { keyOfHelpRequest } = props;
    let { data , error } = useQuery(QUERY, { variables: { id: keyOfHelpRequest }});
    const subscriptionData = useSubscription(SUBSCRIPTION, { shouldResubscribe: true });
    const navigation = useNavigation();
  
    if (!data) return null;
    if(subscriptionData.data) {
      data.help = getUpdatedData(subscriptionData.data.onUpdateHelp, data.help, keyOfHelpRequest);
    }
  
    const { help } = data;
    const { status, description, timeStamp } = help;
  

    const _onPress = () => {
        navigation.navigate(USER_HELP_REQUEST.screenName, { data: keyOfHelpRequest });
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