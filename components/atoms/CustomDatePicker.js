// @flow
import React, { useRef } from 'react';
import DatePicker from 'react-native-datepicker'
import { ORANGE , BLACK, WHITE } from '../../styles/colors';
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { padding } from "../../styles/mixins";

const CustomDatePicker = (props: { date: string , updateParentState: Function, label: string }) => {
  const datePickerRef = useRef(null);
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
          placeholder=" "
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => { updateParentState(date) }}
          showIcon={false}
          ref={datePickerRef} 
        />
        {/* <TouchableOpacity onPress={() => datePickerRef.current && datePickerRef.current.onPressDate()} style={{justifyContent: 'center'}}>
          <Icon name="arrow-down-drop-circle" size={25} color={ORANGE} />
        </TouchableOpacity> */}
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
    top: -15,
    alignSelf: 'flex-start',
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 20,
    color: BLACK,
    fontWeight: FONT_WEIGHT_REGULAR
  },
  dateInput: {
    padding: 25,
    borderWidth: 0,
  },
  container: {
    flex: 1,
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
    flex: 1
  }
});