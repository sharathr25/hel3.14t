// @flow
import React from 'react';
import DatePicker from 'react-native-datepicker'
import { ORANGE } from '../../styles/colors';
import { StyleSheet } from 'react-native';

const CustomDatePicker = (props: { date: string , updateParentState: Function }) => {
  const { date, updateParentState } = props;
  const { dateInput } = styles;
  return (
    <DatePicker
      customStyles={{ dateInput }}
      date={date}
      mode="date"
      placeholder="select date"
      format="YYYY-MM-DD"
      minDate="1900-01-01"
      maxDate="2016-06-01"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      onDateChange={(date) => { updateParentState(date) }}
      showIcon={false}
    />
  );
}

export default CustomDatePicker;

const styles = StyleSheet.create({
  dateInput: {
    borderColor: ORANGE, 
    borderRadius: 10, 
    padding: 5
  }
});