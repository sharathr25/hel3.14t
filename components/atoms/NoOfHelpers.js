// @flow
import React from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { FONT_BOLD, FONT_REGULAR, FONT_SIZE_16 } from '../../styles/typography';
import { padding } from '../../styles/mixins';

const NoOfHelpers = (props: { noPeopleAccepted: number, noPeopleRequired: number }) => {
  const { noPeopleAccepted, noPeopleRequired } = props;
  const { container, innerContainer } = styles;
  return (
    <View style={container}>
      <View style={innerContainer}>
        <Text style={{ ...FONT_BOLD, fontSize: FONT_SIZE_16, ...padding(0, 10, 0, 0) }}>{noPeopleRequired}</Text>
        <Text style={FONT_REGULAR}>Helper{noPeopleRequired === 1 ? "" : "s"} required</Text>
      </View>
      {
        noPeopleRequired > 1
          ? <View style={innerContainer}>
            <Text style={{ ...FONT_BOLD, fontSize: FONT_SIZE_16, ...padding(0, 10, 0, 0) }}>{noPeopleAccepted}</Text>
            <Text style={FONT_REGULAR}>Helper{noPeopleAccepted === 1 ? "" : "s"} accepted</Text>
          </View>
          : null
      }
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
  }
});
