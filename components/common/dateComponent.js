import React from 'react';
import DatePicker from 'react-native-datepicker'

const DateComponent = (props) => {
    return (
      <DatePicker
        style={{width: 180, marginTop:5}}
        customStyles={{dateInput:{borderWidth: 0}}}
        date={props.date}
        mode="date"
        placeholder="select date"
        format="MMMM Do YYYY"
        minDate="1900-01-01"
        maxDate="2016-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => {props.updateParentState(date)}}
        showIcon={false}
      />
    );
  }
  
export default DateComponent;