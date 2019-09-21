import React from 'react';
import DatePicker from 'react-native-datepicker'

const DateComponent = (props) => {
    return (
      <DatePicker
        style={{width: 180}}
        date={props.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="1900-01-01"
        maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => {props.updateParentState(date)}}
      />
    );
  }
  
export default DateComponent;