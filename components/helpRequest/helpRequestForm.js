import React, { Component } from "react";
import { Text, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from 'react-native-firebase';
import { View, TouchableOpacity, Modal, Picker } from "react-native";
import { FLAG_COLOR_ORANGE } from "../constants/styleConstants";

class HelpRequestForm extends Component {
  constructor() {
    super();
    this.state = {
      formVisible: false,
      noPeopleRequired: 1,
      title: "",
      description: "",
      latitude: null,
      longitude: null
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  }

  handleAddHelpRequest = () => {
    this.setState({ formVisible: !this.state.formVisible });
  };

  requestHelp = () => {
    this.setState({ formVisible: !this.state.formVisible });
    const { title, description, noPeopleRequired, longitude, latitude } = this.state;
    const data = {
      title: title,
      description,
      latitude,
      longitude,
      mobileNo: "+919886739068",
      name: "sharath",
      noPeopleRequired: parseInt(noPeopleRequired),
      timeStamp: new Date().getTime(),
      pushUps: 0,
      pullUps: 0,
      noPeopleRequested: 0,
      noPeopleAccepted: 0
    };
    firebase
      .database()
      .ref("/helps")
      .push(data, () => {
        console.log(`HELP REQUEST CREATED and data inserted to Firebase`);
      });
  };
  render(){
    return(
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.handleAddHelpRequest}
        style={styles.TouchableOpacityStyle}
      >
        <Icon name="plus-circle" size={50} color={COLOR_1} />
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent
        visible={this.state.formVisible}
      >
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.9)", flexDirection: "row" }}>
            <View
              colors={[COLOR_1, COLOR_2]}
              style={{ flex: 1, padding: 10, margin: 10, backgroundColor:FLAG_COLOR_ORANGE }}
            >
              <Input
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                placeholder="Title"
                onChangeText={value => this.setState({ title: value })}
              />
              <Input
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                multiline={true}
                numberOfLines={4}
                placeholder="Description"
                onChangeText={value => this.setState({ description: value })}
              />
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  justifyContent: "flex-start"
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  No of People Required
                </Text>
                <Picker
                  selectedValue={this.state.noPeopleRequired}
                  style={{
                    height: 40,
                    width: 80,
                    marginLeft: 5,
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: 5
                  }}
                  onValueChange={itemValue =>
                    this.setState({ noPeopleRequired: itemValue })
                  }
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
                type="outline"
                containerStyle={{
                  borderColor: COLOR_1,
                  margin: 5,
                  backgroundColor: "white"
                }}
                titleStyle={{ color: COLOR_1 }}
                onPress={this.requestHelp}
              />
              <Button
                type="outline"
                title="cancel"
                onPress={() =>
                  this.setState({ formVisible: !this.state.formVisible })
                }
                containerStyle={{
                  borderColor: COLOR_1,
                  margin: 5,
                  backgroundColor: "white"
                }}
                titleStyle={{ color: COLOR_1 }}
              />
            </View>
          </View>
        </Modal>
        </>
    );
  }
}

export default HelpRequestForm;