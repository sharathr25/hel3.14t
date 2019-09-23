import React, { Component } from "react";
import { Text, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import firebase from 'react-native-firebase';
import { View, TouchableOpacity, Modal, Picker, StyleSheet,Alert } from "react-native";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import Context from '../../../context';
import { pushToFirebaseWithURL, getDataFromFirebase } from "../../../fireBase/database";

const LIMIT = 3;

class HelpRequestForm extends Component {
  constructor() {
    super();
    this.uid = firebase.auth().currentUser.uid;
    this.state = {
      formVisible: false,
      noPeopleRequired: 1,
      description: "",
      latitude: null,
      longitude: null,
      locationProviderAvailable: false,
      locationErrorMessage:""
    };
  }

  handleAddHelpRequest = () => {
    this.setState({ formVisible: !this.state.formVisible });
  };

  requestHelp = async () => {
    this.setState({ formVisible: !this.state.formVisible });
    const { description, noPeopleRequired } = this.state;
    if(description.length < LIMIT){
      Alert.alert(`description should contain minimum ${LIMIT} characters`);
      return;
    }
    const { longitude, latitude, locationProviderAvailable, locationErrorMessage,getPosition } = this.context;
    if(locationProviderAvailable === false && latitude===null && longitude===null){
      Alert.alert(locationErrorMessage?locationErrorMessage:"location error");
      getPosition();
      return;
    }
    let userDetails;
    try {
      userDetails = await getDataFromFirebase(`users/${this.uid}`);
    } catch (error) {
      console.log(error);
    }
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
    const helpsDbUrl = 'helps';
    const userDbUrl = `users/${this.uid}/helpsRequested`
    const key = await pushToFirebaseWithURL(helpsDbUrl,data);
    await pushToFirebaseWithURL(userDbUrl,key);
  };

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
        animationType="none"
        transparent
        visible={this.state.formVisible}
        onRequestClose={this.handleAddHelpRequest}
      >
        <View style={styles.modalOuterContaner}>
            <View style={styles.modalInnerContainer}>
              <Input
                inputContainerStyle={styles.descriptionContainerStyle}
                multiline={true}
                numberOfLines={4}
                placeholder="Description"
                onChangeText={value => this.setState({ description: value })}
              />
              <Text>Description should contain minimum {LIMIT} characters</Text>
              <View
                style={styles.pickerContainerStyle}
              >
                <Text style={{fontSize: 20, paddingTop:5 }}> No of People Required: </Text>
                <Picker
                  selectedValue={this.state.noPeopleRequired}
                  style={styles.pickerStyle}
                  onValueChange={itemValue => this.setState({ noPeopleRequired: itemValue }) }
                >
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                </Picker>
              </View>
              <Button
                title="Requset Help"
                buttonStyle={{ margin: 5, backgroundColor: FLAG_COLOR_ORANGE, width: 200}}
                titleStyle={{ color: FLAG_COLOR_WHITE }}
                onPress={this.requestHelp}
              />
              <Button
                type="outline"
                title="cancel"
                onPress={() =>
                  this.setState({ formVisible: !this.state.formVisible })
                }
                buttonStyle={{ margin: 5, backgroundColor: FLAG_COLOR_ORANGE, width: 200}}
                titleStyle={{ color: FLAG_COLOR_WHITE }}
              />
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
    backgroundColor: "rgba(0,0,0,0.9)", 
    flexDirection: "row" 
  },
  modalInnerContainer: {
    flex: 1, 
    padding: 10, 
    margin: 10, 
    backgroundColor:FLAG_COLOR_WHITE,
    justifyContent: "center",
    alignItems: "center"
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
    borderColor: FLAG_COLOR_ORANGE
  },
  pickerStyle:{
    height: 40,
    width: 80,
    marginLeft: 5,
    color: "black",
    borderRadius: 5
  },
  pickerContainerStyle:{
    flexDirection: "row",
    margin: 10,
    justifyContent: "flex-start",
    borderColor: FLAG_COLOR_ORANGE,
    borderWidth: 1 
  }
});