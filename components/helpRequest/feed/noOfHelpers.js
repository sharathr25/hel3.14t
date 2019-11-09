import React, { Component } from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE, FONT_FAMILY } from '../../../constants/styleConstants';

const NoOfHelpers = props => {
  const {
    noPeopleAccepted,
    noPeopleRequired
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.container}> 
        <Text style={{fontFamily:FONT_FAMILY}}>Helpers required</Text>
        <View style={styles.peopleRequiredContainer}>
          <Text style={styles.peopleRequiredText}>{noPeopleRequired}</Text>
        </View>
      </View>
      <View style={styles.container}>  
        <View style={styles.peopleAcceptedContainer}>
          <Text style={styles.peopleAcceptedText}>{noPeopleAccepted}</Text>
        </View>
        <Text style={{fontFamily:FONT_FAMILY}}>Helpers accepted</Text>
      </View> 
    </View>
  )
};

export default NoOfHelpers;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:'center', 
    justifyContent:'center'
  },
  text: { fontSize: 20, color: FLAG_COLOR_WHITE },
  textWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  peopleRequiredContainer: { 
    backgroundColor:FLAG_COLOR_ORANGE, 
    borderRadius: 10, 
    borderWidth:1, 
    borderColor: FLAG_COLOR_WHITE, 
    width: 36, 
    height: 36, 
    borderRadius: 36,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  peopleAcceptedContainer: {
    backgroundColor:FLAG_COLOR_WHITE, 
    borderRadius: 10, 
    borderWidth:1, 
    borderColor: FLAG_COLOR_ORANGE, 
    width: 36, 
    height: 36, 
    borderRadius: 36,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  peopleAcceptedText:{
    color:FLAG_COLOR_ORANGE,paddingRight: 3
  },
  peopleRequiredText:{
    color:FLAG_COLOR_WHITE, paddingLeft:3
  }
});
