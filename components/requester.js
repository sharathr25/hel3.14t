import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FLAG_COLOR_WHITE, FLAG_COLOR_GREEN } from '../constants/styleConstants';

export default class Requester extends Component {
  handleAccept = () => {
    this.props.handleAccept(this.props.uid)
  }

  handleReject = () => {
    this.props.handleReject(this.props.uid)
  }

  render(){
   return <View style={styles.requestedUserDetailsContaner}>
      <Text>{this.props.name}</Text>
      <Text>{this.props.email}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.accept} onPress={this.handleAccept}><Text style={styles.text}>Accept</Text></TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={this.handleReject}><Text style={styles.text}>Reject</Text></TouchableOpacity>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
    accept:{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderColor: FLAG_COLOR_GREEN,
      borderWidth: 1,
      margin: 3,
      borderRadius: 5,
      padding: 5
    },
    reject:{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderColor: 'red',
      borderWidth: 1,
      margin: 3,
      borderRadius: 5,
      padding: 5
    },
    text:{
      fontSize: 20
    },
    requestedUserDetailsContaner:{
      flex: 1
    },
    buttons:{
      flex: 1,
      flexDirection: "row",
      justifyContent:'space-evenly'
    }
  });