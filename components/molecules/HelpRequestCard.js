// @flow
import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { BLACK, ORANGE } from "../../styles/colors";
import { Card, ProfileLetter } from "../atoms";
import TimeAndDistance from "./TimeAndDistance";
import { FONT_SIZE_14 } from "../../styles/typography";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useNavigation } from '@react-navigation/native';

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
          <TouchableOpacity style={{height: CARD_HEIGHT, padding: 10 }} onPress={_onPress}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ProfileLetter letter={creatorName.substring(0, 1)} />
                <Text style={{color: ORANGE, fontSize: FONT_SIZE_14, paddingLeft: 10}}>{creatorName}</Text>
            </View>
            <Text style={{color: BLACK, fontSize: FONT_SIZE_14, marginTop: 10, marginBottom: 10, height: 85 }} numberOfLines={5}>
                {description}
            </Text>
            <TimeAndDistance timeStamp={timeStamp} distance={distance} />
          </TouchableOpacity>
      </Card>
    );
}

export default HelpRequestCard;