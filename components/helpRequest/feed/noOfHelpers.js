import React from 'react';
import {
  Text, View, StyleSheet
} from 'react-native';
import { ORANGE, WHITE, FONT_FAMILY } from '../../../constants/styleConstants';

const NoOfHelpers = props => {
  const { noPeopleAccepted, noPeopleRequired } = props;
  return (
    <View style={styles.container}>
      <View style={styles.container}> 
        <Text style={{ fontFamily: FONT_FAMILY }}>Helpers required</Text>
        <View style={styles.peopleRequiredContainer}>
          <Text style={styles.peopleRequiredText}>{noPeopleRequired}</Text>
        </View>
      </View>
      <View style={styles.container}>  
        <View style={styles.peopleAcceptedContainer}>
          <Text style={styles.peopleAcceptedText}>{noPeopleAccepted}</Text>
        </View>
        <Text style={{ fontFamily: FONT_FAMILY }}>Helpers accepted</Text>
      </View> 
    </View>
  );
};

export default NoOfHelpers;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:'center', 
    justifyContent:'center'
  },
  text: { fontSize: 20, color: WHITE },
  textWrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  peopleRequiredContainer: { 
    backgroundColor:ORANGE, 
    borderRadius: 10, 
    borderWidth:1, 
    borderColor: WHITE, 
    width: 36, 
    height: 36, 
    borderRadius: 36,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  peopleAcceptedContainer: {
    backgroundColor:WHITE, 
    borderRadius: 10, 
    borderWidth:1, 
    borderColor: ORANGE, 
    width: 36, 
    height: 36, 
    borderRadius: 36,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  peopleAcceptedText:{
    color:ORANGE,paddingRight: 3
  },
  peopleRequiredText:{
    color:WHITE, paddingLeft:3
  }
});
