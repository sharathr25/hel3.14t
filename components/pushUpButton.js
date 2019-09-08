import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/AntDesign";
import { FLAG_COLOR_GREEN, FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import { updateHelpRequest } from '../fireBase/database';

export default class PushUpButton extends Component {
    constructor(props){
      super(props);
      const {data } = this.props;
      this.uid = firebase.auth().currentUser.uid;
      this.helpRequest = this.props.helpRequest;
      this.usersPushed = this.helpRequest.child("usersPushed");
      this.pushedUpQuery = this.pushedUpQuery = this.usersPushed.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
      this.state = {
        pushUps: data.pushUps,
        userPushed: false
      }
    }
  
    componentDidMount() {
      this.helpRequest.on("child_changed", data => {
        this.setState( { [data.key]: data.val() })
      });
      this.setPushUpStatus();
    }
    
    componentWillUnmount(){
        this.helpRequest.off();
    }

    handlePush = () => {
      const { pushUps,userPushed } = this.state;
      if (!userPushed) {
        updateHelpRequest(this.helpRequest,"pushUps", pushUps+1 ,this.usersPushed, this.uid);
        this.setPushUpStatus();
      } else {
        Alert.alert("u already pushed");
      }
    }
  
    setPushUpStatus = () => {
      this.pushedUpQuery.once("value", data => {
        if (data.val()) {
          this.setState({ userPushed: true });
        }
      });
    };
    
    render(){
      const { pushUps } = this.state;
      return (
        <TouchableOpacity style={styles.container} onPress={this.handlePush}>
          <Icon name="like1" color={FLAG_COLOR_GREEN} size={30} style={styles.pushIcon}/><Text style={styles.text}>{pushUps}</Text>
        </TouchableOpacity>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderWidth: 1,
      borderColor: FLAG_COLOR_ORANGE,
      margin: 3,
      borderRadius: 5,
      padding: 5
    },
    pushIcon:{
        width: 50
    },
    text:{
        fontSize: 20
    }
  });