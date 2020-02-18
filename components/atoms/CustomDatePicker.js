import React from 'react';
import DatePicker from 'react-native-datepicker'
import { ORANGE } from '../../constants/styleConstants';
import { StyleSheet } from 'react-native';

const CustomDatePicker = (props) => {
  const { date, updateParentState } = props;
  const { dateInput } = styles;
  return (
    <DatePicker
      customStyles={{ dateInput }}
      date={date}
      mode="date"
      placeholder="select date"
      format="MMMM Do YYYY"
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
    borderRadius: 25, 
    padding: 5
  }
});