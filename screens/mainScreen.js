import React, { Component } from "react";
import { Text } from 'react-native-elements';
import { View, StyleSheet, Dimensions } from "react-native";
import { SCREEN_TITLES } from "../constants/appConstants";
import { createBottomTabNavigator } from 'react-navigation';
import HelpRequestFeed from "../components/helpRequest/helpRequestFeed";
import HelpRequestForm from "../components/helpRequest/helpRequestForm";

const FirstRoute = () => <View style={{flex:1}}><HelpRequestFeed db="helps" /><HelpRequestForm /></View>;

const SecondRoute = () => <HelpRequestFeed db="helping" />;

const ThirdRoute = () => <View style={[styles.scene]} ><Text>route 3</Text></View>


const BottomTabNavigator = createBottomTabNavigator({
  first:{screen:FirstRoute},
  second:{screen:SecondRoute},
  thirde:{screen:ThirdRoute}
},{
  initialRouteName:'first'
})
class MainScreen extends Component {
  // static navigationOptions = {
  //   title: SCREEN_TITLES.MAIN
  // };

  // handleLogOut = () => {
  //   const { navigation } = this.props;
  //   firebase.auth().signOut();
  //   navigation.navigate("Login", {});
  // };
 
  render() {
    return (
      <BottomTabNavigator />
    );
  }
}

export default MainScreen;

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
