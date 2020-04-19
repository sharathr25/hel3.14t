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

const { HELP_REQUEST } = SCREEN_DETAILS;

const CARD_HEIGHT = 180;
const HelpRequestCard = ({data} : { data: Object }) => {
    const navigation = useNavigation();
    const { description, creatorName, timeStamp, distance } = data;

    const _onPress = () => {
        navigation.navigate(HELP_REQUEST.screenName, { data });
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