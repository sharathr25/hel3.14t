import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import { FLAG_COLOR_ORANGE } from '../../../constants/styleConstants';
const AccetedUser = (props) => {
    return (
      <View style={styles.container}>
        <Text style={[styles.item,{flex:1}]}>{props.slNo}</Text>
        <View style={{flex:4, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{alignItems:'center'}}><ProfileLetter letter={`${props.name.substring(0,1)}`}/></View>
          <Text style={{textAlign:'left', paddingLeft: 5}}>{props.name}</Text>
        </View>
        <Text style={[styles.item],{flex:1}}>{props.xp}</Text>
        <Text style={[styles.item,{flex:2}]}>{props.mobileNumber}</Text>
      </View>
    );
  }

  export default AccetedUser;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      marginTop: 5
    },
    item:{
      textAlign: 'center'
    }
  });
