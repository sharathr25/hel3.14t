import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FLAG_COLOR_WHITE, FLAG_COLOR_GREEN } from '../../../constants/styleConstants';
import ProfileLetter from '../../common/profileLetter';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Requester extends Component {
  handleAccept = () => {
    this.props.handleAccept(this.props.uid)
  }

  handleReject = () => {
    this.props.handleReject(this.props.uid)
  }

  render(){
   return (
      <View style={styles.requestedUserDetailsContaner}>
        <Text style={{flex:1, textAlign:"center"}}>{this.props.slNo}</Text>
          <View style={{flex:3, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{alignItems:'center'}}><ProfileLetter letter={`${this.props.name.substring(0,1)}`}/></View>
            <Text style={{textAlign:'left', paddingLeft: 5}}>{this.props.name}</Text>
          </View>
          <Text style={{flex:1}}>{this.props.xp}</Text>
          <TouchableOpacity style={styles.accept} onPress={this.handleAccept}><Icon name="check" size={20} color={FLAG_COLOR_GREEN}/></TouchableOpacity>
          <TouchableOpacity style={styles.reject} onPress={this.handleReject}><Icon name="remove" size={20} color="red" /></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    text:{
      fontSize: 15,
      textAlign:'center'
    },
    requestedUserDetailsContaner:{
      flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      marginTop: 5
    },
    accept:{
      flex:1,
      borderColor:FLAG_COLOR_GREEN,
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:10
    },
    reject:{
      flex:1,
      borderColor:'red',
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:10
    }
  });