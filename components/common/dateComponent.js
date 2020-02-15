import React from 'react';
import DatePicker from 'react-native-datepicker'
import { ORANGE } from '../../constants/styleConstants';

const DateComponent = (props) => {
  return (
    <DatePicker
      customStyles={{dateInput:{borderColor: ORANGE, borderRadius: 25, padding: 5 }}}
      date={props.date}
      mode="date"
      placeholder="select date"
      format="MMMM Do YYYY"
      minDate="1900-01-01"
      maxDate="2016-06-01"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      onDateChange={(date) => { props.updateParentState(date) }}
      showIcon={false}
    />
  );
}

export default DateComponent;