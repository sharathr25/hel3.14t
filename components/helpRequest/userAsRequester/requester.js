import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FLAG_COLOR_WHITE, FLAG_COLOR_GREEN } from '../../../constants/styleConstants';
import ProfileLetter from '../../common/profileLetter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../../common/card';
import BoxText from '../../common/boxText';

export default class Requester extends Component {
  handleAccept = () => {
    this.props.handleAccept(this.props.uid)
  }

  handleReject = () => {
    this.props.handleReject(this.props.uid)
  }

  render(){
   return (
      <View>
        <View style={{ flex:1, flexDirection:'row'}}>
          <View style={{margin: 5}}>
            <ProfileLetter letter={`${this.props.name.substring(0,1)}`}/>
          </View>
          <View style={{ marginLeft: 5}}>
            <Text>{this.props.name}</Text>
            <BoxText leftText="XP" rightText={this.props.xp}></BoxText>
          </View>
          <View style={{ flex:1, flexDirection:'row'}}>
            <TouchableOpacity style={styles.accept} onPress={this.handleAccept}>
              <Icon name="check" size={20} color={FLAG_COLOR_GREEN}/>
              <Text style={{color:FLAG_COLOR_GREEN}}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reject} onPress={this.handleReject}>
              <Icon name="remove" size={20} color="red" />
              <Text style={{color:'red'}}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      flexDirection: 'row',
      borderColor:FLAG_COLOR_GREEN,
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:5
    },
    reject:{
      flex:1,
      flexDirection: 'row',
      borderColor:'red',
      borderWidth:1,
      margin: 5,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:5
    }
  });