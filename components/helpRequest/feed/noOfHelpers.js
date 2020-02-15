import React from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { ORANGE, WHITE, FONT_FAMILY, BLACK } from '../../../constants/styleConstants';

const NoOfHelpers = props => {
  const { noPeopleAccepted, noPeopleRequired } = props;
  const { container, innerContainer, peopleAcceptedContainer, peopleAcceptedText, peopleRequiredContainer, peopleRequiredText } = styles;
  return (
    <View style={container}>
      <View style={innerContainer}>
        {/* <View style={peopleRequiredContainer}>
          <Text style={peopleRequiredText}>{noPeopleRequired}</Text>
        </View> */}
        <Text style={peopleRequiredText}>{noPeopleRequired}</Text>
        <Text style={{ fontFamily: FONT_FAMILY }}>Helper{noPeopleRequired === 1 ? "" : "s"} required</Text>
      </View>
      <View style={innerContainer}>
        {/* <View style={peopleAcceptedContainer}>
          <Text style={peopleAcceptedText}>{noPeopleAccepted}</Text>
        </View> */}
        <Text style={peopleAcceptedText}>{noPeopleAccepted}</Text>
        <Text style={{ fontFamily: FONT_FAMILY }}>Helper{noPeopleAccepted === 1 ? "" : "s"} accepted</Text>
      </View>
    </View>
  );
};

export default NoOfHelpers;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  peopleRequiredContainer: {
    backgroundColor: ORANGE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WHITE,
    width: 36,
    height: 36,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  peopleAcceptedContainer: {
    backgroundColor: WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ORANGE,
    width: 36,
    height: 36,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  peopleAcceptedText: {
    color: BLACK,
    fontSize: 20,
    marginRight: 10
  },
  peopleRequiredText: {
    color: BLACK,
    fontSize: 20,
    marginRight: 10
  }
});
