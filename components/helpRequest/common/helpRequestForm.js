import React, { Component } from "react";
import { Text, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import firebase from 'react-native-firebase';
import { View, TouchableOpacity, Modal, StyleSheet,Alert } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE, FONT_FAMILY } from "../../../constants/styleConstants";
import Context from '../../../context';
import { pushToFirebaseWithURL, getDataFromFirebase } from "../../../fireBase/database";

const LIMIT = 3;

class HelpRequestForm extends Component {
  constructor() {
    super();
    this.uid = firebase.auth().currentUser && firebase.auth().currentUser && firebase.auth().currentUser.uid;
    this.state = {
      formVisible: false,
      noPeopleRequired: 1,
      description: "",
      latitude: null,
      longitude: null,
      locationProviderAvailable: false,
      locationErrorMessage:"",
    };
  }

  handleCheckBox = (val) => {
    this.setState({noPeopleRequired:val, [`checkBox${val}`]: true});
  }

  handleAddHelpRequest = () => {
    this.setState({ formVisible: !this.state.formVisible });
  };

  requestHelp = async () => {
    const { description, noPeopleRequired } = this.state;
    const { longitude, latitude, locationProviderAvailable, locationErrorMessage,getPosition } = this.context;
    if(description.length < LIMIT){
      Alert.alert(`description should contain minimum ${LIMIT} characters`);
    } else if(locationProviderAvailable === false && latitude===null && longitude===null) {
      Alert.alert(locationErrorMessage?locationErrorMessage:"location error");
      getPosition();
    } else {
      this.setState({ formVisible: !this.state.formVisible });
      let userDetails;
      try {
          userDetails = await getDataFromFirebase(`users/${this.uid}`);
          const data = {
            uidOfHelpRequester: this.uid,
            description,
            latitude,
            longitude,
            mobileNo: `+91${userDetails.val().mobileNumber}`,
            name: userDetails.val().mobileNumber,
            timeStamp: new Date().getTime(),
            likes: 0,
            commentsCount:0,
            noPeopleRequired: parseInt(noPeopleRequired),
            noPeopleRequested: 0,
            noPeopleAccepted: 0,
            status: 'REQUESTED'
          };
          const key = await pushToFirebaseWithURL('helps',data);
          await pushToFirebaseWithURL(`users/${this.uid}/helpsRequested`,key);
        } catch (error) {
          console.log(error);
        }
      }
  };

  getCheckBoxStyle = (val) => [styles.defaultCheckBoxStyle,this.state.noPeopleRequired === val ? styles.activeCheckBox : styles.inActiveCheckBox];

  getCheckBoxTextStyle = (val) => this.state.noPeopleRequired === val ? styles.activeText : styles.inActiveText;

  render(){
    return(
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.handleAddHelpRequest}
        style={styles.touchableOpacityStyle}
      >
        <Icon name="plus" size={40} color={FLAG_COLOR_WHITE} />
      </TouchableOpacity>
      <Modal
        animationType='fade'
        transparent
        visible={this.state.formVisible}
        onRequestClose={this.handleAddHelpRequest}
      >
        <View style={styles.modalOuterContaner}>
            <View style={styles.modalInnerContainer}>
              <Text style={styles.question}>Can you type some description?</Text>
              <Input
                inputContainerStyle={styles.descriptionContainerStyle}
                multiline={true}
                numberOfLines={4}
                onChangeText={value => this.setState({ description: value })}
              />
              <Text style={styles.question}>How many people do you require?</Text>
              <View style={styles.noPeopleSelector}>
                <TouchableOpacity onPress={() => this.handleCheckBox(1)} style={this.getCheckBoxStyle(1)}>
                    <Text style={this.getCheckBoxTextStyle(1)}>1</Text>  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCheckBox(2)} style={this.getCheckBoxStyle(2)}>
                    <Text style={this.getCheckBoxTextStyle(2)}>2</Text>  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCheckBox(3)} style={this.getCheckBoxStyle(3)}>
                    <Text style={this.getCheckBoxTextStyle(3)}>3</Text>  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCheckBox(4)} style={this.getCheckBoxStyle(4)}>
                    <Text style={this.getCheckBoxTextStyle(4)}>4</Text>  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCheckBox(5)} style={this.getCheckBoxStyle(5)}>
                    <Text style={this.getCheckBoxTextStyle(5)}>5</Text>  
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCheckBox(6)} style={this.getCheckBoxStyle(6)}>
                    <Text style={this.getCheckBoxTextStyle(6)}>6</Text>  
                </TouchableOpacity>
              </View>
              <View style={styles.buttons}>
              <Button
                title="Requset Help"
                buttonStyle={{ margin: 5, backgroundColor: FLAG_COLOR_ORANGE, width: 150}}
                titleStyle={{ color: FLAG_COLOR_WHITE }}
                onPress={this.requestHelp}
              />
              <Button
                title="Cancel"
                onPress={() => this.setState({ formVisible: !this.state.formVisible })}
                buttonStyle={{ margin: 5, backgroundColor: FLAG_COLOR_ORANGE, width: 150}}
                titleStyle={{ color: FLAG_COLOR_WHITE }}
              />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

HelpRequestForm.contextType = Context;
export default HelpRequestForm;

const styles = StyleSheet.create({
  modalOuterContaner: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "white", 
    flexDirection: "row" ,
  },
  modalInnerContainer: {
    flex: 1, 
    padding: 10, 
    margin: 10, 
    backgroundColor:FLAG_COLOR_WHITE,
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 10
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: FLAG_COLOR_ORANGE,
    borderRadius: 15
  },
  descriptionContainerStyle:{
    borderWidth: 1,
    borderColor: FLAG_COLOR_ORANGE,
    borderRadius: 5
  },
  noPeopleSelector:{
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeCheckBox: {
    backgroundColor: FLAG_COLOR_ORANGE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  defaultCheckBoxStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    borderRadius: 5
  },
  inActiveCheckBox: {
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  activeText: {
    color: FLAG_COLOR_WHITE,
    fontSize:20,
    fontFamily: FONT_FAMILY
  },
  inActiveText: {
    color: FLAG_COLOR_ORANGE,
    fontSize:20,
    fontFamily:FONT_FAMILY
  },
  buttons:{
    display:'flex',
    flexDirection: 'row',
  },
  question:{
    fontSize: 20, 
    paddingTop:5
  }
});