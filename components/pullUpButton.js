import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text } from "react-native";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/AntDesign";
import { FLAG_COLOR_GREEN, FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import { updateHelpRequest } from '../fireBase/database';

export default class PullUpButton extends Component {
    constructor(props){
      super(props);
      const {data } = this.props;
      this.uid = firebase.auth().currentUser.uid;
      this.helpRequest = this.props.helpRequest;
      this.usersPulled = this.helpRequest.child("usersPulled");
      this.pulledUpQuery = this.pulledUpQuery = this.usersPulled.orderByValue(this.uid).equalTo(this.uid).limitToFirst(1);
      this.state = {
        pullUps: data.pullUps,
        userPulled: false
      }
    }
  
    componentDidMount() {
      this.helpRequest.on("child_changed", data => {
        this.setState( { [data.key]: data.val() })
      });
      this.setPullUpStatus();
    }

    componentWillUnmount(){
        this.helpRequest.off();
    }
  
    handlePull = () => {
      const { pullUps,userPulled } = this.state;
      if (!userPulled) {
        updateHelpRequest(this.helpRequest,"pullUps", pullUps+1 ,this.usersPulled, this.uid);
        this.setPullUpStatus();
      } else {
        Alert.alert("u already pulled");
      }
    }
  
    setPullUpStatus = () => {
        this.pulledUpQuery.once("value", data => {
          if (data.val()) {
            this.setState({ userPulled: true });
          }
        });
    };
    
    render(){
      const { pullUps } = this.state;
      return (
        <TouchableOpacity style={styles.container} onPress={this.handlePull}>
            <Icon name="dislike1" color={FLAG_COLOR_ORANGE} size={30} style={styles.pullIcon}/><Text style={styles.text}>{pullUps}</Text>
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
    pullIcon:{
        width: 50
    },
    text:{
        fontSize: 20
    }
  });