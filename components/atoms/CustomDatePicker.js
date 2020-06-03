
import React, { useRef } from 'react';
import { ORANGE , BLACK, WHITE, RED } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR, FONT_SIZE_18, FONT_SIZE_16 } from "../../styles/typography";
import { StyleSheet, Text } from 'react-native';
import { padding } from "../../styles/mixins";
import { DatePicker, Label, Item, View } from 'native-base';

type CustomDatePickerProps = { 
  date: string , 
  updateParentState: Function, 
  label: string, 
  value: string ,
  errMsg?: string
}

const CustomDatePicker = (props: CustomDatePickerProps) => {
  const datePickerRef = useRef(null);
  const { date, updateParentState, label, errMsg = "" } = props;
  const { dateInput, labelStyle, container, datePickerContainer, dateStyle } = styles;
  return (
    <View>
      <Label style={labelStyle}>{label}</Label>
      <View style={dateInput}>
        <DatePicker
          date={date}
          mode="date"
          placeholder="Select dat"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => { updateParentState(date) }}
          showIcon={false}
          ref={datePickerRef}
        />
      </View>
      {errMsg !== "" && <Text style={{ color: RED, fontSize: FONT_SIZE_18, textAlign: 'center' }}>
        {errMsg}
      </Text>}
    </View>
  );
}

export default CustomDatePicker;

const styles = StyleSheet.create({
  labelStyle: {
    backgroundColor: WHITE, 
    zIndex: 2, 
    left: 20, 
    top: 10, 
    paddingHorizontal: 10, 
    textAlign: 'center',
    color: BLACK,
    fontSize:FONT_SIZE_18,
    alignSelf: 'flex-start'
  },
  dateInput: {
    borderColor: ORANGE, 
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  container: {
    borderColor: ORANGE, 
    borderWidth: 1.2,
    borderRadius: 10, 
    ...padding(4,10,4,10)
  },
  datePickerContainer: {
    flexDirection: 'row', 
    flex: 1 
  },
  dateStyle : {
    flex: 1,

  }
});