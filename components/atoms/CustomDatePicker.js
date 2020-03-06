// @flow
import React from 'react';
import DatePicker from 'react-native-datepicker'
import { ORANGE , BLACK, WHITE } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { StyleSheet, View, Text } from 'react-native';

const CustomDatePicker = (props: { date: string , updateParentState: Function, label: string }) => {
  const { date, updateParentState, label } = props;
  const { dateInput, labelStyle, container, datePickerContainer, dateStyle } = styles;
  return (
    <View style={container}>
      <Text style={labelStyle}>{label}</Text>
      <View style={datePickerContainer}>
      <DatePicker
          customStyles={{ dateInput }}
          style={dateStyle}
          date={date}
          mode="date"
          placeholder="Select date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => { updateParentState(date) }}
          showIcon={false}
        />
      </View>
    </View>
  );
}

export default CustomDatePicker;

const styles = StyleSheet.create({
  labelStyle: {
    backgroundColor: WHITE,
    zIndex: 2,
    left: 30,
    top: -20,
    alignSelf: 'flex-start',
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    color: BLACK,
    fontWeight: FONT_WEIGHT_REGULAR
  },
  dateInput: {
    borderColor: ORANGE, 
    borderWidth: 1.2,
    borderRadius: 10, 
    padding: 25,
  },
  container: {
    flex: 1
  },
  datePickerContainer: {
    flexDirection: 'row', 
    flex: 1 
  },
  dateStyle : {
    flex: 1
  }
});